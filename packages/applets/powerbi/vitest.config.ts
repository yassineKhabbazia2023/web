import { createVitestConfig } from '../../@config/vitest.config.base.ts'
import viteConfig from './vite.config.ts'

export default createVitestConfig(viteConfig, import.meta.url)

