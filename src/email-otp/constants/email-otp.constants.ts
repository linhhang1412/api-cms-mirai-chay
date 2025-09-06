// Naming pattern: EMAIL_OTP_CATEGORY_TYPE
export const EmailOtpConstants = {
  // DEFAULT VALUES
  DEFAULTS: {
    OTP_LENGTH: 6,
    EXPIRATION_MINUTES: 5,
    MAX_ATTEMPTS: 5,
  },
} as const;
