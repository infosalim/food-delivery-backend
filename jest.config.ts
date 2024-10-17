export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Test files location
  moduleFileExtensions: ['ts', 'js'], // Extensions Jest will handle
  transform: {
    '^.+\\.ts?$': 'ts-jest', // Use ts-jest to compile TypeScript
  },
  coverageDirectory: './coverage', // Location for test coverage reports
  collectCoverageFrom: ['./**/*.ts'], // Collect coverage from .ts files
};
