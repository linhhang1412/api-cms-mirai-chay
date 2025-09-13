# Tài liệu API Xác thực (Auth API)

## Tổng quan

Hệ thống xác thực sử dụng OTP (One-Time Password) gửi qua email để đăng nhập người dùng. Sau khi xác thực OTP thành công, hệ thống sẽ trả về Access Token và Refresh Token để sử dụng cho các yêu cầu tiếp theo.

## Các endpoint xác thực

### 1. Yêu cầu mã OTP

**Endpoint:** `POST /auth/request-otp`

**Mô tả:** Gửi mã OTP đến email đã đăng ký để xác thực đăng nhập

**Rate limit:** Tối đa 5 yêu cầu mỗi 60 giây

**Request:**
```json
{
  "email": "nguoidung@example.com"
}
```

**Response thành công (200):**
```json
{
  "message": "Mã OTP đã được gửi đến email",
  "expiresAt": "2023-01-01T00:05:00Z"
}
```

**Response lỗi:**
- 400: Email không hợp lệ hoặc chưa được đăng ký

---

### 2. Xác thực mã OTP

**Endpoint:** `POST /auth/verify-otp`

**Mô tả:** Xác thực mã OTP nhận được qua email để nhận token truy cập

**Rate limit:** Tối đa 10 yêu cầu mỗi 60 giây

**Request:**
```json
{
  "email": "nguoidung@example.com",
  "code": "123456"
}
```

**Response thành công (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nguoidung@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "role": "STAFF",
    "avatar": "https://example.com/avatar.jpg",
    "status": "ACTIVE",
    "lastLoginAt": "2023-01-01T00:00:00Z",
    "lastOtpSentAt": "2023-01-01T00:00:00Z",
    "failedLoginAt": null,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

**Response lỗi:**
- 401: Mã OTP không hợp lệ hoặc đã hết hạn

---

### 3. Làm mới token truy cập

**Endpoint:** `POST /auth/refresh`

**Mô tả:** Làm mới token truy cập bằng refresh token

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response thành công (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response lỗi:**
- 401: Token làm mới không hợp lệ

---

### 4. Đăng xuất

**Endpoint:** `POST /auth/logout`

**Mô tả:** Đăng xuất người dùng khỏi hệ thống

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response thành công (200):**
```json
{
  "message": "Đăng xuất thành công"
}
```

**Response lỗi:**
- 401: Chưa xác thực

---

### 5. Lấy thông tin người dùng hiện tại

**Endpoint:** `GET /auth/me`

**Mô tả:** Lấy thông tin người dùng hiện tại

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response thành công (200):**
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "nguoidung@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "STAFF",
  "avatar": "https://example.com/avatar.jpg",
  "status": "ACTIVE",
  "lastLoginAt": "2023-01-01T00:00:00Z",
  "lastOtpSentAt": "2023-01-01T00:00:00Z",
  "failedLoginAt": null,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

**Response lỗi:**
- 401: Chưa xác thực

## Các vai trò người dùng

Hệ thống có 3 vai trò người dùng:
- `ADMIN`: Quản trị viên hệ thống
- `MANAGER`: Quản lý
- `STAFF`: Nhân viên

## Cấu hình hệ thống

- Mã OTP có độ dài: 6 ký tự
- Thời gian hết hạn của mã OTP: 5 phút
- Access Token hết hạn sau: 1 giờ
- Refresh Token hết hạn sau: 7 ngày

## Hướng dẫn triển khai frontend

1. **Đăng nhập:**
   - Gọi `POST /auth/request-otp` với email của người dùng
   - Hiển thị form nhập mã OTP cho người dùng
   - Gọi `POST /auth/verify-otp` với email và mã OTP
   - Lưu `accessToken` và `refreshToken` vào localStorage/sessionStorage
   - Lưu thông tin người dùng

2. **Gọi API có xác thực:**
   - Thêm header: `Authorization: Bearer <accessToken>` vào các yêu cầu

3. **Làm mới token:**
   - Khi nhận được lỗi 401 từ API, gọi `POST /auth/refresh` với `refreshToken`
   - Nếu thành công, cập nhật `accessToken` mới và thử lại yêu cầu
   - Nếu thất bại, chuyển hướng người dùng về trang đăng nhập

4. **Đăng xuất:**
   - Gọi `POST /auth/logout`
   - Xóa `accessToken`, `refreshToken` và thông tin người dùng khỏi storage
   - Chuyển hướng về trang đăng nhập
