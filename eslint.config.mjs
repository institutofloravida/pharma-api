import config from '@rocketseat/eslint-config/node.mjs'

export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]

// import config from '@rocketseat/eslint-config/node.mjs'

// export default config
