// Naming pattern: RESPONSE_CATEGORY_TYPE
export const UserResponseDescriptions = {
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
} as const;
