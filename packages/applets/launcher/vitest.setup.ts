import { vi } from 'vitest'
import { setupVitest } from '../../@config/vitest.setup.base'

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
}))

vi.mock('@pulse/toolbox/utils/pdf-worker', () => ({ configurePdfWorker: vi.fn() }))

setupVitest()
