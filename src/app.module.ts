import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { OrderGateway } from './order/order.gateway';
import { RestaurantService } from './super-admin/restaurant/restaurant.service';
import { RestaurantController } from './super-admin/restaurant/restaurant.controller';
import { RestaurantModule } from './super-admin/restaurant/restaurant.module';

@Module({
  imports: [AuthModule, SuperAdminModule, OwnerModule, RestaurantModule],
  controllers: [AppController, AuthController, RestaurantController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    OrderGateway,
    RestaurantService,
  ],
})
export class AppModule {}
