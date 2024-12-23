import { Controller, Post, Get, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from './review.service';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post(':productId')
    addReview(@Req() req: Request, @Param('productId') productId: number, @Body() createReviewDto: CreateReviewDto) {
        const user = req.user as User;
        const userId = user.id;
        return this.reviewsService.addReview(userId, productId, createReviewDto);
    }

    @Patch(':reviewId')
    updateReview(@Req() req: Request, @Param('reviewId') reviewId: number, @Body() updateReviewDto: UpdateReviewDto) {
        const user = req.user as User;
        const userId = user.id;
        return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
    }

    @Delete(':reviewId')
    deleteReview(@Req() req: Request, @Param('reviewId') reviewId: number) {
        const user = req.user as User;
        const userId = user.id;
        return this.reviewsService.deleteReview(userId, reviewId);
    }

    @Get('product/:productId')
    getProductReviews(@Param('productId') productId: number) {
        return this.reviewsService.getProductReviews(productId);
    }
}