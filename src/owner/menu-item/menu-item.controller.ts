import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

const uploadDir = join(process.cwd(), 'uploads', 'menu-items');
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

const fileInterceptor = FileInterceptor('image', {
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
      return;
    }
    cb(null, true);
  },
});

const normalizeMenuIds = (value: unknown): number[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.map((val) => Number(val)).filter((num) => !Number.isNaN(num));
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(',')
      .map((val) => Number(val.trim()))
      .filter((num) => !Number.isNaN(num));
  }
  return undefined;
};

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
};

@Controller('owner/menu-item')
export class MenuItemController {
  constructor(private readonly service: MenuItemService) {}

  @Post('create')
  @UseInterceptors(fileInterceptor)
  create(@Body() dto: CreateMenuItemDto, @UploadedFile() file?: any) {
    const imagePath = file ? `/uploads/menu-items/${file.filename}` : undefined;
    dto.imageUrl = imagePath ?? dto.imageUrl;
    dto.menuIds = normalizeMenuIds((dto as any).menuIds);
    if (dto.subCategoryId) {
      dto.subCategoryId = Number(dto.subCategoryId);
    }
    const normalizedAvailable = normalizeBoolean((dto as any).isAvailable);
    if (typeof normalizedAvailable === 'boolean') {
      dto.isAvailable = normalizedAvailable;
    }
    dto.price = Number(dto.price);
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
  @UseInterceptors(fileInterceptor)
  update(@Body() dto: UpdateMenuItemDto, @UploadedFile() file?: any) {
    const imagePath = file ? `/uploads/menu-items/${file.filename}` : undefined;
    if (imagePath) {
      dto.imageUrl = imagePath;
    }
    dto.menuIds = normalizeMenuIds((dto as any).menuIds);
    if (dto.subCategoryId) {
      dto.subCategoryId = Number(dto.subCategoryId);
    }
    const normalizedAvailable = normalizeBoolean((dto as any).isAvailable);
    if (typeof normalizedAvailable === 'boolean') {
      dto.isAvailable = normalizedAvailable;
    }
    if (dto.price !== undefined && dto.price !== null) {
      dto.price = Number(dto.price);
    }
    if (dto.id) {
      dto.id = Number(dto.id);
    }
    return this.service.update(dto);
  }

  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
