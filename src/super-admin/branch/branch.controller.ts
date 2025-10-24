import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { UpdateBranchDto } from '../dto/branch/update-branch.dto';
import { CreateBranchDto } from '../dto/branch/create-branch.dto';

@Controller('superAdmin/branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  // Braches
  @Post('create')
  createBranch(@Body() data: CreateBranchDto) {
    return this.branchService.createBranch(data);
  }
  @Get('all')
  getAllBranches() {
    return this.branchService.getAllBranches();
  }

  // 🔍 عرض مطعم واحد
  @Get(':id')
  getBranchById(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.getBranchById(id);
  }

  // ✏️ تعديل مطعم
  @Patch('update')
  updateBranch(@Body() dto: UpdateBranchDto) {
    return this.branchService.updateBranch(dto);
  }

  // 🗑️ حذف مطعم
  @Delete('delete/:id')
  deleteBranch(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.deleteBranch(id);
  }
}
