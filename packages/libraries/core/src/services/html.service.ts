import { APP_NAME } from '../constants/pulse.constants'

export class HTMLService {
  static setDocumentTitle(title: string = ''): void {
    document.title = title.length > 0 ? title : APP_NAME
  }

  static resetDocumentTitle(): void {
    document.title = APP_NAME
  }
}
