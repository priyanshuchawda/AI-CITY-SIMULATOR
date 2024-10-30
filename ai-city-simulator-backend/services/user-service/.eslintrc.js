module.exports = {
  env: {
    node: true,
    es2021: true,  // Use ES2021 for modern syntax
    jest: true,    // Recognize Jest globals
    browser: true, // For React in a browser environment
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  // TypeScript linting rules
    'plugin:react/recommended',  // React-specific linting rules
  ],
  parser: '@typescript-eslint/parser',  // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 12,  // Use ECMAScript 2021
    sourceType: 'module',
  },
  plugins: [
    'react',  // React-specific linting rules
    '@typescript-eslint',  // TypeScript-specific linting rules
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',  // Allow require() in TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // TypeScript rule
    'no-console': 'warn',
    'no-undef': 'off',  // Turn off no-undef for Jest globals
    // Add or modify any additional rules as needed
  },
  settings: {
    react: {
      version: 'detect',  // Automatically detect the React version
    },
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],  // Test file specific rules
      env: {
        jest: true,  // Recognize Jest globals in test files
      },
      rules: {
        'no-undef': 'off',  // Turn off no-undef in test files
      },
    },
  ],
};
