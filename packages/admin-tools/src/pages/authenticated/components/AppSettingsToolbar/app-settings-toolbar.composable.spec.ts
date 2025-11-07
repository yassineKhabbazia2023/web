import { withSetup } from '@pulse/toolbox/utils/test'
import { useAppSettingsToolbar } from './app-settings-toolbar.composable'
import { AppSettingsListService } from '@admin-tools/services/app-settings-list/app-settings-list.service'
import type { DomainItem } from '@admin-tools/services/app-settings-list/app-settings-list.service.type'

vi.mock('@admin-tools/services/app-settings-list/app-settings-list.service')

describe('useAppSettingsToolbar', () => {
  const mockDomains: DomainItem[] = [
    { domainName: 'account', keysCount: 20 },
    { domainName: 'contact', keysCount: 15 },
    { domainName: 'admintools', keysCount: 10 },
  ]

  it('should initialize with default values', async () => {
    const getDomainsSpy = vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue([])

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { domains, isLoadingDomains } = result

    // Wait for onMounted to complete
    await vi.waitFor(() => {
      expect(getDomainsSpy).toHaveBeenCalledExactlyOnceWith()
    })

    expect(domains.value).toEqual([])
    expect(isLoadingDomains.value).toBe(false)

    app.unmount()
  })

  it('should fetch domains on mount', async () => {
    const getDomainsSpy = vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { domains, isLoadingDomains } = result

    // Wait for onMounted to complete
    await vi.waitFor(() => {
      expect(getDomainsSpy).toHaveBeenCalledExactlyOnceWith()
    })

    expect(domains.value).toEqual(mockDomains)
    expect(isLoadingDomains.value).toBe(false)

    app.unmount()
  })

  it('should transform domains to dropdown options format', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { domainOptions, fetchDomains } = result

    await fetchDomains()

    expect(domainOptions.value).toEqual([
      { pValue: 'account', pLabel: 'account (20)' },
      { pValue: 'contact', pLabel: 'contact (15)' },
      { pValue: 'admintools', pLabel: 'admintools (10)' },
    ])

    app.unmount()
  })

  it('should handle empty domains array', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue([])

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { domainOptions, fetchDomains } = result

    await fetchDomains()

    expect(domainOptions.value).toEqual([])

    app.unmount()
  })

  it('should handle API error gracefully', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockRejectedValue(new Error('API Error'))

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { domains, isLoadingDomains, fetchDomains } = result

    await fetchDomains()

    expect(domains.value).toEqual([])
    expect(isLoadingDomains.value).toBe(false)

    app.unmount()
  })

  it('should allow manual refetch of domains', async () => {
    const getDomainsSpy = vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const [result, app] = withSetup(() => useAppSettingsToolbar())
    const { fetchDomains, domains } = result

    // Wait for initial onMounted fetch
    await vi.waitFor(() => {
      expect(getDomainsSpy).toHaveBeenCalledTimes(1)
    })

    expect(domains.value).toEqual(mockDomains)

    // Update mock data
    const newMockDomains: DomainItem[] = [
      { domainName: 'newDomain', keysCount: 5 },
    ]
    getDomainsSpy.mockResolvedValue(newMockDomains)

    await fetchDomains()

    expect(getDomainsSpy).toHaveBeenCalledTimes(2)
    expect(domains.value).toEqual(newMockDomains)

    app.unmount()
  })
})
