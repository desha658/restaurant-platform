import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/utils/roles.enum';
import { MenuService } from './menu.service';
import { CreateMenuDto } from 'src/menu/dto/create-menu.dto';
import { UpdateMenuDto } from 'src/menu/dto/update-menu.dto';
import { AuthUser } from 'src/common/utils/auth-user';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.OWNER_BRANCH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  createMenu(@Body() dto: CreateMenuDto, @Req() req) {
    const user: AuthUser = req.user;
    return this.menuService.createMenu(dto, user);
  }
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.OWNER_BRANCH)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update')
  updateMenu(@Body() dto: UpdateMenuDto, @Req() req) {
    const user: AuthUser = req.user;
    return this.menuService.updateMenu(dto, user);
  }
  @Get('all')
  getAllMenus() {
    return this.menuService.getAllMenus();
  }
}
