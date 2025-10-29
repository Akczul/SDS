/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
