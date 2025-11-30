export type AuthUser = {
  id: number;
  role: 'OWNER_BRANCH' | 'OWNER' | 'SUPER_ADMIN' | 'CUSTOMER';
  branchId?: number; // موجودة فقط لو user.role === 'OWNER_BRANCH'
};
