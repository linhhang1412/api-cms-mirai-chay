# Stock Out (Xuất Kho) API Documentation

This document provides detailed information about the Stock Out API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create Daily Stock Out](#create-daily-stock-out)
  - [List Today's Stock Outs](#list-todays-stock-outs)
  - [List Stock Out History](#list-stock-out-history)
  - [Get Stock Out by Public ID](#get-stock-out-by-public-id)
  - [Update Stock Out Daily](#update-stock-out-daily)
  - [Delete Stock Out Daily](#delete-stock-out-daily)
  - [Add Stock Out Item](#add-stock-out-item)
  - [Update Stock Out Item](#update-stock-out-item)
  - [Delete Stock Out Item](#delete-stock-out-item)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### StockOutDailyEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID |
| publicId | string | Public UUID |
| stockDate | Date | Stock date (date only) |
| note | string (optional) | Note |
| createdByUserId | number | Creator user ID |
| updatedByUserId | number (optional) | Updater user ID |
| createdAt | Date | Creation timestamp |
| updatedAt | Date (optional) | Last update timestamp |
| items | StockOutItemEntity[] | Associated items |

### StockOutItemEntity

| Field | Type | Description |
|-------|------|-------------|
| id | number | Internal ID |
| publicId | string | Public UUID |
| dailyId | number | Reference to daily record |
| stockDate | Date | Stock date (date only) |
| ingredientId | number | Ingredient ID |
| quantity | number | Quantity |
| note | string (optional) | Note |
| createdByUserId | number | Creator user ID |
| updatedByUserId | number (optional) | Updater user ID |
| createdAt | Date | Creation timestamp |
| updatedAt | Date (optional) | Last update timestamp |

### CreateStockOutDailyDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| stockDate | string | No | Stock date (YYYY-MM-DD, defaults to today) |
| note | string | No | Note |
| createdByUserId | number | Yes | Creator user ID |

### AddStockOutItemDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ingredientId | number | Yes | Ingredient ID |
| quantity | number | Yes | Quantity |
| note | string | No | Note |
| createdByUserId | number | Yes | Creator user ID |

### UpdateStockOutItemDto

All fields are optional:
| Field | Type | Description |
|-------|------|-------------|
| quantity | number | Quantity |
| note | string | Note |
| updatedByUserId | number | Updater user ID |

### UpdateStockOutDailyDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| note | string | No | Note |
| updatedByUserId | number | No | Updater user ID |

## Endpoints

### Create Daily Stock Out

Create a new daily stock out record (header).

**URL**: `POST /stock-out/dailies`

**Permissions**: ADMIN, MANAGER, STAFF

**Request Body**:
```json
{
  "stockDate": "2023-01-01",
  "note": "Xuất hàng đầu tháng",
  "createdByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Xuất hàng đầu tháng",
  "createdByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### List Today's Stock Outs

Get a list of today's stock out records.

**URL**: `GET /stock-out/dailies/today`

**Permissions**: ADMIN, MANAGER, STAFF

**Success Response**:
```json
[
  {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "stockDate": "2023-01-01T00:00:00.000Z",
    "note": "Xuất hàng đầu tháng",
    "createdByUserId": 1,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": null,
    "items": [],
    "_count": {
      "items": 0
    }
  }
]
```

### List Stock Out History

Get a list of historical stock out records (excluding today).

**URL**: `GET /stock-out/dailies/history`

**Permissions**: ADMIN, MANAGER, STAFF

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | string | No | Start date (YYYY-MM-DD, defaults to 30 days ago) |
| to | string | No | End date (YYYY-MM-DD, defaults to yesterday) |

**Request Examples**:
```
GET /stock-out/dailies/history
GET /stock-out/dailies/history?from=2022-12-01&to=2022-12-31
```

**Success Response**:
```json
[
  {
    "id": 2,
    "publicId": "550e8400-e29b-41d4-a716-446655440001",
    "stockDate": "2022-12-31T00:00:00.000Z",
    "note": "Xuất hàng cuối năm",
    "createdByUserId": 1,
    "createdAt": "2022-12-31T00:00:00.000Z",
    "updatedAt": null,
    "items": [],
    "_count": {
      "items": 0
    }
  }
]
```

### Get Stock Out by Public ID

Get details of a specific stock out record by public ID.

**URL**: `GET /stock-out/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock out record public ID |

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Xuất hàng đầu tháng",
  "createdByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": null,
  "items": [
    {
      "id": 1,
      "publicId": "550e8400-e29b-41d4-a716-446655440002",
      "dailyId": 1,
      "stockDate": "2023-01-01T00:00:00.000Z",
      "ingredientId": 1,
      "quantity": 5,
      "note": "Cà chua",
      "createdByUserId": 1,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedByUserId": null,
      "updatedAt": null
    }
  ]
}
```

### Update Stock Out Daily

Update a daily stock out record (only allowed for today's records).

**URL**: `PUT /stock-out/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock out record public ID |

**Request Body**:
```json
{
  "note": "Xuất hàng đầu tháng (updated)",
  "updatedByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Xuất hàng đầu tháng (updated)",
  "createdByUserId": 1,
  "updatedByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T01:00:00.000Z"
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockOutDaily not found

### Delete Stock Out Daily

Delete a daily stock out record (only allowed for today's records).

**URL**: `DELETE /stock-out/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock out record public ID |

**Success Response**:
```json
{
  "success": true
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockOutDaily not found

### Add Stock Out Item

Add an item to a daily stock out record.

**URL**: `POST /stock-out/dailies/:publicId/items`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock out record public ID |

**Request Body**:
```json
{
  "ingredientId": 1,
  "quantity": 5,
  "note": "Cà chua",
  "createdByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440002",
  "dailyId": 1,
  "stockDate": "2023-01-01T00:00:00.000Z",
  "ingredientId": 1,
  "quantity": 5,
  "note": "Cà chua",
  "createdByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Update Stock Out Item

Update an item in a daily stock out record (only allowed for today's records).

**URL**: `PUT /stock-out/dailies/items/:itemPublicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| itemPublicId | string | Stock out item public ID |

**Request Body**:
```json
{
  "quantity": 3,
  "note": "Cà chua (updated)",
  "updatedByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440002",
  "dailyId": 1,
  "stockDate": "2023-01-01T00:00:00.000Z",
  "ingredientId": 1,
  "quantity": 3,
  "note": "Cà chua (updated)",
  "createdByUserId": 1,
  "updatedByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T01:00:00.000Z"
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockOutItem not found

### Delete Stock Out Item

Delete an item from a daily stock out record (only allowed for today's records).

**URL**: `DELETE /stock-out/dailies/items/:itemPublicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| itemPublicId | string | Stock out item public ID |

**Success Response**:
```json
{
  "success": true
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockOutItem not found

## Error Responses

Common error responses you may encounter:

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | Invalid date | Invalid date format |
| 400 | Invalid date range | Invalid date range |
| 400 | Chỉ được thêm/sửa/xóa trong ngày | Operation only allowed for today's records |
| 400 | Validation failed | Request data validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for the requested operation |
| 404 | StockOutDaily not found | Stock out daily record not found |
| 404 | StockOutItem not found | Stock out item not found |
| 500 | Internal server error | Unexpected server error |

## Role Permissions

| Role | Create | List | Get | Update | Delete |
|------|--------|------|-----|--------|--------|
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGER | ✓ | ✓ | ✓ | ✓ | ✓ |
| STAFF | ✓ | ✓ | ✓ | ✓ | ✓ |

Note: 
- ✓ = Allowed
- All roles have the same permissions for stock out operations