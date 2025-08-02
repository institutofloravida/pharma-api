import config from '@rocketseat/eslint-config/node.mjs'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
export default [
  ...config,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@stylistic/multiline-ternary': 'off',
      ...vitest.configs.recommended.rules,
      '@stylistic/max-len': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/indent': 'off',
    },
    plugins: {

      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },

  },

]
