import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/utils/roles.enum';
import { SuperAdminService } from './super-admin.service';
import { CreateRestaurantDto } from './dto/restaurant/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/restaurant/update-restaurant.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('superAdmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}
  @Post('restaurant/create')
  createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.superAdminService.createRestaurant(dto);
  }

  // ✏️ تعديل مطعم
  @Patch('restaurant/update')
  updateRestaurant(@Body() dto: UpdateRestaurantDto) {
    return this.superAdminService.updateRestaurant(dto);
  }

  // 🗑️ حذف مطعم
  @Delete('restaurant/delete/:id')
  deleteRestaurant(@Param('id', ParseIntPipe) id: number) {
    return this.superAdminService.deleteRestaurant(id);
  }
}
