import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
import refresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.tools/**', 'nasa-space-medbay-backend-20261115T101336Z-1-001/**', 'public/assets/decoders/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  { files: ['scripts/*.mjs', 'docs/**/*.mjs'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['server/**/*.js'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/scene/**/*.tsx'],
    // R3F intentionally exposes mutable Three objects. Effects/frame loops own these
    // mutations; React DOM components and all other hook checks stay protected.
    rules: { 'react-hooks/immutability': 'off' },
  },
)
