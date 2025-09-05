export const AuthErrorMessages = {
  // Request OTP errors
  EMAIL_NOT_REGISTERED: 'Email chưa được đăng ký trong hệ thống',
  
  // Verify OTP errors
  OTP_INVALID_OR_EXPIRED: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  
  // User errors
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  
  // Token errors
  INVALID_REFRESH_TOKEN: 'Token làm mới không hợp lệ',
} as const;

export const AuthSuccessMessages = {
  OTP_SENT: 'Mã OTP đã được gửi đến email',
  TOKEN_REFRESHED: 'Token đã được làm mới thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
} as const;