# Ingredient API Documentation

This document provides detailed information about the Ingredient API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create Ingredient](#create-ingredient)
  - [List Ingredients](#list-ingredients)
  - [Get Ingredient by ID](#get-ingredient-by-id)
  - [Update Ingredient](#update-ingredient)
  - [Delete Ingredient](#delete-ingredient)
  - [Update Minimum Stock](#update-minimum-stock)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### IngredientEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID |
| publicId | string | Public UUID |
| code | string | Unique ingredient code |
| name | string | Ingredient name |
| categoryId | number (optional) | Linked category ID |
| unitId | number (optional) | Linked unit ID |
| referencePrice | number (optional) | Reference price (VND) |
| minStock | number (optional) | Minimum stock threshold |
| status | string | Status (ACTIVE/INACTIVE) |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### CreateIngredientDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | Unique ingredient code |
| name | string | Yes | Ingredient name |
| categoryId | number | No | Linked category ID |
| unitId | number | No | Linked unit ID |
| referencePrice | number | No | Reference price (VND) |
| minStock | number | No | Minimum stock threshold |
| status | string | Yes | Status (ACTIVE/INACTIVE) |

### UpdateIngredientDto

All fields are optional and follow the same rules as CreateIngredientDto.

### UpdateMinStockDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| minStock | number | Yes | Minimum stock threshold |

## Endpoints

### Create Ingredient

Create a new ingredient.

**URL**: `POST /ingredients`

**Permissions**: ADMIN, MANAGER

**Request Body**:
```json
{
  "code": "TOM001",
  "name": "Tomato",
  "categoryId": 1,
  "unitId": 2,
  "referencePrice": 10000,
  "minStock": 10,
  "status": "ACTIVE"
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "TOM001",
  "name": "Tomato",
  "categoryId": 1,
  "unitId": 2,
  "referencePrice": 10000,
  "minStock": 10,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Ingredient code already exists
- 400: Validation failed

### List Ingredients

Get a list of all ingredients.

**URL**: `GET /ingredients`

**Permissions**: ADMIN, MANAGER, STAFF

**Success Response**:
```json
[
  {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "code": "TOM001",
    "name": "Tomato",
    "categoryId": 1,
    "unitId": 2,
    "referencePrice": 10000,
    "minStock": 10,
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Ingredient by ID

Get details of a specific ingredient by ID.

**URL**: `GET /ingredients/:id`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Ingredient ID |

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "TOM001",
  "name": "Tomato",
  "categoryId": 1,
  "unitId": 2,
  "referencePrice": 10000,
  "minStock": 10,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Ingredient not found

### Update Ingredient

Update an existing ingredient.

**URL**: `PUT /ingredients/:id`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Ingredient ID |

**Request Body**:
```json
{
  "name": "Tomato (Updated)",
  "referencePrice": 12000
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "TOM001",
  "name": "Tomato (Updated)",
  "categoryId": 1,
  "unitId": 2,
  "referencePrice": 12000,
  "minStock": 10,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Ingredient not found
- 400: Ingredient code already exists
- 400: Validation failed

### Delete Ingredient

Delete an ingredient (soft delete by default, hard delete option available).

**URL**: `DELETE /ingredients/:id`

**Permissions**: 
- Soft delete: ADMIN, MANAGER
- Hard delete: ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Ingredient ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hard | boolean | No | Hard delete if true (ADMIN only) |

**Request Examples**:
```
DELETE /ingredients/1          // Soft delete
DELETE /ingredients/1?hard=true // Hard delete (ADMIN only)
```

**Soft Delete Success Response**:
```json
{
  "message": "Nguyên liệu đã được vô hiệu hóa",
  "item": {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "code": "TOM001",
    "name": "Tomato",
    "categoryId": 1,
    "unitId": 2,
    "referencePrice": 10000,
    "minStock": 10,
    "status": "INACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

**Hard Delete Success Response**:
```json
{
  "message": "Nguyên liệu đã được xóa vĩnh viễn"
}
```

**Error Responses**:
- 404: Ingredient not found

### Update Minimum Stock

Update the minimum stock threshold for an ingredient.

**URL**: `PATCH /ingredients/:id/min-stock`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Ingredient ID |

**Request Body**:
```json
{
  "minStock": 15
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "TOM001",
  "name": "Tomato",
  "categoryId": 1,
  "unitId": 2,
  "referencePrice": 10000,
  "minStock": 15,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Ingredient not found

## Error Responses

Common error responses you may encounter:

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Mã nguyên liệu đã tồn tại | Ingredient code already exists |
| 400 | Validation failed | Request data validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Không tìm thấy nguyên liệu | Ingredient not found |
| 500 | Internal server error | Unexpected server error |

## Role Permissions

| Role | Create | List | Get by ID | Update | Delete (Soft) | Delete (Hard) |
|------|--------|------|-----------|--------|---------------|---------------|
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGER | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| STAFF | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |

Note: 
- ✓ = Allowed
- ✗ = Not allowed