import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './review.service';
import { ReviewsController } from './review.controller';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    TypeOrmModule.forFeature([Review]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewModule { }
