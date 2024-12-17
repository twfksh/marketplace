import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, items } = createOrderDto;

    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productsService.findProductById(item.productId);
      if (!product) throw new NotFoundException('Product not found');

      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });
      orderItems.push(orderItem);
      total += orderItem.price;
    }

    const order = this.ordersRepository.create({
      user,
      status: 'placed',
      total,
      items: orderItems,
    })

    return this.ordersRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'items', 'items.product'] });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id }, relations: ['user', 'items', 'items.product'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOrderById(id);
    if (!order) throw new NotFoundException('Order not found');

    order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }

  async removeOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    if (!order) throw new NotFoundException('Order not found');
    await this.ordersRepository.remove(order);
  }
}
