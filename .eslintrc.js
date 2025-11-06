module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended'
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // 基本规则
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn'
  },
  ignorePatterns: ['dist/', 'node_modules/']
};