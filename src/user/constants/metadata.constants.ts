// Naming pattern: METADATA_CATEGORY_TYPE
export const UserOperationSummaries = {
  CREATE_USER: 'Tạo người dùng mới',
  GET_ALL_USERS: 'Lấy danh sách tất cả người dùng',
  GET_USER_BY_ID: 'Lấy thông tin người dùng theo ID',
  GET_USER_BY_EMAIL: 'Lấy thông tin người dùng theo email',
  UPDATE_USER: 'Cập nhật thông tin người dùng theo ID',
  DELETE_USER: 'Xóa người dùng theo ID',
} as const;

export const UserOperationDescriptions = {
  CREATE_USER: 'Tạo một người dùng mới trong hệ thống',
  GET_ALL_USERS: 'Lấy danh sách tất cả người dùng trong hệ thống',
  GET_USER_BY_ID: 'Lấy thông tin chi tiết của một người dùng theo ID',
  GET_USER_BY_EMAIL: 'Lấy thông tin chi tiết của một người dùng theo email',
  UPDATE_USER: 'Cập nhật thông tin của một người dùng theo ID',
  DELETE_USER:
    'Xóa một người dùng theo ID (có thể là xóa mềm hoặc xóa vĩnh viễn)',
} as const;
