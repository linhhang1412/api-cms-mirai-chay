// Naming pattern: VERB_NOUN_ACTION
export const IngredientMessages = {
  ERROR: {
    CREATE_FAILED: 'Tạo nguyên liệu thất bại',
    UPDATE_FAILED: 'Cập nhật nguyên liệu thất bại',
    DELETE_FAILED: 'Xóa nguyên liệu thất bại',
    FETCH_FAILED: 'Lấy thông tin nguyên liệu thất bại',
    FETCH_LIST_FAILED: 'Lấy danh sách nguyên liệu thất bại',
    NOT_FOUND: 'Không tìm thấy nguyên liệu',
    CODE_ALREADY_EXISTS: 'Mã nguyên liệu (code) đã tồn tại',
  },
  SUCCESS: {
    CREATED: 'Tạo nguyên liệu thành công',
    UPDATED: 'Cập nhật nguyên liệu thành công',
    DELETED: 'Nguyên liệu đã được xóa vĩnh viễn',
    DEACTIVATED: 'Nguyên liệu đã được vô hiệu hóa',
  },
  RESPONSE: {
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
    UNAUTHORIZED_ACCESS: 'Chưa xác thực',
    FORBIDDEN_ACCESS: 'Không có quyền truy cập',
  },
} as const;

