# Project Context for Qwen Code

## Project Overview

This is a NestJS-based API project called `api-cms-mirai-chay`. It's designed as a Content Management System for a vegetarian restaurant chain, specifically for managing ingredients and other store-related data.

### Main Technologies

- **Framework**: NestJS (v11)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM (v6.15.0)
- **Validation**: class-validator
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **Package Manager**: Yarn

### Project Structure

```
src/
├── app.controller.ts     # Main application controller with basic endpoint
├── app.module.ts         # Root module importing all feature modules
├── app.service.ts        # Main application service
├── infra/
│   └── prisma/           # Prisma database connection service
└── user/                 # User management module
    ├── dto/              # Data Transfer Objects
    ├── entities/         # Entity definitions
    ├── user.controller.ts
    ├── user.module.ts
    ├── user.repository.ts
    └── user.service.ts
```

### Database Schema

The project uses Prisma to define and interact with a PostgreSQL database. The schema includes:

1. **User Model**:
   - Fields: id, publicId, email, fullName, phone, role, avatar, status, timestamps
   - Roles: ADMIN, MANAGER, STAFF
   - Status: ACTIVE, INACTIVE

2. **EmailOtp Model**:
   - Fields: id, email, code, expiresAt, attempts, used, timestamps
   - Used for passwordless authentication via email OTP

## Building and Running

### Development Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up the database:
   - Configure the `DATABASE_URL` environment variable
   - Run Prisma migrations (if any exist)

### Available Scripts

- `yarn build` - Compiles the application
- `yarn start` - Runs the application in production mode
- `yarn start:dev` - Runs the application in development mode with watch
- `yarn start:debug` - Runs the application in debug mode with watch
- `yarn start:prod` - Runs the compiled application
- `yarn lint` - Runs ESLint to check for code issues
- `yarn format` - Formats code with Prettier
- `yarn test` - Runs unit tests
- `yarn test:watch` - Runs unit tests in watch mode
- `yarn test:cov` - Runs tests with coverage report
- `yarn test:e2e` - Runs end-to-end tests

## Development Conventions

### Code Structure

- Follows NestJS modular architecture
- Uses repository pattern for data access
- DTOs for data validation and transfer
- Entities for data modeling
- Services for business logic
- Controllers for handling HTTP requests

### Database Patterns

- Uses Prisma ORM for database operations
- Implements both soft delete (status change) and hard delete
- UUIDs for public identifiers
- Automatic timestamp management

### Validation

- Uses `class-validator` for input validation
- DTOs define validation rules for incoming data

## Key Features

### User Management

- Create users with email, name, phone, role
- Retrieve all users
- Find user by email
- Soft delete (set status to INACTIVE) and hard delete capabilities
- Automatic UUID generation for public IDs
- Automatic timestamp management for creation and updates

## API Endpoints

### Main App
- `GET /` - Returns "Hello World!"

### User Management
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:email` - Get user by email

## Environment Variables

The application requires the following environment variables:
- `DATABASE_URL` - Connection string for PostgreSQL database

## Testing

- Uses Jest for unit testing
- Tests are colocated with the code they test
- Test files have `.spec.ts` extension
- End-to-end tests are in the `test/` directory