// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 ده بيخلي الموديول متاح في كل المشروع
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // لازم تصدّر الخدمة علشان تقدر تستخدمها برا الموديول
})
export class PrismaModule {}
