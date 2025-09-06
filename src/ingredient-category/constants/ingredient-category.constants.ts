export const IngredientCategoryConstants = {
  API: {
    TAGS: {
      CATEGORY: 'Danh mục nguyên liệu',
    },
  },
  FIELDS: {
    DESCRIPTIONS: {
      ID: 'ID nội bộ của danh mục',
      CODE: 'Mã danh mục (duy nhất)',
      NAME: 'Tên danh mục',
      ACTIVE: 'Trạng thái hoạt động',
      CREATED_AT: 'Thời gian tạo',
      UPDATED_AT: 'Thời gian cập nhật',
    },
    EXAMPLES: {
      ID: 1,
      CODE: 'RAUCU',
      NAME: 'Rau củ quả',
    },
  },
} as const;

