module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,  // Ensures Jest globals are recognized
    browser: true,  // Required if you're working with browser globals
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  // Adds TypeScript rules if you're using TypeScript
    'plugin:react/recommended',  // React-specific linting rules
    // Add any other configurations or style guides you use
  ],
  parser: '@typescript-eslint/parser',  // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 2018,  // Matches ECMAScript 2018
    sourceType: 'module',
  },
  plugins: [
    'react',  // Enables React-specific linting rules
    '@typescript-eslint',  // Enables TypeScript-specific linting rules
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',  // Allows require() in TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // TypeScript-specific rule
    'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',  // Automatically detects the React version
    },
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],  // Apply specific rules to test files
      env: {
        jest: true,
      },
    },
  ],
};
