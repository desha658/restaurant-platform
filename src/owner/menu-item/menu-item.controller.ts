import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('owner/menu-item')
export class MenuItemController {
  constructor(private readonly service: MenuItemService) {}

  @Post('create')
  create(@Body() dto: CreateMenuItemDto) {
    return this.service.createMenuItem(dto);
  }

  @Get('all')
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Patch('update')
  update(@Body() dto: UpdateMenuItemDto) {
    return this.service.update(dto);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
