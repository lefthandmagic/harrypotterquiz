# 🧪 Harry Potter Quiz App - Testing Guide

## 📚 Overview

This guide explains how to run and understand the tests for the Harry Potter Quiz app. The test suite covers all critical functionality including quiz scoring logic, chapter progression, house sorting, and data validation.

**Current Status:** ✅ Core business logic tests implemented and working
**Framework:** Jest with TypeScript support

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
src/
└── __tests__/
    ├── core-logic.test.ts         # ✅ Core business logic tests (WORKING)
    ├── setup.test.ts              # Basic Jest setup verification
    └── integration/               # (Future: Full component tests)
        └── QuizProgression.test.tsx   # (Requires React Native setup)
```

**Note:** Component tests are prepared but require additional React Native testing setup. The core logic tests cover the essential business functionality.

## 🎯 Test Coverage

### 1. Core Logic Tests (`core-logic.test.ts`) ✅ WORKING

**What it tests:**
- ✅ **Quiz Scoring Logic**: Percentage calculation, passing thresholds (70%), points calculation
- ✅ **Chapter Progression Logic**: Next chapter calculation, year advancement, chapter unlocking
- ✅ **House Sorting Logic**: Determining house based on highest score, handling ties
- ✅ **Data Validation**: Question structure validation, AsyncStorage mocking

**Key scenarios:**
```typescript
// Quiz Scoring (25 tests passing)
calculatePercentage(7, 10) → 0.7 (70%)
isPassingScore(7, 10) → true (passes)
calculatePoints(7) → 70 points

// Chapter Progression 
getNextProgress(1, 1) → { year: 1, chapter: 2 }
getNextProgress(1, 8) → { year: 2, chapter: 1 } // Year advancement

// House Sorting
determineHouse({ gryffindor: 10, hufflepuff: 5, ... }) → 'gryffindor'
```

### 2. Component Tests (Future Implementation)

**Status:** 🗺️ Prepared but not yet functional due to React Native testing complexity

**Files created:**
- `UserContext.test.tsx` - User state management tests
- `QuizScreen.test.tsx` - Quiz functionality tests  
- `HomeScreen.test.tsx` - Chapter unlocking tests
- `QuizProgression.test.tsx` - Integration tests

**What they would test:**
- 🗺️ Quiz question rendering and navigation
- 🗺️ Answer selection and scoring
- 🗺️ Timer functionality and auto-submission
- 🗺️ Results screen with pass/fail messaging
- 🗺️ Chapter unlocking logic based on user progress
- 🗺️ Complete user journey from sorting to chapter completion

**Why not working yet:**
React Native component testing requires additional setup with Metro bundler and React Native Testing Library compatibility. The core business logic is fully tested, which covers the most critical functionality.

## 🔧 How to Add New Tests

### Testing a New Component

1. **Create test file:**
```bash
src/screens/__tests__/NewScreen.test.tsx
```

2. **Basic test structure:**
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NewScreen } from '../NewScreen';
import { UserProvider } from '../../contexts/UserContext';

describe('NewScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <UserProvider>
        <NewScreen />
      </UserProvider>
    );
    
    expect(getByText('Expected Text')).toBeTruthy();
  });
});
```

### Testing New Functionality

1. **Add to existing test files** if it's related functionality
2. **Create focused tests** for specific edge cases
3. **Update integration tests** if it affects the user flow

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:** Check jest.config.js moduleNameMapping and ensure mocks are set up correctly.

### Issue: AsyncStorage errors
**Solution:** The mock is already configured in jest.setup.js, but ensure tests clear storage:
```typescript
beforeEach(() => {
  AsyncStorage.clear();
});
```

### Issue: Navigation errors
**Solution:** Navigation is mocked in jest.setup.js. For specific tests, override the mock:
```typescript
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
```

### Issue: Timer tests failing
**Solution:** Use fake timers:
```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// In test
act(() => {
  jest.advanceTimersByTime(2000);
});
```

## 📊 Coverage Reports

After running `npm run test:coverage`, check the `coverage/` directory:

- **lcov-report/index.html** - Visual coverage report
- **Text summary** in terminal
- **Target coverage:** Aim for >80% on core functionality

### Key Files to Maintain High Coverage:
- `UserContext.tsx` - Core state management
- `QuizScreen.tsx` - Main user interaction
- `HomeScreen.tsx` - Navigation and progression
- Data validation functions

## 🎯 Testing Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ✅ Good - Tests what user sees
expect(getByText('Chapter Unlocked!')).toBeTruthy();

// ❌ Bad - Tests internal state
expect(component.state.quizPassed).toBe(true);
```

### 2. Use Descriptive Test Names
```typescript
// ✅ Good
it('should show "Try Again" button when quiz score is below 70%')

// ❌ Bad
it('should handle quiz failure')
```

### 3. Test Edge Cases
- Exactly 70% score (minimum passing)
- 0% and 100% scores
- Chapter 8 → Year progression
- Empty/invalid data scenarios

### 4. Keep Tests Independent
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.clear();
});
```

## 🚀 Continuous Integration

To run tests in CI/CD pipelines:

```bash
# In your CI script
npm ci
npm run test:coverage
```

The tests are designed to be deterministic and should pass consistently across different environments.

---

Happy Testing! 🧙‍♂️✨
