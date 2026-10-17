import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { files: ['**/*.{ts,mts,vue}'] },
  globalIgnores(['**/dist/**', 'cv/build/**', '.claude/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  // Guards against clashes with native elements in in-DOM templates; this repo is SFC-only.
  { rules: { 'vue/multi-word-component-names': 'off' } },
  // Dropping a key by rest destructure is the omit idiom, not an unused variable.
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }] } },
)
