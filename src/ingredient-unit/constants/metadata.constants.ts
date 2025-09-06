export const IngredientUnitMetadata = {
  OPERATION: {
    SUMMARY: {
      CREATE: 'Tạo đơn vị nguyên liệu',
      LIST: 'Danh sách đơn vị',
      GET_BY_ID: 'Chi tiết đơn vị',
      UPDATE: 'Cập nhật đơn vị',
      DELETE: 'Xóa đơn vị',
    },
    DESCRIPTION: {
      CREATE: 'Tạo một đơn vị mới',
      LIST: 'Lấy danh sách đơn vị có phân trang và tìm kiếm',
      GET_BY_ID: 'Lấy chi tiết đơn vị theo ID',
      UPDATE: 'Cập nhật đơn vị theo ID',
      DELETE: 'Xóa mềm hoặc xóa vĩnh viễn đơn vị',
    },
  },
  TAGS: { UNIT: 'Đơn vị nguyên liệu' },
  PARAMETERS: {
    ID: 'ID đơn vị',
    PAGE: 'Trang (mặc định: 1)',
    LIMIT: 'Số mục mỗi trang (mặc định: 10)',
    SEARCH: 'Từ khóa (code/name)',
    HARD_DELETE: 'Xóa vĩnh viễn',
  },
  RESPONSES: {
    CREATE_SUCCESS: 'Tạo đơn vị thành công',
    LIST_SUCCESS: 'Lấy danh sách đơn vị thành công',
    GET_SUCCESS: 'Lấy chi tiết đơn vị thành công',
    UPDATE_SUCCESS: 'Cập nhật đơn vị thành công',
    DELETE_SUCCESS: 'Xóa đơn vị thành công',
  },
} as const;

