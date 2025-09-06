// Naming pattern: ROLE_CATEGORY_TYPE
export const RoleNames = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
} as const;

export const RoleDescriptions = {
  ADMIN: 'Quản trị viên hệ thống - Có toàn quyền truy cập',
  MANAGER: 'Quản lý - Có quyền quản lý người dùng và dữ liệu',
  STAFF: 'Nhân viên - Có quyền truy cập cơ bản theo vai trò',
} as const;
