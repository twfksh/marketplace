import { Controller, Post, Get, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('add')
  addItem(@Req() req: Request, @Body() createCartItemDto: CreateCartItemDto) {
    const user = req.user as User;
    const userId = user.id;
    return this.cartService.addItem(userId, createCartItemDto);
  }

  @Patch('update/:itemId')
  updateItem(@Req() req: Request, @Param('itemId') itemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
    const user = req.user as User;
    const userId = user.id;
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete('remove/:itemId')
  removeItem(@Req() req: Request, @Param('itemId') itemId: number) {
    const user = req.user as User;
    const userId = user.id;
    return this.cartService.removeItem(userId, itemId);
  }

  @Get('summary')
  getCartSummary(@Req() req: Request) {
    const user = req.user as User;
    const userId = user.id;
    return this.cartService.getCartSummary(userId);
  }

  @Post('checkout')
  async checkout(@Req() req: Request) {
    const user = req.user as User;
    const userId = user.id;
    const cart = await this.cartService.getCartSummary(userId);
    // Integrate the order placement and payment here
    await this.cartService.clearCart(userId);
    return { message: 'Checkout successful' };
  }
}