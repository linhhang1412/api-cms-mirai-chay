// Naming pattern: METADATA_CATEGORY_TYPE
export const UserMetadata = {
  // API OPERATION METADATA
  OPERATION: {
    SUMMARY: {
      CREATE_USER: 'Tạo người dùng mới',
      GET_ALL_USERS: 'Lấy danh sách tất cả người dùng',
      GET_USER_BY_ID: 'Lấy thông tin người dùng theo ID',
      GET_USER_BY_EMAIL: 'Lấy thông tin người dùng theo email',
      UPDATE_USER: 'Cập nhật thông tin người dùng theo ID',
      DELETE_USER: 'Xóa người dùng theo ID',
    },

    DESCRIPTION: {
      CREATE_USER: 'Tạo một người dùng mới trong hệ thống',
      GET_ALL_USERS: 'Lấy danh sách tất cả người dùng trong hệ thống',
      GET_USER_BY_ID: 'Lấy thông tin chi tiết của một người dùng theo ID',
      GET_USER_BY_EMAIL: 'Lấy thông tin chi tiết của một người dùng theo email',
      UPDATE_USER: 'Cập nhật thông tin của một người dùng theo ID',
      DELETE_USER: 'Xóa một người dùng theo ID (có thể là xóa mềm hoặc xóa vĩnh viễn)',
    },
  },

  // API TAGS
  TAGS: {
    USER: 'Người dùng',
  },

  // PARAMETER DESCRIPTIONS
  PARAMETERS: {
    USER_ID: 'ID của người dùng',
    USER_EMAIL: 'Email của người dùng',
    HARD_DELETE: 'Thực hiện xóa vĩnh viễn',
  },

  // RESPONSE DESCRIPTIONS
  RESPONSES: {
    CREATE_USER_SUCCESS: 'Tạo người dùng thành công',
    GET_ALL_USERS_SUCCESS: 'Lấy danh sách người dùng thành công',
    GET_USER_BY_ID_SUCCESS: 'Lấy thông tin người dùng thành công',
    GET_USER_BY_EMAIL_SUCCESS: 'Lấy thông tin người dùng thành công',
    UPDATE_USER_SUCCESS: 'Cập nhật thông tin người dùng thành công',
    DELETE_USER_SUCCESS: 'Xóa người dùng thành công',
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
    UNAUTHORIZED_ACCESS: 'Chưa xác thực',
    FORBIDDEN_ACCESS: 'Không có quyền truy cập',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    USER_PERMANENTLY_DELETED: 'Người dùng đã được xóa vĩnh viễn',
    USER_DEACTIVATED: 'Người dùng đã được vô hiệu hóa',
  },
} as const;