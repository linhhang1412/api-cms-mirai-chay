// Naming pattern: METADATA_CATEGORY_TYPE
export const AuthMetadata = {
  // API OPERATION METADATA
  OPERATION: {
    SUMMARY: {
      REQUEST_OTP: 'Yêu cầu mã OTP để đăng nhập',
      VERIFY_OTP: 'Xác thực mã OTP và nhận token truy cập',
      REFRESH_TOKEN: 'Làm mới token truy cập',
      USER_LOGOUT: 'Đăng xuất người dùng',
    },

    DESCRIPTION: {
      REQUEST_OTP: 'Gửi mã OTP đến email đã đăng ký để xác thực đăng nhập',
      VERIFY_OTP: 'Xác thực mã OTP nhận được qua email để nhận token truy cập',
      REFRESH_TOKEN: 'Làm mới token truy cập bằng refresh token',
      USER_LOGOUT: 'Đăng xuất người dùng khỏi hệ thống',
    },
  },

  // API TAGS
  TAGS: {
    AUTHENTICATION: 'Xác thực',
  },

  // DTO METADATA
  DTO: {
    FIELD_DESCRIPTIONS: {
      USER_EMAIL: 'Địa chỉ email của người dùng',
      OTP_CODE: 'Mã OTP 6 chữ số',
    },

    FIELD_EXAMPLES: {
      USER_EMAIL: 'nguoidung@example.com',
      OTP_CODE: '123456',
    },
  },
} as const;
