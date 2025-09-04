# Checklist Tính Năng Auth và User

## Tính Năng Auth (Đã Hoàn Thành)

### OTP Service
- [x] Tạo EmailOtpModule, EmailOtpService, EmailOtpRepository
- [x] Chức năng tạo mã OTP 6 chữ số
- [x] Chức năng xác thực OTP
- [x] Cơ chế hết hạn OTP (5 phút)
- [x] Cơ chế giới hạn số lần thử (5 lần)
- [x] Chức năng đánh dấu OTP đã sử dụng

### Email Service
- [x] Tạo NotificationModule với Handlebars template engine
- [x] Template email chuyên nghiệp với HTML/CSS
- [x] Tích hợp Resend để gửi email thực tế
- [x] Template base và template riêng cho OTP

### Authentication Flow
- [x] Endpoint `POST /auth/request-otp` để yêu cầu OTP
- [x] Endpoint `POST /auth/verify-otp` để xác thực OTP
- [x] Endpoint `POST /auth/refresh` để refresh token
- [x] Endpoint `POST /auth/logout` để logout
- [x] DTO validation cho request và verify OTP
- [x] Tích hợp với UserRepository để tạo user nếu chưa tồn tại

### JWT Token
- [x] JwtService để tạo token
- [x] JwtStrategy để xác thực token
- [x] JwtAuthGuard để bảo vệ routes
- [x] Refresh token mechanism

### Module Integration
- [x] AuthModule đã được import vào AppModule
- [x] Rate limiting cho auth endpoints
- [x] Role-based access control

## Tính Năng User Management (Đã Hoàn Thành)

### API Endpoints
- [x] `POST /users` - Tạo người dùng mới
- [x] `GET /users` - Lấy danh sách tất cả người dùng
- [x] `GET /users/:id` - Tìm người dùng theo ID
- [x] `GET /users/email/:email` - Tìm người dùng theo email
- [x] `PUT /users/:id` - Cập nhật thông tin người dùng
- [x] `DELETE /users/:id` - Xóa người dùng (soft hoặc hard delete)

### Service Layer
- [x] UserService với các phương thức CRUD đầy đủ

### Repository Layer
- [x] UserRepository với các phương thức cần thiết

### Security
- [x] Role-based access control cho user endpoints
- [x] JWT authentication cho tất cả user endpoints

## Tính Năng Cần Bổ Sung

### Security & Testing
- [ ] Unit test cho AuthService
- [ ] Integration test cho auth flow
- [ ] E2E test cho user management operations

### Documentation
- [ ] API documentation
- [ ] Hướng dẫn sử dụng auth endpoints