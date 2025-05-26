import packageJson from '../../../../../package.json'
import versionJson from '../../../../../version.json'

export class AppVersionManager {
  static getMonorepoVersion() {
    return packageJson?.version ?? ''
  }

  static getShortCommitId() {
    return versionJson?.shortCommitId ?? ''
  }

  static getBranchName() {
    return versionJson?.branchName ?? ''
  }
}
