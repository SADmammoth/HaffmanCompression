module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false
    }
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
    'no-console': 'off',
    'react/prop-types': 0,
    'no-undef': 1,
    'no-unused-vars': 1
  },
  plugins: ['babel'],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
