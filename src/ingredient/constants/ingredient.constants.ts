// Naming pattern: INGREDIENT_CATEGORY_TYPE
export const IngredientConstants = {
  // API TAGS
  API: {
    TAGS: {
      INGREDIENT: 'Nguyên liệu',
    },
  },

  // FIELD CONFIGURATIONS
  FIELDS: {
    DESCRIPTIONS: {
      CODE: 'Mã SKU ngắn và duy nhất của nguyên liệu',
      NAME: 'Tên nguyên liệu',
      CATEGORY: 'Tên danh mục (legacy - đã tách bảng)',
      CATEGORY_ID: 'ID danh mục nguyên liệu',
      UNIT_ID: 'ID đơn vị nguyên liệu',
      REFERENCE_PRICE: 'Giá tham chiếu (VND)',
      STATUS: 'Trạng thái hoạt động (ACTIVE/INACTIVE)',
      ID: 'ID nội bộ của nguyên liệu',
      PUBLIC_ID: 'ID công khai của nguyên liệu (UUID)',
      CREATED_AT: 'Thời gian tạo',
      UPDATED_AT: 'Thời gian cập nhật',
    },

    EXAMPLES: {
      CODE: 'DUAXANH',
      NAME: 'Dứa tươi',
      CATEGORY: 'Rau củ quả',
      CATEGORY_ID: 1,
      UNIT_ID: 1,
      REFERENCE_PRICE: 15000,
      PUBLIC_ID: '550e8400-e29b-41d4-a716-446655440000',
      DATE: '2025-01-01T00:00:00Z',
    },
  },
} as const;
