# 🎯 Testing Exercises - Student Practice

This file contains one focused exercise for each type of test.

## 📋 Exercise Instructions

1. **Read the existing tests** to understand the patterns
2. **Implement the new test** following the same structure
3. **Run the test** to verify it passes
4. **Check coverage** to see the improvement

---

## 🔬 Unit Test Exercise

### Exercise 1: User Model Methods
**File**: `__tests__/unit/userModel.test.js`

**Task**: Create unit tests for the User model class.

**Test Cases to Implement**:
- [ ] `toJSON()` should return user data with password
- [ ] `toSafeJSON()` should return user data without password
- [ ] Constructor should set default dates when not provided

**Hint**: Look at `src/models/User.js` to understand the methods.

---

## 🔗 Integration Test Exercise

### Exercise 2: User Service Edge Cases
**File**: `__tests__/integration/userService.edgeCases.test.js`

**Task**: Create integration tests for edge cases.

**Test Cases to Implement**:
- [ ] `createUser()` should handle database connection errors
- [ ] `updateUser()` should validate data before updating
- [ ] `deleteUser()` should clean up related data

**Hint**: Use real database operations and test error conditions.

---

## 🌐 End-to-End Test Exercise

### Exercise 3: API Error Scenarios
**File**: `__tests__/e2e/apiErrorScenarios.test.js`

**Task**: Create E2E tests for API error handling.

**Test Cases to Implement**:
- [ ] POST `/api/users` with malformed JSON should return 400
- [ ] GET `/api/users/invalid-uuid` should return 400
- [ ] POST `/api/users/login` with empty body should return 400

**Hint**: Test invalid inputs and malformed requests.

---

## 🚀 Running the Exercises

```bash
# Run all tests
npm test

# Run specific exercise
npm test -- --testPathPattern="exerciseName"

# Check coverage
npm run test:coverage
```

## 💡 Tips for Success

1. **Start with unit tests** - they're the easiest
2. **Follow existing patterns** - look at current tests
3. **Test edge cases** - not just happy paths
4. **Use descriptive names** - make tests self-documenting
5. **Keep tests simple** - one assertion per test when possible

## 🎓 Learning Objectives

After completing these exercises, you should understand:
- How to write effective unit tests
- How to test integration between components
- How to test complete API workflows
- How to handle error scenarios
- How to improve test coverage