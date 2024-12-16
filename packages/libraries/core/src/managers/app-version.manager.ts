import packageJson from '../../../../../package.json'

export class AppVersionManager {
  static getMonorepoVersion() {
    return packageJson?.version ?? ''
  }
}