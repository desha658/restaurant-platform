import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from '../dto/restaurant/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/restaurant/update-restaurant.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/utils/roles.enum';

const uploadDir = join(process.cwd(), 'uploads', 'restaurants');
const ensureUploadDir = () => {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

const fileUploadInterceptor = FileInterceptor('image', {
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
      return;
    }
    cb(null, true);
  },
});

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // 📋 عرض كل المطاعم
  @Get('all')
  getAllRestaurants() {
    return this.restaurantService.getAllRestaurants();
  }

  // 🔍 عرض مطعم واحد
  @Get(':id')
  getRestaurant(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin/create')
  @UseInterceptors(fileUploadInterceptor)
  createRestaurant(
    @Body() dto: CreateRestaurantDto,
    @UploadedFile() file?: any,
  ) {
    const imagePath = file
      ? `/uploads/restaurants/${file.filename}`
      : undefined;
    dto.imageUrl = imagePath ?? dto.imageUrl;
    return this.restaurantService.createRestaurant(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/update')
  @UseInterceptors(fileUploadInterceptor)
  updateRestaurant(
    @Body() dto: UpdateRestaurantDto,
    @UploadedFile() file?: any,
  ) {
    const imagePath = file
      ? `/uploads/restaurants/${file.filename}`
      : undefined;
    if (imagePath) {
      dto.imageUrl = imagePath;
    }
    return this.restaurantService.updateRestaurant(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('admin/delete/:id')
  deleteRestaurant(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.deleteRestaurant(id);
  }
}
