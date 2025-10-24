import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/utils/roles.enum';
import { MenuService } from './menu.service';
import { CreateMenuDto } from '../dto/menu/create-menu.dto';
import { UpdateMenuDto } from '../dto/menu/update-menu.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('superAdmin/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create')
  createMenu(@Body() dto: CreateMenuDto) {
    return this.menuService.createMenu(dto);
  }

  @Patch('update')
  updateMenu(@Body() dto: UpdateMenuDto) {
    return this.menuService.updateMenu(dto);
  }
  @Get('all')
  getAllMenus() {
    return this.menuService.getAllMenus();
  }
}
