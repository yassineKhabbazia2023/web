import { commonApi } from '@kpmg/common'
import { saveAs } from 'file-saver'
import type { AxiosResponse } from 'axios'
import { APPLICATION_REGEXP_FILENAME, DEFAULT_APPLICATION_FILENAME, API_ROUTES }
  from './launcherServiceConsts'

export async function downloadApplication(progressPercentCallback: (_: number) => void) {
  const response = await commonApi().silaeclient.get('/', {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const { progress } = progressEvent
      const percent = Math.round(100 * (progress ?? 0))

      progressPercentCallback(percent)
    },
  })
  progressPercentCallback(100)

  return response
}

export function getFileName(disposition: string) {
  const matches = disposition.match(APPLICATION_REGEXP_FILENAME)
  const filename = matches?.at(1)

  return filename
    ? filename.replace(/['"]/g, '')
    : DEFAULT_APPLICATION_FILENAME
}

export function saveApplication(response: AxiosResponse) {
  const { data, headers } = response
  const disposition = headers['content-disposition']

  const filename = getFileName(disposition)

  const blob = new Blob([data])

  saveAs(blob, filename)
}

export async function getSsoSilaeUrl() {
  const response = await commonApi().silae
    .post<{ redirectUrl: string }>(API_ROUTES.silaeSso, { wrapRedirect: true })

  const { data } = response
  const { redirectUrl } = data
  if (!redirectUrl) {
    throw new Error('no redirectUrl given')
  }
  return redirectUrl
}
