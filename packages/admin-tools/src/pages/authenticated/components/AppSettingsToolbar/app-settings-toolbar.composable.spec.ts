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

  it('should initialize with default values', () => {
    const { domains, isLoadingDomains } = useAppSettingsToolbar()

    expect(domains.value).toEqual([])
    expect(isLoadingDomains.value).toBe(false)
  })

  it('should fetch domains manually', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const { domains, isLoadingDomains, fetchDomains } = useAppSettingsToolbar()

    await fetchDomains()

    expect(AppSettingsListService.getDomains).toHaveBeenCalledExactlyOnceWith()
    expect(domains.value).toEqual(mockDomains)
    expect(isLoadingDomains.value).toBe(false)
  })

  it('should transform domains to dropdown options format', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const { domainOptions, fetchDomains } = useAppSettingsToolbar()

    await fetchDomains()

    expect(domainOptions.value).toEqual([
      { pValue: 'account', pLabel: 'account (20)' },
      { pValue: 'contact', pLabel: 'contact (15)' },
      { pValue: 'admintools', pLabel: 'admintools (10)' },
    ])
  })

  it('should handle empty domains array', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue([])

    const { domainOptions, fetchDomains } = useAppSettingsToolbar()

    await fetchDomains()

    expect(domainOptions.value).toEqual([])
  })

  it('should handle API error gracefully', async () => {
    vi.spyOn(AppSettingsListService, 'getDomains').mockRejectedValue(new Error('API Error'))

    const { domains, isLoadingDomains, fetchDomains } = useAppSettingsToolbar()

    await fetchDomains()

    expect(domains.value).toEqual([])
    expect(isLoadingDomains.value).toBe(false)
  })

  it('should allow manual refetch of domains', async () => {
    const getDomainsSpy = vi.spyOn(AppSettingsListService, 'getDomains').mockResolvedValue(mockDomains)

    const { fetchDomains, domains } = useAppSettingsToolbar()

    await fetchDomains()

    expect(getDomainsSpy).toHaveBeenCalledExactlyOnceWith()

    // Update mock data
    const newMockDomains: DomainItem[] = [
      { domainName: 'newDomain', keysCount: 5 },
    ]
    getDomainsSpy.mockResolvedValue(newMockDomains)

    await fetchDomains()

    expect(getDomainsSpy).toHaveBeenCalledTimes(2)
    expect(domains.value).toEqual(newMockDomains)
  })
})
