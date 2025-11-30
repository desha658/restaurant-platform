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
import { BranchService } from './branch.service';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Role } from 'src/common/utils/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('branch')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
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
  @Get(':branchId/menu')
  getBranchMenu(@Param('branchId') branchId: string) {
    return this.branchService.getBranchMenu(Number(branchId));
  }
}
