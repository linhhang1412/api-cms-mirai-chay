# Stock In (Nhập Kho) API Documentation

This document provides detailed information about the Stock In API endpoints for frontend development.

## Table of Contents
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Create Daily Stock In](#create-daily-stock-in)
  - [List Today's Stock Ins](#list-todays-stock-ins)
  - [List Stock In History](#list-stock-in-history)
  - [Get Stock In by Public ID](#get-stock-in-by-public-id)
  - [Update Stock In Daily](#update-stock-in-daily)
  - [Delete Stock In Daily](#delete-stock-in-daily)
  - [Add Stock In Item](#add-stock-in-item)
  - [Update Stock In Item](#update-stock-in-item)
  - [Delete Stock In Item](#delete-stock-in-item)
- [Error Responses](#error-responses)
- [Role Permissions](#role-permissions)

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### StockInDailyEntity

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
| items | StockInItemEntity[] | Associated items |

### StockInItemEntity

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

### CreateStockInDailyDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| stockDate | string | No | Stock date (YYYY-MM-DD, defaults to today) |
| note | string | No | Note |
| createdByUserId | number | Yes | Creator user ID |

### AddStockInItemDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ingredientId | number | Yes | Ingredient ID |
| quantity | number | Yes | Quantity |
| note | string | No | Note |
| createdByUserId | number | Yes | Creator user ID |

### UpdateStockInItemDto

All fields are optional:
| Field | Type | Description |
|-------|------|-------------|
| quantity | number | Quantity |
| note | string | Note |
| updatedByUserId | number | Updater user ID |

### UpdateStockInDailyDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| note | string | No | Note |
| updatedByUserId | number | No | Updater user ID |

## Endpoints

### Create Daily Stock In

Create a new daily stock in record (header).

**URL**: `POST /stock-in/dailies`

**Permissions**: ADMIN, MANAGER, STAFF

**Request Body**:
```json
{
  "stockDate": "2023-01-01",
  "note": "Nhập hàng đầu tháng",
  "createdByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Nhập hàng đầu tháng",
  "createdByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### List Today's Stock Ins

Get a list of today's stock in records.

**URL**: `GET /stock-in/dailies/today`

**Permissions**: ADMIN, MANAGER, STAFF

**Success Response**:
```json
[
  {
    "id": 1,
    "publicId": "550e8400-e29b-41d4-a716-446655440000",
    "stockDate": "2023-01-01T00:00:00.000Z",
    "note": "Nhập hàng đầu tháng",
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

### List Stock In History

Get a list of historical stock in records (excluding today).

**URL**: `GET /stock-in/dailies/history`

**Permissions**: ADMIN, MANAGER, STAFF

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | string | No | Start date (YYYY-MM-DD, defaults to 30 days ago) |
| to | string | No | End date (YYYY-MM-DD, defaults to yesterday) |

**Request Examples**:
```
GET /stock-in/dailies/history
GET /stock-in/dailies/history?from=2022-12-01&to=2022-12-31
```

**Success Response**:
```json
[
  {
    "id": 2,
    "publicId": "550e8400-e29b-41d4-a716-446655440001",
    "stockDate": "2022-12-31T00:00:00.000Z",
    "note": "Nhập hàng cuối năm",
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

### Get Stock In by Public ID

Get details of a specific stock in record by public ID.

**URL**: `GET /stock-in/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock in record public ID |

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Nhập hàng đầu tháng",
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
      "quantity": 10,
      "note": "Cà chua",
      "createdByUserId": 1,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedByUserId": null,
      "updatedAt": null
    }
  ]
}
```

### Update Stock In Daily

Update a daily stock in record (only allowed for today's records).

**URL**: `PUT /stock-in/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock in record public ID |

**Request Body**:
```json
{
  "note": "Nhập hàng đầu tháng (updated)",
  "updatedByUserId": 1
}
```

**Success Response**:
```json
{
  "id": 1,
  "publicId": "550e8400-e29b-41d4-a716-446655440000",
  "stockDate": "2023-01-01T00:00:00.000Z",
  "note": "Nhập hàng đầu tháng (updated)",
  "createdByUserId": 1,
  "updatedByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T01:00:00.000Z"
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockInDaily not found

### Delete Stock In Daily

Delete a daily stock in record (only allowed for today's records).

**URL**: `DELETE /stock-in/dailies/:publicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock in record public ID |

**Success Response**:
```json
{
  "success": true
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockInDaily not found

### Add Stock In Item

Add an item to a daily stock in record.

**URL**: `POST /stock-in/dailies/:publicId/items`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| publicId | string | Stock in record public ID |

**Request Body**:
```json
{
  "ingredientId": 1,
  "quantity": 10,
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
  "quantity": 10,
  "note": "Cà chua",
  "createdByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Update Stock In Item

Update an item in a daily stock in record (only allowed for today's records).

**URL**: `PUT /stock-in/dailies/items/:itemPublicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| itemPublicId | string | Stock in item public ID |

**Request Body**:
```json
{
  "quantity": 15,
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
  "quantity": 15,
  "note": "Cà chua (updated)",
  "createdByUserId": 1,
  "updatedByUserId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T01:00:00.000Z"
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockInItem not found

### Delete Stock In Item

Delete an item from a daily stock in record (only allowed for today's records).

**URL**: `DELETE /stock-in/dailies/items/:itemPublicId`

**Permissions**: ADMIN, MANAGER, STAFF

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| itemPublicId | string | Stock in item public ID |

**Success Response**:
```json
{
  "success": true
}
```

**Error Responses**:
- 400: Chỉ được thêm/sửa/xóa trong ngày (Only allowed for today's records)
- 404: StockInItem not found

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
| 404 | StockInDaily not found | Stock in daily record not found |
| 404 | StockInItem not found | Stock in item not found |
| 500 | Internal server error | Unexpected server error |

## Role Permissions

| Role | Create | List | Get | Update | Delete |
|------|--------|------|-----|--------|--------|
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGER | ✓ | ✓ | ✓ | ✓ | ✓ |
| STAFF | ✓ | ✓ | ✓ | ✓ | ✓ |

Note: 
- ✓ = Allowed
- All roles have the same permissions for stock in operations