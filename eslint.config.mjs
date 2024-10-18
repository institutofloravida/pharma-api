import config from '@rocketseat/eslint-config/node.mjs'
import vitest from '@vitest/eslint-plugin'
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      ...vitest.configs.recommended.rules,
      '@stylistic/max-len': 'off',
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
