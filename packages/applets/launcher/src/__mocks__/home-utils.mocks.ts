import { LauncherKey } from '@launcher/pages/launcher/LauncherTypes'

export const mockedPercent = 47
export const getLaunchCardsMock = vi.fn()
export const handleClickActionMock = vi.fn()
export const handleDownloadMock =vi.fn((_key: LauncherKey, onSilaeDownloadProgress: (_: number) => void) => {
  onSilaeDownloadProgress(mockedPercent)
  return Promise.resolve()
})
export const getSilaeDownloadLabelMock = vi.fn()


export const LauncherUtilsMocks = {
  getLaunchCards: getLaunchCardsMock,
  handleClickAction: handleClickActionMock,
  handleDownload: handleDownloadMock,
  getSilaeDownloadLabel: getSilaeDownloadLabelMock,
}
