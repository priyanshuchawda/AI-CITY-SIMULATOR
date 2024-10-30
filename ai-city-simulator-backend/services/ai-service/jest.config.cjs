module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|mongodb|mongoose)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^axios$': require.resolve('axios'),
  },
  testTimeout: 30000,
  moduleDirectories: ['node_modules', 'src'],
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
};
