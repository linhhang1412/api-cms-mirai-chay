// Naming pattern: VERB_NOUN_ACTION
export const AuthMessages = {
  // ERROR MESSAGES - Pattern: ERROR_CATEGORY_ACTION
  ERROR: {
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    EMAIL_NOT_REGISTERED: 'Email chưa được đăng ký trong hệ thống',
    OTP_INVALID_OR_EXPIRED: 'Mã OTP không hợp lệ hoặc đã hết hạn',
    TOKEN_REFRESH_INVALID: 'Token làm mới không hợp lệ',
    UNAUTHORIZED_ACCESS: 'Chưa xác thực',
  },

  // SUCCESS MESSAGES - Pattern: SUCCESS_ACTION_COMPLETED
  SUCCESS: {
    OTP_SENT_TO_EMAIL: 'Mã OTP đã được gửi đến email',
    TOKEN_REFRESHED_SUCCESSFULLY: 'Token đã được làm mới thành công',
    USER_LOGGED_OUT_SUCCESSFULLY: 'Đăng xuất thành công',
  },

  // RESPONSE MESSAGES - Pattern: RESPONSE_ACTION_STATUS
  RESPONSE: {
    OPERATION_SUCCESSFUL: 'Thành công',
    OTP_EMAIL_SENT: 'Mã OTP đã được gửi thành công',
    INVALID_EMAIL_FORMAT: 'Định dạng email không hợp lệ',
  },
} as const;
