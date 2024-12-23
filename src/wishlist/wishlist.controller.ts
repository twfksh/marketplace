import { Controller, Post, Delete, Get, Param, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post(':productId')
  addToWishlist(@Req() req: Request, @Param('productId') productId: number) {
    const userId = (req.user as User).id;
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req: Request, @Param('productId') productId: number) {
    const userId = (req.user as User).id;
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get()
  viewWishlist(@Req() req: Request) {
    const userId = (req.user as User).id;
    return this.wishlistService.viewWishlist(userId);
  }
}