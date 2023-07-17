const themeOptions = [
  {
    label: 'Dark',
    value: 'var(--el-color-neutral-gray-700)'
  },
  {
    label: 'White',
    value: 'var(--el-color-base-white)'
  }
] as const

export default themeOptions

export type ThemeOptions = typeof themeOptions[number]['label']
