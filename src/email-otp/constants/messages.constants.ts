// Naming pattern: VERB_NOUN_ACTION
export const EmailOtpMessages = {
  ERROR: {
    OTP_INVALID_OR_EXPIRED: 'OTP không hợp lệ hoặc đã hết hạn',
    OTP_MAX_ATTEMPTS_REACHED: 'OTP bị khóa do nhập sai quá nhiều lần',
    OTP_SEND_FAILED: 'Gửi OTP thất bại',
  },
  SUCCESS: {
    OTP_GENERATED_AND_SENT: 'Mã OTP đã được tạo và gửi thành công',
    OTP_VERIFIED: 'Xác thực OTP thành công',
  },
  LOG: {
    REVOKED_OLD_OTPS: 'Đã thu hồi {{count}} mã OTP đang hiệu lực cho {{email}}',
    REVOKE_FAILED: 'Thu hồi OTP cũ thất bại cho {{email}}',
    SEND_FAILED: 'Gửi email OTP thất bại',
  },
} as const;
