# 🧪 Automated Testing Examples - Presentation

This project demonstrates different types of automated testing in JavaScript using Jest, focusing on user creation scenarios.

## 📋 Types of Tests Demonstrated

### 1. **Unit Tests** (`__tests__/unit/`)
- **What it tests**: Functions and classes in isolation
- **Characteristics**: 
  - Uses mocks to isolate dependencies
  - Tests pure business logic
  - Fast execution
  - High code coverage

**Examples in this project:**
- `userService.test.js` - Tests user service with mocks
- `userValidator.test.js` - Tests data validations

### 2. **Integration Tests** (`__tests__/integration/`)
- **What it tests**: Integration between components
- **Characteristics**:
  - Tests real interaction between modules
  - Uses real database (simulated)
  - Validates complete flows
  - Detects integration problems

**Examples in this project:**
- `userService.integration.test.js` - Tests service + database

### 3. **End-to-End Tests (E2E)** (`__tests__/e2e/`)
- **What it tests**: Complete application flow
- **Characteristics**:
  - Tests complete API via HTTP
  - Simulates user behavior
  - Validates responses and status codes
  - Tests real usage scenarios

**Examples in this project:**
- `userAPI.e2e.test.js` - Tests entire REST API

## 🚀 How to Run

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Recommended: Using asdf
This project includes a `.tool-versions` file for asdf version management:

```bash
# Install asdf (if not already installed)
# https://asdf-vm.com/guide/getting-started.html

# Install the correct Node.js version
asdf install

# Set the Node.js version for this project
asdf local nodejs 20.9.0
```

### Check Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

### Installation
```bash
npm install
```

### Run all tests
```bash
npm test
```

### Run by type
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Watch mode (re-runs when files change)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Run the application
```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Project Structure

```
src/
├── models/           # Data models
│   └── User.js
├── services/         # Business logic
│   └── userService.js
├── database/         # Data layer
│   └── database.js
├── validators/       # Validations
│   └── userValidator.js
├── routes/           # API routes
│   └── userRoutes.js
└── server.js         # Express server

__tests__/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/              # End-to-end tests
```

## 🎯 Test Scenarios Demonstrated

### User Creation
- ✅ Input data validation
- ✅ Password hashing with bcrypt
- ✅ Duplicate email verification
- ✅ Database persistence
- ✅ Safe return (without password)

### User Search
- ✅ Search by ID
- ✅ Search by email
- ✅ Handle user not found

### User Update
- ✅ Data update
- ✅ New password hashing
- ✅ Existence validation

### Authentication
- ✅ Credential validation
- ✅ Hashed password comparison
- ✅ Handle invalid credentials

## 🔧 Technologies Used

- **Jest** - Testing framework
- **Supertest** - HTTP API testing
- **Express** - Web framework
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **UUID** - Unique ID generation

## 📈 Quality Metrics

- **Code coverage**: Configured for detailed reports
- **Fast tests**: Parallel execution
- **Efficient mocks**: Dependency isolation
- **Realistic scenarios**: Production-like data and flows

## 🎓 Concepts Demonstrated

1. **AAA Pattern** (Arrange, Act, Assert)
2. **Mocking and Stubbing**
3. **Test Doubles** (Mocks, Stubs, Fakes)
4. **Setup and Teardown** (beforeEach, afterEach)
5. **Test Data Builders**
6. **Edge Cases and Error Handling**
7. **API Testing** with Supertest
8. **Database Testing** (in-memory)

## 🎯 Student Exercises

This project includes one focused exercise for each type of test:

- **Unit Test**: User model methods testing
- **Integration Test**: User service edge cases
- **E2E Test**: API error scenarios

See [EXERCISES.md](./EXERCISES.md) for detailed instructions and test cases to implement.

## 💡 Benefits of Automated Testing

- **Reliability**: Detects bugs before production
- **Documentation**: Tests serve as living documentation
- **Safe refactoring**: Allows changes with confidence
- **Faster development**: Immediate feedback
- **Code quality**: Enforces good practices

## 🚨 Key Points

- **Unit tests**: Should be fast and isolated
- **Integration tests**: Test real interactions
- **E2E tests**: Cover complete user flows
- **Maintenance**: Tests need to be maintained with code
- **Coverage**: 100% doesn't guarantee quality, but helps identify gaps