import { AppVersionManager } from './app-version.manager'

const mocks = vi.hoisted(() => {
  return {
    packageJson: { version: '1.2.3' as string | undefined },
    versionJson: {
      shortCommitId: 'abc123' as string | undefined,
      branchName: 'feature/test-branch' as string | undefined,
    },
  }
})

vi.mock('../../../../../package.json', () => {
  return {
    default: mocks.packageJson,
  }
})

vi.mock('../../../../../version.json', () => {
  return {
    default: mocks.versionJson,
  }
})

describe('AppVersionManager', () => {
  describe('getMonorepoVersion', () => {
    it('should return the version from package.json if it exists', () => {
      expect(AppVersionManager.getMonorepoVersion()).toBe('1.2.3')
    })

    it('should return an empty string if version does not exist in package.json', () => {
      delete mocks.packageJson.version
      expect(AppVersionManager.getMonorepoVersion()).toBe('')
    })
  })

  describe('getShortCommitId', () => {
    it('should return the shortCommitId from version.json if it exists', () => {
      expect(AppVersionManager.getShortCommitId()).toBe('abc123')
    })

    it('should return an empty string if shortCommitId does not exist in version.json', () => {
      delete mocks.versionJson.shortCommitId
      expect(AppVersionManager.getShortCommitId()).toBe('')
    })
  })

  describe('getBranchName', () => {
    it('should return the branchName from version.json if it exists', () => {
      expect(AppVersionManager.getBranchName()).toBe('feature/test-branch')
    })

    it('should return an empty string if branchName does not exist in version.json', () => {
      delete mocks.versionJson.branchName
      expect(AppVersionManager.getBranchName()).toBe('')
    })
  })
})
