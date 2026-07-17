// Module-shaped mock for '@pulse/styleguide', registered by vitest.setup.ts.
// useResponsive is the only styleguide export consumed by this package: no
// importOriginal spread on purpose, so the real styleguide (and element-plus)
// is never loaded in this project's workers. If a new styleguide export gets
// consumed here, the loud "No export defined on the mock" error points back
// to this file.
export { useResponsiveMock as useResponsive } from './responsive.spies'
