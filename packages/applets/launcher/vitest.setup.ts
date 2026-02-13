import { vi } from 'vitest'
import { setupVitest } from '../../@config/vitest.setup.base'

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerPort: null },
  getDocument: vi.fn(),
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: '' }))

setupVitest()
