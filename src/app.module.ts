import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { OrderGateway } from './order/order.gateway';
import { BranchModule } from './branch/branch.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    SuperAdminModule,
    OwnerModule,
    BranchModule,
    MenuModule,
    CategoryModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, OrderGateway],
})
export class AppModule {}
