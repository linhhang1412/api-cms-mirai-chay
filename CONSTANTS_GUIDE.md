# Hướng dẫn về Constants trong Dự án

## Tổng quan

Constants là các giá trị không thay đổi được định nghĩa một lần và sử dụng xuyên suốt dự án. Việc sử dụng constants mang lại nhiều lợi ích:

1. **Dễ bảo trì** - Thay đổi một chỗ ảnh hưởng toàn hệ thống
2. **Nhất quán** - Đảm bảo sử dụng cùng một giá trị ở mọi nơi
3. **Dễ đọc** - Tên constants nói lên ý nghĩa của giá trị
4. **Dễ kiểm thử** - Có thể mock constants trong test

## Cấu trúc Constants

Mỗi module (auth, user, email-otp, notification) có thư mục `constants/` riêng chứa các file constants.

### Quy tắc đặt tên file

1. **`[module].constants.ts`** - Constants cơ bản của module
2. **`messages.constants.ts`** - Messages lỗi/thành công
3. **`metadata.constants.ts`** - Metadata cho API (summaries, descriptions)
4. **`config.constants.ts`** - Cấu hình (nếu cần)
5. **`roles.constants.ts`** - Roles (nếu cần)
6. **`system.constants.ts`** - Constants hệ thống (nếu cần)

### Quy tắc đặt tên constants

1. **Pattern**: `CATEGORY_SUBCATEGORY_TYPE`
2. **Viết hoa hết**
3. **Dùng `_` để phân tách từ`
4. **Tên nói lên ý nghĩa**

Ví dụ:
```typescript
// Đúng
export const AuthConstants = {
  API: {
    TAGS: {
      AUTH: 'Xác thực',
    },
  },
} as const;

// Sai
export const AUTH_TAGS = {
  AUTH: 'Xác thực',
} as const;
```

## Cấu trúc chi tiết từng file

### 1. `[module].constants.ts`

File chứa các constants cơ bản của module:

```typescript
// Naming pattern: MODULE_CATEGORY_TYPE
export const UserConstants = {
  // API CONFIGURATION
  API: {
    TAGS: {
      USER: 'Người dùng',
    },
  },
  
  // FIELD CONFIGURATIONS
  FIELDS: {
    DESCRIPTIONS: {
      EMAIL: 'Địa chỉ email của người dùng',
      FULL_NAME: 'Họ và tên của người dùng',
    },
    
    EXAMPLES: {
      EMAIL: 'nguoidung@example.com',
      FULL_NAME: 'Nguyễn Văn A',
    },
  },
  
  // DEFAULT VALUES
  DEFAULTS: {
    ROLE: 'STAFF',
    STATUS: 'ACTIVE',
  },
} as const;
```

### 2. `messages.constants.ts`

File chứa messages lỗi/thành công:

```typescript
// Naming pattern: VERB_NOUN_ACTION
export const UserMessages = {
  // ERROR MESSAGES - Pattern: ERROR_CATEGORY_ACTION
  ERROR: {
    CREATE_USER_FAILED: 'Tạo người dùng thất bại',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
  },

  // SUCCESS MESSAGES - Pattern: SUCCESS_ACTION_COMPLETED
  SUCCESS: {
    USER_CREATED: 'Tạo người dùng thành công',
    USER_UPDATED: 'Cập nhật người dùng thành công',
  },

  // RESPONSE MESSAGES - Pattern: RESPONSE_ACTION_STATUS
  RESPONSE: {
    OPERATION_SUCCESSFUL: 'Thành công',
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
  },
} as const;
```

### 3. `metadata.constants.ts`

File chứa metadata cho API:

```typescript
// Naming pattern: METADATA_CATEGORY_TYPE
export const UserMetadata = {
  // API OPERATION METADATA
  OPERATION: {
    SUMMARY: {
      CREATE_USER: 'Tạo người dùng mới',
      GET_ALL_USERS: 'Lấy danh sách tất cả người dùng',
    },

    DESCRIPTION: {
      CREATE_USER: 'Tạo một người dùng mới trong hệ thống',
      GET_ALL_USERS: 'Lấy danh sách tất cả người dùng trong hệ thống',
    },
  },

  // API TAGS
  TAGS: {
    USER: 'Người dùng',
  },

  // PARAMETER DESCRIPTIONS
  PARAMETERS: {
    USER_ID: 'ID của người dùng',
    USER_EMAIL: 'Email của người dùng',
  },

  // RESPONSE DESCRIPTIONS
  RESPONSES: {
    CREATE_USER_SUCCESS: 'Tạo người dùng thành công',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    INVALID_INPUT_DATA: 'Dữ liệu đầu vào không hợp lệ',
  },
} as const;
```

## Sử dụng index.ts để đơn giản hóa

### Cấu trúc thư mục với index.ts:

```
src/[module]/constants/
├── [module].constants.ts    → Constants cơ bản
├── messages.constants.ts    → Messages lỗi/thành công
├── metadata.constants.ts    → Metadata API
├── config.constants.ts     → Cấu hình (nếu cần)
├── roles.constants.ts      → Roles (nếu cần)
├── system.constants.ts      → System constants (nếu cần)
└── index.ts                → Export tất cả để đơn giản hóa imports
```

### index.ts mẫu:

```typescript
// Export tất cả từ các file constants
export * from './auth.constants';
export * from './config.constants';
export * from './messages.constants';
export * from './metadata.constants';
export * from './roles.constants';
export * from './system.constants';
```

## Cách sử dụng constants

### 1. Import đơn giản từ index.ts:

```typescript
// Import theo nhu cầu - chỉ cần 1 dòng
import {
  AuthMessages,
  AuthMetadata,
  AuthConfig,
  AuthApiTags,
} from './constants';

