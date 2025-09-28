// eslint.config.js - Configuración completa con Prettier
import js from '@eslint/js'
import globals, { vitest } from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import vitestGlobals from 'eslint-plugin-vitest-globals'

export default [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...vitestGlobals.environments.env.globals,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      prettier: prettier,
      'vitest-globals': vitestGlobals,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...vitestGlobals.configs.recommended.rules,

      ...prettierConfig.rules,

      'prettier/prettier': 'error',

      indent: 'off',
      'linebreak-style': ['error', 'unix'],
      quotes: 'off',
      semi: 'off',
      eqeqeq: 'error',
      'no-trailing-spaces': 'off',
      'object-curly-spacing': 'off',
      'arrow-spacing': 'off',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: '18.2',
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...vitestGlobals.environments.env.globals,
      },
    },
    rules: {
      ...vitestGlobals.configs.recommended.rules,
    },
  },
]
