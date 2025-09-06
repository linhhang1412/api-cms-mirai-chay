// Naming pattern: USER_CATEGORY_TYPE
export const UserConstants = {
  // API TAGS
  API: {
    TAGS: {
      USER: 'Người dùng',
    },
  },
  
  // FIELD CONFIGURATIONS
  FIELDS: {
    DESCRIPTIONS: {
      EMAIL: 'Địa chỉ email của người dùng',
      FULL_NAME: 'Họ và tên của người dùng',
      PHONE: 'Số điện thoại của người dùng',
      ROLE: 'Vai trò của người dùng',
      STATUS: 'Trạng thái của người dùng',
      AVATAR: 'URL ảnh đại diện',
      ID: 'ID nội bộ của người dùng',
      PUBLIC_ID: 'ID công khai của người dùng (UUID)',
      LAST_LOGIN_AT: 'Thời gian đăng nhập lần cuối',
      LAST_OTP_SENT_AT: 'Thời gian gửi OTP lần cuối',
      FAILED_LOGIN_AT: 'Thời gian đăng nhập thất bại lần cuối',
      CREATED_AT: 'Thời gian tạo bản ghi',
      UPDATED_AT: 'Thời gian cập nhật bản ghi',
    },
    
    EXAMPLES: {
      EMAIL: 'nguoidung@example.com',
      FULL_NAME: 'Nguyễn Văn A',
      PHONE: '0123456789',
      AVATAR: 'https://example.com/avatar.jpg',
      ID: 1,
      PUBLIC_ID: '550e8400-e29b-41d4-a716-446655440000',
      DATE: '2023-01-01T00:00:00Z',
    },
  },
  
  // DEFAULT VALUES
  DEFAULTS: {
    ROLE: 'STAFF',
    STATUS: 'ACTIVE',
  },
} as const;