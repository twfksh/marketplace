import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(JwtAuthGuard, new RoleGuard('customer'))
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RoleGuard('admin'))
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOrderById(@Param('id') id: string) {
    return this.ordersService.findOrderById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrderStatus(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeOrder(@Param('id') id: string) {
    return this.ordersService.removeOrder(+id);
  }
}
