# API Modules Documentation

This document provides an overview of all available API modules in the system.

## Table of Contents
- [User](#user)
- [Ingredient Category](#ingredient-category)
- [Ingredient Unit](#ingredient-unit)
- [Ingredient](#ingredient)
- [Stock In (Nhập Kho)](#stock-in-nhập-kho)
- [Stock Out (Xuất Kho)](#stock-out-xuất-kho)

## User

**Base URL**: `/users`

Manage users in the system.

**Documentation**: [user-api.md](user-api.md)

### Key Features
- Create, list, get by ID, get by email, update, and delete users
- Soft delete support (deactivate instead of permanent removal)
- Unique email validation
- Role-based access control

## Ingredient Category

**Base URL**: `/ingredient-categories`

Manage ingredient categories (e.g., "Rau củ quả", "Gia vị", "Đồ đông lạnh").

**Documentation**: [ingredient-category-api.md](ingredient-category-api.md)

### Key Features
- Create, list, update, and delete categories
- Soft delete support (deactivate instead of permanent removal)
- Unique code validation
- Role-based access control

## Ingredient Unit

**Base URL**: `/ingredient-units`

Manage ingredient units (e.g., "Kilogram", "Liter", "Piece").

**Documentation**: [ingredient-unit-api.md](ingredient-unit-api.md)

### Key Features
- Create, list, get by ID, update, and delete units
- Soft delete support (deactivate instead of permanent removal)
- Unique code validation
- Role-based access control

## Ingredient

**Base URL**: `/ingredients`

Manage ingredients (e.g., "Tomato", "Onion", "Salt").

**Documentation**: [ingredient-api.md](ingredient-api.md)

### Key Features
- Create, list, get by ID, update, and delete ingredients
- Link ingredients to categories and units
- Set reference prices and minimum stock thresholds
- Soft delete support (deactivate instead of permanent removal)
- Unique code validation
- Role-based access control
- Update minimum stock threshold separately

## Stock In (Nhập Kho)

**Base URL**: `/stock-in`

Manage daily stock in operations (purchases, inventory additions).

**Documentation**: [stock-in-api.md](stock-in-api.md)

### Key Features
- Create daily stock in records (headers)
- Add items to daily stock in records
- List today's stock in records
- List historical stock in records
- Update and delete today's records only
- Role-based access control (all roles have same permissions)

## Stock Out (Xuất Kho)

**Base URL**: `/stock-out`

Manage daily stock out operations (sales, kitchen usage).

**Documentation**: [stock-out-api.md](stock-out-api.md)

### Key Features
- Create daily stock out records (headers)
- Add items to daily stock out records
- List today's stock out records
- List historical stock out records
- Update and delete today's records only
- Role-based access control (all roles have same permissions)