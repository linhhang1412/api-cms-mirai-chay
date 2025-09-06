export const IngredientCategoryMetadata = {
  OPERATION: {
    SUMMARY: {
      CREATE: 'Tạo danh mục nguyên liệu',
      LIST: 'Danh sách danh mục',
      GET_BY_ID: 'Chi tiết danh mục',
      UPDATE: 'Cập nhật danh mục',
      DELETE: 'Xóa danh mục',
    },
    DESCRIPTION: {
      CREATE: 'Tạo một danh mục mới',
      LIST: 'Lấy danh sách danh mục có phân trang và tìm kiếm',
      GET_BY_ID: 'Lấy chi tiết danh mục theo ID',
      UPDATE: 'Cập nhật danh mục theo ID',
      DELETE: 'Xóa mềm hoặc xóa vĩnh viễn danh mục',
    },
  },
  TAGS: { CATEGORY: 'Danh mục nguyên liệu' },
  PARAMETERS: {
    ID: 'ID danh mục',
    PAGE: 'Trang (mặc định: 1)',
    LIMIT: 'Số mục mỗi trang (mặc định: 10)',
    SEARCH: 'Từ khóa (code/name)',
    HARD_DELETE: 'Xóa vĩnh viễn',
  },
  RESPONSES: {
    CREATE_SUCCESS: 'Tạo danh mục thành công',
    LIST_SUCCESS: 'Lấy danh sách danh mục thành công',
    GET_SUCCESS: 'Lấy chi tiết danh mục thành công',
    UPDATE_SUCCESS: 'Cập nhật danh mục thành công',
    DELETE_SUCCESS: 'Xóa danh mục thành công',
  },
} as const;

