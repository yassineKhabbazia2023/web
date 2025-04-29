import { APP_NAME } from '../constants/pulse.constants'

export class HTMLService {
  static setDocumentTitle(title: string = ''): void {
    const separator = title.length > 0 ? ' - ' : ''
    document.title = `${APP_NAME}` + separator + title
  }
}
