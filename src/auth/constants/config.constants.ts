// Naming pattern: CONFIG_CATEGORY_SETTING
export const AuthConfig = {
  // JWT CONFIGURATION
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET || 'changeme',
    ACCESS_TOKEN_EXPIRES: '1h',
    REFRESH_TOKEN_EXPIRES: '7d',
  },

  // OTP CONFIGURATION
  OTP: {
    CODE_LENGTH: 6,
    EXPIRATION_MINUTES: 5,
  },

  // RATE LIMITING CONFIGURATION
  RATE_LIMIT: {
    REQUEST_OTP: {
      MAX_REQUESTS: 5,
      TIME_WINDOW_MS: 60000,
    },
    VERIFY_OTP: {
      MAX_REQUESTS: 10,
      TIME_WINDOW_MS: 60000,
    },
  },
} as const;
