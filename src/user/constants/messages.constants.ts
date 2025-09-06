// Naming pattern: VERB_NOUN_ACTION
export const UserMessages = {
  // ERROR MESSAGES - Pattern: ERROR_CATEGORY_ACTION
  ERROR: {
    // CREATE ERRORS
    CREATE_USER_FAILED: 'Tạo người dùng thất bại',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',

    // FETCH ERRORS
    FETCH_USERS_FAILED: 'Lấy danh sách người dùng thất bại',
    FETCH_USER_FAILED: 'Lấy thông tin người dùng thất bại',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',

    // UPDATE ERRORS
    UPDATE_USER_FAILED: 'Cập nhật thông tin người dùng thất bại',

    // DELETE ERRORS
    DELETE_USER_FAILED: 'Xóa người dùng thất bại',
    DEACTIVATE_USER_FAILED: 'Vô hiệu hóa người dùng thất bại',

    // VALIDATION ERRORS
    INVALID_EMAIL_FORMAT: 'Định dạng email không hợp lệ',
    INVALID_PHONE_FORMAT: 'Định dạng số điện thoại không hợp lệ',
  },

  // SUCCESS MESSAGES - Pattern: SUCCESS_ACTION_COMPLETED
  SUCCESS: {
    // CREATE SUCCESS
    USER_CREATED: 'Tạo người dùng thành công',

    // UPDATE SUCCESS
    USER_UPDATED: 'Cập nhật người dùng thành công',

    // DELETE SUCCESS
    USER_DELETED: 'Người dùng đã được xóa vĩnh viễn',
    USER_DEACTIVATED: 'Người dùng đã được vô hiệu hóa',

    // OTHER SUCCESS
    USER_FOUND: 'Tìm thấy người dùng',
  },

  // RESPONSE MESSAGES - Pattern: RESPONSE_ACTION_STATUS
  RESPONSE: {
    OPERATION_SUCCESSFUL: 'Thành công',
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
    UNAUTHORIZED_ACCESS: 'Chưa xác thực',
    FORBIDDEN_ACCESS: 'Không có quyền truy cập',
  },
} as const;
