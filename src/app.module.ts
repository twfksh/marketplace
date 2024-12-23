import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';

// TODO: resolve forwardRef issue in auth and users module 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfigService.envOptions()),
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentModule.forRootAsync(),
    AuthModule,
    CartModule,
    ReviewModule,
    CloudinaryModule,
    WishlistModule,
    NotificationsModule,
  ],
})
export class AppModule { }
