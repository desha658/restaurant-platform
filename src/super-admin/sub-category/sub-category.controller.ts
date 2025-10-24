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
import { SubCategoryService } from './sub-category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/utils/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateSubCategoryDto } from '../dto/subCategory/create-subCategory.dto';
import { UpdateSubCategoryDto } from '../dto/subCategory/update-subCategory.dto';

@Controller('superAdmin/sub-category')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.OWNER_BRANCH)
  @Post('create')
  register(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Get('all')
  getAllCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Patch('update')
  updateCategory(@Body() dto: UpdateSubCategoryDto) {
    return this.subCategoryService.updateSubCategory(dto);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.deleteSubCategory(id);
  }
}
