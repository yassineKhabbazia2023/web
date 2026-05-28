export const mockedSilaeUrl = 'https://mocked.silae.url'

export const launcherServicesMocks = {
  getSsoSilaeUrl: vi.fn(() => mockedSilaeUrl),
  downloadApplication: vi.fn(() => mockedSilaeUrl),
  saveApplication: vi.fn(() => mockedSilaeUrl),
}
