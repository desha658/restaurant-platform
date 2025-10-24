// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../utils/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// هذا الديكوريتور يستخدم لتحديد الأدوار المسموح بها للوصول إلى الدالة أو الكلاس
// يمكنك استخدامه كالتالي:
// @Roles(Role.Admin, Role.SubAdmin)
// async someFunction() {
//   // الكود هنا
// }
