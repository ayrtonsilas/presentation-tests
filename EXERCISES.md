# 🎯 Testing Exercises - Student Practice

This file contains one focused exercise for each type of test.

## 📋 Exercise Instructions

1. **Find the test with TODO comment** in the existing test files
2. **Implement the test** following the same structure as other tests
3. **Run the test** to verify it passes
4. **Check coverage** to see the improvement

---

## 🔬 Unit Test Exercise

### Exercise 1: User Validator - Invalid Email
**File**: `__tests__/unit/userValidator.test.js`

**Task**: Implement the test for invalid email validation.

**Test to Implement**:
```javascript
it('should reject invalid email', () => {
  // TODO: Implement this test
  // Test that validateUser rejects invalid email format
});
```

**Hint**: Look at other validation tests in the same file for the pattern.

---

## 🔗 Integration Test Exercise

### Exercise 2: User Service - Duplicate Email Prevention
**File**: `__tests__/integration/userService.integration.test.js`

**Task**: Implement the test for duplicate email prevention.

**Test to Implement**:
```javascript
it('should prevent creation of user with duplicate email', async () => {
  // TODO: Implement this test
  // Test that creating two users with same email fails
});
```

**Hint**: Look at other integration tests in the same file for the pattern.

---

## 🌐 End-to-End Test Exercise

### Exercise 3: API Login - Nonexistent User
**File**: `__tests__/e2e/userAPI.e2e.test.js`

**Task**: Implement the test for login with nonexistent user.

**Test to Implement**:
```javascript
it('should return 401 error for nonexistent user', async () => {
  // TODO: Implement this test
  // Test that login with nonexistent user returns 401
});
```

**Hint**: Look at other E2E tests in the same file for the pattern.

---

## 🚀 Running the Exercises

```bash
# Run all tests
npm test

# Run specific test file
npm test -- __tests__/unit/userValidator.test.js
npm test -- __tests__/integration/userService.integration.test.js
npm test -- __tests__/e2e/userAPI.e2e.test.js

# Check coverage
npm run test:coverage
```

## 💡 Tips for Success

1. **Look at existing tests** - follow the same pattern
2. **Use descriptive names** - make tests self-documenting
3. **Test one thing at a time** - keep tests focused
4. **Use proper assertions** - expect the right behavior
5. **Handle async properly** - use await when needed

## 🎓 Learning Objectives

After completing these exercises, you should understand:
- How to write unit tests for validation logic
- How to write integration tests for business rules
- How to write E2E tests for API error handling
- How to follow existing test patterns
- How to implement TODO tests