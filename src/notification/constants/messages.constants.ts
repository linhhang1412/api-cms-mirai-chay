// Naming pattern: VERB_NOUN_ACTION
export const NotificationMessages = {
  WARN: {
    MISSING_API_KEY:
      'Thiếu RESEND_API_KEY. Hệ thống sẽ chạy ở chế độ mô phỏng (dry-run).',
  },
  LOG: {
    START_RENDER_OTP: 'Bắt đầu tạo template email OTP cho {{to}}',
    TEMPLATE_RENDERED: 'Template email OTP đã được tạo cho {{to}}',
    SENDING_EMAIL: 'Đang gửi email OTP đến {{to}}',
    SENT_SUCCESS_DEV:
      'Email OTP đã được gửi thành công đến {{to}}. Phản hồi: {{response}}',
    DRY_RUN_SEND: 'Chế độ mô phỏng: giả lập gửi email OTP đến {{to}}',
    READING_TEMPLATE: 'Đang đọc template từ: {{path}}',
    TEMPLATE_COMPILED: 'Template {{name}} đã được biên dịch thành công',
  },
  ERROR: {
    SEND_FAILED: 'Gửi email OTP thất bại đến {{to}}: {{message}}',
    SEND_FAILED_USER: 'Gửi email OTP thất bại',
  },
} as const;
