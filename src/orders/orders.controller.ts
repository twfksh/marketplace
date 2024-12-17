import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  findOrderById(@Param('id') id: string) {
    return this.ordersService.findOrderById(+id);
  }

  @Patch(':id')
  updateOrderStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrderStatus(+id, updateOrderDto);
  }

  @Delete(':id')
  removeOrder(@Param('id') id: string) {
    return this.ordersService.removeOrder(+id);
  }
}
