import styleguideLibrary from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerPort: null },
  getDocument: vi.fn(),
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: '' }))

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.test',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters],
]
