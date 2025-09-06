// Naming pattern: AUTH_CATEGORY_TYPE
export const AuthApiTags = {
  AUTH: 'Xác thực',
} as const;

export const AuthFieldDescriptions = {
  EMAIL: 'Địa chỉ email của người dùng',
  OTP_CODE: 'Mã OTP 6 chữ số',
} as const;

export const AuthFieldExamples = {
  EMAIL: 'nguoidung@example.com',
  OTP_CODE: '123456',
} as const;
