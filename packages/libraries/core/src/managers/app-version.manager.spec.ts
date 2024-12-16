import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppVersionManager } from './app-version.manager'

const mocks = vi.hoisted(() => {
  return {
    default: { version: '1.2.3' as string | undefined },
  }
})

vi.mock('../../../../../package.json', () => {
  return {
    default: mocks.default,
  }
})

describe('AppVersionManager', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return the version from package.json if it exists', () => {
    expect(AppVersionManager.getMonorepoVersion()).toBe('1.2.3')
  })

  it('should return an empty string if version does not exist in package.json', () => {
    delete mocks.default.version
    expect(AppVersionManager.getMonorepoVersion()).toBe('')
  })
})
