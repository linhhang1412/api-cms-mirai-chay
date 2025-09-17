# User API Documentation

This document provides detailed information about the User API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create User](#create-user)
  - [List Users](#list-users)
  - [Get User by ID](#get-user-by-id)
  - [Get User by Email](#get-user-by-email)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### UserEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID |
| publicId | string | Public UUID |
| email | string | User email (unique) |
| fullName | string (optional) | Full name |
| phone | string (optional) | Phone number |
| role | string | User role (ADMIN/MANAGER/STAFF) |
| avatar | string (optional) | Avatar URL |
| status | string | Account status (ACTIVE/INACTIVE) |
| lastLoginAt | Date (optional) | Last successful login timestamp |
| lastOtpSentAt | Date (optional) | Last OTP sent timestamp |
| failedLoginAt | Date (optional) | Last failed login attempt timestamp |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### CreateUserDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email (unique) |
| fullName | string | No | Full name |
| phone | string | No | Phone number |
| role | string | Yes | User role (ADMIN/MANAGER/STAFF) |
| avatar | string | No | Avatar URL |
| status | string | Yes | Account status (ACTIVE/INACTIVE) |

### UpdateUserDto

All fields are optional and follow the same rules as CreateUserDto.

## Endpoints

### Create User

Create a new user.

**URL**: `POST /users`

**Permissions**: ADMIN, MANAGER

**Request Body**:
```json
{
  "email": "nguoidung@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "STAFF",
  "avatar": "https://example.com/avatar.jpg",
  "status": "ACTIVE"
}
```

**Success Response**:
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
  "lastLoginAt": null,
  "lastOtpSentAt": null,
  "failedLoginAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Email already exists
- 400: Validation failed

### List Users

Get a list of all users.

**URL**: `GET /users`

**Permissions**: ADMIN, MANAGER

**Success Response**:
```json
[
  {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nguoidung@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "role": "STAFF",
    "avatar": "https://example.com/avatar.jpg",
    "status": "ACTIVE",
    "lastLoginAt": null,
    "lastOtpSentAt": null,
    "failedLoginAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get User by ID

Get details of a specific user by ID.

**URL**: `GET /users/:id`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | User ID |

**Success Response**:
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
  "lastLoginAt": null,
  "lastOtpSentAt": null,
  "failedLoginAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 404: User not found

### Get User by Email

Get details of a specific user by email.

**URL**: `GET /users/email/:email`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | User email |

**Success Response**:
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
  "lastLoginAt": null,
  "lastOtpSentAt": null,
  "failedLoginAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 404: User not found

### Update User

Update an existing user.

**URL**: `PUT /users/:id`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | User ID |

**Request Body**:
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321"
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "nguoidung@example.com",
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "role": "STAFF",
  "avatar": "https://example.com/avatar.jpg",
  "status": "ACTIVE",
  "lastLoginAt": null,
  "lastOtpSentAt": null,
  "failedLoginAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 404: User not found
- 400: Email already exists
- 400: Validation failed

### Delete User

Delete a user (soft delete by default, hard delete option available).

**URL**: `DELETE /users/:id`

**Permissions**: 
- Soft delete: ADMIN, MANAGER
- Hard delete: ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | User ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hard | boolean | No | Hard delete if true (ADMIN only) |

**Request Examples**:
```
DELETE /users/1          // Soft delete
DELETE /users/1?hard=true // Hard delete (ADMIN only)
```

**Soft Delete Success Response**:
```json
{
  "message": "Người dùng đã được vô hiệu hóa",
  "item": {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nguoidung@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "role": "STAFF",
    "avatar": "https://example.com/avatar.jpg",
    "status": "INACTIVE",
    "lastLoginAt": null,
    "lastOtpSentAt": null,
    "failedLoginAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

**Hard Delete Success Response**:
```json
{
  "message": "Người dùng đã được xóa vĩnh viễn"
}
```

**Error Responses**:
- 404: User not found

## Error Responses

Common error responses you may encounter:

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Email đã tồn tại | Email already exists |
| 400 | Validation failed | Request data validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Không tìm thấy người dùng | User not found |
| 500 | Internal server error | Unexpected server error |

## Role Permissions

| Role | Create | List | Get by ID | Get by Email | Update | Delete (Soft) | Delete (Hard) |
|------|--------|------|-----------|--------------|--------|---------------|---------------|
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGER | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| STAFF | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |

Note: 
- ✓ = Allowed
- ✗ = Not allowed