// Import cụ thể từng constant nếu cần
import { AuthMessages } from './constants';
```

### 2. Sử dụng trong DTO:

```typescript
@ApiProperty({
  description: UserConstants.FIELDS.DESCRIPTIONS.EMAIL,
  example: UserConstants.FIELDS.EXAMPLES.EMAIL,
})
email: string;
```

### 3. Sử dụng trong Controller:

```typescript
@ApiTags(AuthMetadata.TAGS.AUTH)
@Controller('auth')
export class AuthController {
  @Post('request-otp')
  @ApiOperation({
    summary: AuthMetadata.OPERATION.SUMMARY.REQUEST_OTP,
    description: AuthMetadata.OPERATION.DESCRIPTION.REQUEST_OTP,
  })
  @ApiResponse({
    status: 201,
    description: AuthMetadata.RESPONSES.OTP_EMAIL_SENT,
  })
  async requestOtp(@Body() dto: RequestOtpDto) {
    // ...
  }
}
```

### 4. Sử dụng trong Service:

```typescript
@Injectable()
export class AuthService {
  async requestOtp(email: string): Promise<void> {
    try {
      // ...
      this.logger.log(`${AuthMessages.SUCCESS.OTP_EMAIL_SENT}: ${email}`);
    } catch (error) {
      this.logger.error(
        `${AuthMessages.ERROR.OTP_EMAIL_SEND_FAILED}: ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException(AuthMessages.ERROR.OTP_EMAIL_SEND_FAILED);
    }
  }
}
```

## Best Practices

### 1. Tái sử dụng constants

Thay vì hardcode giá trị, luôn sử dụng constants:

```typescript
// Đúng
throw new BadRequestException(AuthMessages.ERROR.EMAIL_NOT_REGISTERED);

// Sai
throw new BadRequestException('Email chưa được đăng ký trong hệ thống');
```

### 2. Tổ chức theo ngữ cảnh

Nhóm các constants liên quan theo ngữ cảnh:

```typescript
// Đúng
export const UserConstants = {
  FIELDS: {
    DESCRIPTIONS: { /* ... */ },
    EXAMPLES: { /* ... */ },
  },
} as const;

// Sai
export const UserFieldDescriptions = { /* ... */ };
export const UserFieldExamples = { /* ... */ };
```

### 3. Sử dụng `as const`

Luôn sử dụng `as const` để đảm bảo type safety:

```typescript
export const UserConstants = {
  // ...
} as const; // Bắt buộc
```

### 4. Comment mô tả

Thêm comment mô tả pattern đặt tên:

```typescript
// Naming pattern: MODULE_CATEGORY_TYPE
export const UserConstants = {
  // ...
} as const;
```

## Quản lý constants

### 1. Khi thêm constants mới

1. Xác định file phù hợp để thêm vào
2. Tuân thủ quy tắc đặt tên
3. Thêm comment mô tả nếu cần
4. Cập nhật tất cả nơi sử dụng

### 2. Khi thay đổi constants

1. Chỉ thay đổi giá trị, không thay đổi tên
2. Kiểm tra tất cả nơi sử dụng constants
3. Đảm bảo không phá vỡ backward compatibility

### 3. Khi xóa constants

1. Tìm và thay thế tất cả references
2. Xóa constants không còn sử dụng
3. Chạy test để đảm bảo không có lỗi

## Ví dụ thực tế

### Auth module constants:

```typescript
// auth.constants.ts
// Naming pattern: AUTH_CATEGORY_TYPE
export const AuthConstants = {
  API: {
    TAGS: {
      AUTH: 'Xác thực',
    },
  },
  FIELDS: {
    DESCRIPTIONS: {
      EMAIL: 'Địa chỉ email của người dùng',
      OTP_CODE: 'Mã OTP 6 chữ số',
    },
    EXAMPLES: {
      EMAIL: 'nguoidung@example.com',
      OTP_CODE: '123456',
    },
  },
} as const;
```

### User module constants:

```typescript
// user.constants.ts
// Naming pattern: USER_CATEGORY_TYPE
export const UserConstants = {
  API: {
    TAGS: {
      USER: 'Người dùng',
    },
  },
  FIELDS: {
    DESCRIPTIONS: {
      EMAIL: 'Địa chỉ email của người dùng',
      FULL_NAME: 'Họ và tên của người dùng',
    },
    EXAMPLES: {
      EMAIL: 'nguoidung@example.com',
      FULL_NAME: 'Nguyễn Văn A',
    },
  },
  DEFAULTS: {
    ROLE: 'STAFF',
    STATUS: 'ACTIVE',
  },
} as const;
```

## Kết luận

Việc sử dụng constants theo cấu trúc nhất quán giúp dự án dễ bảo trì, dễ đọc và dễ mở rộng. Luôn tuân thủ các quy tắc đặt tên và tổ chức để đảm bảo tính nhất quán xuyên suốt dự án. Sử dụng `index.ts` để đơn giản hóa imports và tăng tính linh hoạt trong việc sử dụng constants.