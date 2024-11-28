
import packageJson from '../../../../../package.json'

export class AppVersionManager {
  static getMonorepoVersion() {
    if(packageJson?.version) {
      return packageJson.version
    }
    return ''
  }
}