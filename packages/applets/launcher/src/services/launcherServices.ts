import { api } from '@pulse/common/api'
import { saveAs } from 'file-saver'
import type { AxiosResponse, AxiosProgressEvent } from 'axios'
import { EXTRACT_DOWNLOADED_FILENAME_REGEXP, DEFAULT_APPLICATION_FILENAME, ApiRoutes }
  from './launcherServiceConsts'

export async function downloadApplication(progressPercentCallback: (_: number) => void) {
  const response = await api.gateway.get(ApiRoutes.SILAE_SSO_FILE, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      const { progress } = progressEvent
      const percent = Math.round(100 * (progress ?? 0))

      progressPercentCallback(percent)
    },
  })
  progressPercentCallback(100)

  return response
}

export function getFileName(disposition: string) {
  const matches = EXTRACT_DOWNLOADED_FILENAME_REGEXP.exec(disposition)
  const filename = matches?.at(1)

  return filename
    ? filename.replaceAll(/['"]/g, '')
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
  const response = await api.gateway
    .post<{ redirectUrl: string }>(ApiRoutes.SILAE_SSO, { wrapRedirect: true })

  const { data } = response || {}
  const { redirectUrl } = data || ''
  if (!redirectUrl) {
    throw new Error('no redirectUrl given')
  }
  return encodeURIComponent(redirectUrl)
}
