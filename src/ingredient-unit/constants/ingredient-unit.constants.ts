export const IngredientUnitConstants = {
  API: { TAGS: { UNIT: 'Đơn vị nguyên liệu' } },
  FIELDS: {
    DESCRIPTIONS: {
      ID: 'ID nội bộ của đơn vị',
      CODE: 'Mã đơn vị (duy nhất)',
      NAME: 'Tên đơn vị',
      ACTIVE: 'Trạng thái hoạt động',
      CREATED_AT: 'Thời gian tạo',
      UPDATED_AT: 'Thời gian cập nhật',
    },
    EXAMPLES: {
      ID: 1,
      CODE: 'G',
      NAME: 'Gram',
    },
  },
} as const;

