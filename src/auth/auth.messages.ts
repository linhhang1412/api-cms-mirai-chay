export const AuthErrorMessages = {
  // Request OTP errors
  EMAIL_NOT_REGISTERED: 'Email chưa được đăng ký trong hệ thống',

  // Verify OTP errors
  OTP_INVALID_OR_EXPIRED: 'Mã OTP không hợp lệ hoặc đã hết hạn',

  // User errors
  USER_NOT_FOUND: 'Không tìm thấy người dùng',

  // Token errors
  INVALID_REFRESH_TOKEN: 'Token làm mới không hợp lệ',

  // Authentication errors
  UNAUTHORIZED: 'Chưa xác thực',
} as const;

export const AuthSuccessMessages = {
  OTP_SENT: 'Mã OTP đã được gửi đến email',
  TOKEN_REFRESHED: 'Token đã được làm mới thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
} as const;

export const AuthOperationSummaries = {
  REQUEST_OTP: 'Yêu cầu mã OTP để đăng nhập',
  VERIFY_OTP: 'Xác thực mã OTP và nhận token truy cập',
  REFRESH_TOKEN: 'Làm mới token truy cập',
  LOGOUT: 'Đăng xuất người dùng',
} as const;

export const AuthOperationDescriptions = {
  REQUEST_OTP: 'Gửi mã OTP đến email đã đăng ký để xác thực đăng nhập',
  VERIFY_OTP: 'Xác thực mã OTP nhận được qua email để nhận token truy cập',
  REFRESH_TOKEN: 'Làm mới token truy cập bằng refresh token',
  LOGOUT: 'Đăng xuất người dùng khỏi hệ thống',
} as const;

export const AuthResponseDescriptions = {
  SUCCESS: 'Thành công',
  OTP_SENT: 'Mã OTP đã được gửi thành công',
  TOKEN_REFRESHED: 'Token đã được làm mới thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  INVALID_EMAIL_FORMAT: 'Định dạng email không hợp lệ',
  EMAIL_NOT_REGISTERED: 'Email chưa được đăng ký trong hệ thống',
  OTP_INVALID_OR_EXPIRED: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  INVALID_REFRESH_TOKEN: 'Token làm mới không hợp lệ',
  UNAUTHORIZED: 'Chưa xác thực',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
} as const;

export const AuthApiTags = {
  AUTH: 'Xác thực',
} as const;

export const AuthRateLimits = {
  REQUEST_OTP: {
    limit: 5,
    ttl: 60000, // 1 minute
  },
  VERIFY_OTP: {
    limit: 10,
    ttl: 60000, // 1 minute
  },
} as const;

export const AuthJwtConfig = {
  SECRET: process.env.JWT_SECRET || 'changeme',
  ACCESS_TOKEN_EXPIRES_IN: '1h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const AuthDtoDescriptions = {
  EMAIL: 'Địa chỉ email của người dùng',
  OTP_CODE: 'Mã OTP 6 chữ số',
} as const;

export const AuthDtoExamples = {
  EMAIL: 'nguoidung@example.com',
  OTP_CODE: '123456',
} as const;

export const AuthOtpConfig = {
  LENGTH: 6,
} as const;

export const AuthConstants = {
  ROLES_KEY: 'roles',
} as const;
