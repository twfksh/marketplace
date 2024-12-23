import { Controller, Post, Param, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
  ) { }

  @Post('create-intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: number) {
    return this.paymentService.createPaymentIntent(orderId);
  }

  @Post('webhook')
  async webhookHandler(@Req() req: Request) {
    const signature = req.headers['stripe-signature'] as string;

    if (!req.body) throw new BadRequestException('No body provided');

    try {
      const event = this.paymentService.stripe.webhooks.constructEvent(
        req.body.toString(),
        signature,
        this.configService.get<string>('WHSEC'),
      );

      await this.paymentService.handleWebhook(event);
    } catch (err) {
      throw new BadRequestException(`webhook error: ${err.message}`);
    }
  }
}

