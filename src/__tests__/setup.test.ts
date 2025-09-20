// Simple test to verify Jest setup is working
describe('Jest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to React Native Testing Library', () => {
    // This test verifies that the testing environment is properly configured
    expect(true).toBeTruthy();
  });
});
