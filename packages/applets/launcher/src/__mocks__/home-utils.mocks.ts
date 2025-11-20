import type { Mock } from 'vitest'
import { LauncherKey } from '@launcher/pages/launcher/LauncherTypes'

export const mockedPercent = 47
export const getLaunchCardsMock: Mock = vi.fn()
export const handleClickActionMock: Mock = vi.fn()
export const handleDownloadMock =vi.fn((_key: LauncherKey, onSilaeDownloadProgress: (_: number) => void) => {
  onSilaeDownloadProgress(mockedPercent)
  return Promise.resolve()
})
export const getSilaeDownloadLabelMock: Mock = vi.fn()


export const LauncherUtilsMocks = {
  getLaunchCards: getLaunchCardsMock,
  handleClickAction: handleClickActionMock,
  handleDownload: handleDownloadMock,
  getSilaeDownloadLabel: getSilaeDownloadLabelMock,
}
