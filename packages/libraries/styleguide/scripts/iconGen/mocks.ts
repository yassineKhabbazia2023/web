import type { Icon } from './types'

export const MOCKED_ICON_1: Icon = {
  name: 'c',
  componentName: 'PIC',
  fileName: 'c.svg',
  filePath: 'a/b/c.svg',
  category: 'my-category',
}
export const MOCKED_ICON_2: Icon = {
  name: 'd',
  componentName: 'PID',
  fileName: 'd.svg',
  filePath: 'a/b/d.svg',
  category: 'my-category',
}

export const MOCKED_SVG_CODE = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<path d="M4 11H2V14H4V11ZM9"/>
</svg>`

export const MOCKED_OPTIMIZED_SVG_CODE = '<svg viewBox="0 0 16 16"><path d="M4 11H2V14H4V11ZM9"/></svg>'

export const MOCKED_SVGO_CONFIG = {}
