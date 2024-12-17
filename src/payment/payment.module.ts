import { DynamicModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Module({})
export class PaymentModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PaymentModule,
      controllers: [PaymentController],
      imports: [
        ConfigModule.forRoot(),
        UsersModule,
        TypeOrmModule.forFeature([Order]),
      ],
      providers: [
        PaymentService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) => configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        }
      ],
    }
  }
}
