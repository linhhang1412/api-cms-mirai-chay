# Ingredient Category API Documentation

This document provides detailed information about the Ingredient Category API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create Category](#create-category)
  - [List Categories](#list-categories)
  - [Update Category](#update-category)
  - [Delete Category](#delete-category)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### IngredientCategoryEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID of the category |
| code | string | Unique category code |
| name | string | Category name |
| active | boolean | Active status |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### CreateIngredientCategoryDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | Unique category code (2-32 chars, alphanumeric, dash, underscore, dot) |
| name | string | Yes | Category name (max 120 chars) |
| active | boolean | No | Active status (default: true) |

### UpdateIngredientCategoryDto

All fields are optional and follow the same rules as CreateIngredientCategoryDto.

## Endpoints

### Create Category

Create a new ingredient category.

**URL**: `POST /ingredient-categories`

**Permissions**: ADMIN, MANAGER

**Request Body**:
```json
{
  "code": "RAUCU",
  "name": "Rau củ quả",
  "active": true
}
```

**Success Response**:
```json
{
  "id": 1,
  "code": "RAUCU",
  "name": "Rau củ quả",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Category code already exists
- 400: Validation failed

### List Categories

Get a list of all ingredient categories.

**URL**: `GET /ingredient-categories`

**Permissions**: ADMIN, MANAGER, STAFF

**Success Response**:
```json
[
  {
    "id": 1,
    "code": "RAUCU",
    "name": "Rau củ quả",
    "active": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Update Category

Update an existing ingredient category.

**URL**: `PUT /ingredient-categories/:id`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Category ID |

**Request Body**:
```json
{
  "name": "Rau củ quả tươi",
  "active": true
}
```

**Success Response**:
```json
{
  "id": 1,
  "code": "RAUCU",
  "name": "Rau củ quả tươi",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Category not found
- 400: Category code already exists
- 400: Validation failed

### Delete Category

Delete an ingredient category (soft delete by default, hard delete option available).

**URL**: `DELETE /ingredient-categories/:id`

**Permissions**: 
- Soft delete: ADMIN, MANAGER
- Hard delete: ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Category ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hard | boolean | No | Hard delete if true (ADMIN only) |

**Request Examples**:
```
DELETE /ingredient-categories/1          // Soft delete
DELETE /ingredient-categories/1?hard=true // Hard delete (ADMIN only)
```

**Soft Delete Success Response**:
```json
{
  "message": "Đã hủy kích hoạt danh mục",
  "item": {
    "id": 1,
    "code": "RAUCU",
    "name": "Rau củ quả",
    "active": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

**Hard Delete Success Response**:
```json
{
  "message": "Đã xóa danh mục"
}
```

**Error Responses**:
- 404: Category not found

## Error Responses

Common error responses you may encounter:

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Mã danh mục đã tồn tại | Category code already exists |
| 400 | Validation failed | Request data validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Không tìm thấy danh mục | Category not found |
| 500 | Internal server error | Unexpected server error |

## Role Permissions

| Role | Create | List | Update | Delete (Soft) | Delete (Hard) |
|------|--------|------|--------|---------------|---------------|
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGER | ✓ | ✓ | ✓ | ✓ | ✗ |
| STAFF | ✗ | ✓ | ✗ | ✗ | ✗ |

Note: 
- ✓ = Allowed
- ✗ = Not allowed