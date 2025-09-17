// Naming pattern: METADATA_CATEGORY_TYPE
export const IngredientMetadata = {
  OPERATION: {
    SUMMARY: {
      CREATE: 'Tạo nguyên liệu mới',
      LIST: 'Lấy danh sách nguyên liệu',
      GET_BY_ID: 'Lấy thông tin nguyên liệu theo ID',
      UPDATE: 'Cập nhật nguyên liệu theo ID',
      DELETE: 'Xóa nguyên liệu theo ID',
    },
    DESCRIPTION: {
      CREATE: 'Tạo một nguyên liệu mới để cấu hình nhập/xuất sau này',
      LIST: 'Trả về danh sách tất cả nguyên liệu',
      GET_BY_ID: 'Trả về thông tin chi tiết của một nguyên liệu',
      UPDATE: 'Cập nhật thông tin của nguyên liệu',
      DELETE:
        'Xóa một nguyên liệu theo ID (xóa mềm = chuyển INACTIVE, hoặc xóa vĩnh viễn)',
    },
  },
  TAGS: {
    INGREDIENT: 'Nguyên liệu',
  },
  PARAMETERS: {
    ID: 'ID của nguyên liệu',
    HARD_DELETE: 'Thực hiện xóa vĩnh viễn',
  },
  RESPONSES: {
    CREATE_SUCCESS: 'Tạo nguyên liệu thành công',
    LIST_SUCCESS: 'Lấy danh sách nguyên liệu thành công',
    GET_SUCCESS: 'Lấy thông tin nguyên liệu thành công',
    UPDATE_SUCCESS: 'Cập nhật nguyên liệu thành công',
    DELETE_SUCCESS: 'Xóa nguyên liệu thành công',
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
    UNAUTHORIZED_ACCESS: 'Chưa xác thực',
    FORBIDDEN_ACCESS: 'Không có quyền truy cập',
    NOT_FOUND: 'Không tìm thấy nguyên liệu',
  },
} as const;

