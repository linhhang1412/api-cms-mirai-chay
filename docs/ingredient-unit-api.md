# Ingredient Unit API Documentation

This document provides detailed information about the Ingredient Unit API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create Unit](#create-unit)
  - [List Units](#list-units)
  - [Get Unit by ID](#get-unit-by-id)
  - [Update Unit](#update-unit)
  - [Delete Unit](#delete-unit)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### IngredientUnitEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID of the unit |
| code | string | Unique unit code |
| name | string | Unit name |
| active | boolean | Active status |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### CreateIngredientUnitDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | Unique unit code (1-32 chars, alphanumeric, dash, underscore, dot) |
| name | string | Yes | Unit name (max 120 chars) |
| active | boolean | No | Active status (default: true) |

### UpdateIngredientUnitDto

All fields are optional and follow the same rules as CreateIngredientUnitDto.

## Endpoints

### Create Unit

Create a new ingredient unit.

**URL**: `POST /ingredient-units`

**Permissions**: ADMIN, MANAGER

**Request Body**:
```json
{
  "code": "KG",
  "name": "Kilogram",
  "active": true
}
```

**Success Response**:
```json
{
  "id": 1,
  "code": "KG",
  "name": "Kilogram",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Unit code already exists
- 400: Validation failed

### List Units

Get a list of all ingredient units.

**URL**: `GET /ingredient-units`

**Permissions**: ADMIN, MANAGER, STAFF

**Success Response**:
```json
[
  {
    "id": 1,
    "code": "KG",
    "name": "Kilogram",
    "active": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Unit by ID

Get details of a specific ingredient unit by ID.

**URL**: `GET /ingredient-units/:id`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Unit ID |

**Success Response**:
```json
{
  "id": 1,
  "code": "KG",
  "name": "Kilogram",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Unit not found

### Update Unit

Update an existing ingredient unit.

**URL**: `PUT /ingredient-units/:id`

**Permissions**: ADMIN, MANAGER

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Unit ID |

**Request Body**:
```json
{
  "name": "Kilogram (Updated)",
  "active": true
}
```

**Success Response**:
```json
{
  "id": 1,
  "code": "KG",
  "name": "Kilogram (Updated)",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses**:
- 404: Unit not found
- 400: Unit code already exists
- 400: Validation failed

### Delete Unit

Delete an ingredient unit (soft delete by default, hard delete option available).

**URL**: `DELETE /ingredient-units/:id`

**Permissions**: 
- Soft delete: ADMIN, MANAGER
- Hard delete: ADMIN only

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Unit ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hard | boolean | No | Hard delete if true (ADMIN only) |

**Request Examples**:
```
DELETE /ingredient-units/1          // Soft delete
DELETE /ingredient-units/1?hard=true // Hard delete (ADMIN only)
```

**Soft Delete Success Response**:
```json
{
  "message": "Đơn vị đã được vô hiệu hóa",
  "item": {
    "id": 1,
    "code": "KG",
    "name": "Kilogram",
    "active": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

**Hard Delete Success Response**:
```json
{
  "message": "Đơn vị đã được xóa vĩnh viễn"
}
```

**Error Responses**:
- 404: Unit not found

## Error Responses

Common error responses you may encounter:

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Mã đơn vị đã tồn tại | Unit code already exists |
| 400 | Validation failed | Request data validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | Không tìm thấy đơn vị | Unit not found |
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