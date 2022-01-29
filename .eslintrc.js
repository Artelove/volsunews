module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'arrow-parens': ['error', 'as-needed'],
    'no-trailing-spaces': 'error',
    'computed-property-spacing': ['error', 'never'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'space-in-parens': ['error', 'never'],
    'key-spacing': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'no-multi-spaces': ['error'],
    'space-unary-ops': 1,
    'space-infix-ops': ['error', { 'int32Hint': true }],
    'arrow-spacing': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb',
        'airbnb-typescript',
      ],

      rules: {
        'no-console': 'off',
      },

      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
};
