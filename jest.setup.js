// Basic Jest setup for Harry Potter Quiz App

// Mock AsyncStorage for testing
const AsyncStorageMock = {
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
};

global.AsyncStorage = AsyncStorageMock;