import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
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
}
