// Naming pattern: NOTIF_CATEGORY_SETTING
export const NotificationConfig = {
  ENV: {
    RESEND_API_KEY: 'RESEND_API_KEY',
  },
  EMAIL: {
    FROM: 'Mirai Chay <no-reply@dev.miraichay.com>',
    SUBJECTS: {
      OTP: 'Mã xác thực đăng nhập Mirai Chay',
    },
  },
  TEMPLATES: {
    BASE: 'base',
    OTP: 'otp',
  },
} as const;
