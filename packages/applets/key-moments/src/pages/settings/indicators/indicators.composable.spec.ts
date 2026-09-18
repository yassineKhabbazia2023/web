import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { IndicatorSign, ValueKind } from '@key-moments/enums/key-moments.enums'
import { useIndicators } from './indicators.composable'

const INDICATORS = [
  { id: 'ca', label: 'Chiffre d\'affaires', shortLabel: 'CA', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME },
  { id: 'marge', label: 'Marge', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME },
  { id: 'vieux', label: 'Ancien', kind: ValueKind.DAYS, sign: IndicatorSign.EXPENSE, isDeprecated: true },
]

beforeEach(() => {
  vi.spyOn(IndicatorsService, 'getIndicators').mockResolvedValue(INDICATORS)
})

describe('useIndicators', () => {

  it('should read the vocabulary on mount and leave the deprecated out', async () => {
    const [{ visibleIndicators, isLoading }] = withSetup(() => useIndicators())
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(visibleIndicators.value.map(indicator => indicator.id)).toEqual(['ca', 'marge'])
  })

  it('should show the deprecated when asked', async () => {
    const [{ visibleIndicators, showDeprecated }] = withSetup(() => useIndicators())
    await flushPromises()

    showDeprecated.value = true

    expect(visibleIndicators.value).toHaveLength(3)
  })

  it('should search on the code and on the label, accents ignored', async () => {
    const [{ visibleIndicators, searchText }] = withSetup(() => useIndicators())
    await flushPromises()

    searchText.value = 'MARG'
    expect(visibleIndicators.value.map(indicator => indicator.id)).toEqual(['marge'])

    searchText.value = 'chiffre d\'aff'
    expect(visibleIndicators.value.map(indicator => indicator.id)).toEqual(['ca'])
  })

  it('should deprecate then read the vocabulary again', async () => {
    vi.spyOn(IndicatorsService, 'deprecate').mockResolvedValue()
    const [{ deprecate }] = withSetup(() => useIndicators())
    await flushPromises()

    await deprecate('ca')

    expect(vi.mocked(IndicatorsService.deprecate)).toHaveBeenCalledWith('ca')
    expect(vi.mocked(IndicatorsService.getIndicators)).toHaveBeenCalledTimes(2)
  })

  it('should read an indicator already deprecated as a list simply behind', async () => {
    vi.spyOn(IndicatorsService, 'deprecate').mockRejectedValue({ response: { status: 409 } })
    const [{ deprecate }] = withSetup(() => useIndicators())
    await flushPromises()

    await deprecate('ca')

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('warning', expect.any(String))
    expect(vi.mocked(IndicatorsService.getIndicators)).toHaveBeenCalledTimes(2)
  })

  it('should tell the reader when a restore fails for any other reason', async () => {
    vi.spyOn(IndicatorsService, 'restore').mockRejectedValue(new Error('boom'))
    const [{ restore }] = withSetup(() => useIndicators())
    await flushPromises()

    await restore('vieux')

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
  })
})
