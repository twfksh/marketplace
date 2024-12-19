import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_API_KEY'), {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId }, relations: ['user', 'items', 'items.product'] })
    if (!order) throw new NotFoundException('Order not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = parseInt(paymentIntent.metadata.orderId);

      const order = await this.ordersRepository.findOne({
        where: { id: orderId }, relations: ['user', 'items', 'items.product']
      });
      if (order) {
        order.status = 'paid';
        await this.ordersRepository.save(order);
      }
    }
  }
}
