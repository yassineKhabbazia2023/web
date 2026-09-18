import { api } from '@pulse/common/api'
import { IndicatorSign, ValueKind } from '../enums/key-moments.enums'
import { IndicatorsService } from './indicators.service'

const SERVED = {
  version: '1.0.0',
  indicators: [
    { id: 'ca', label: 'Chiffre d\'affaires', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME },
    { id: 'marge', label: 'Marge', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME, isDeprecated: true },
  ],
}

describe('IndicatorsService', () => {
  it('should read the vocabulary out of the served document', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: SERVED })

    const indicators = await IndicatorsService.getIndicators()

    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/indicators')
    expect(indicators).toEqual(SERVED.indicators)
  })

  it('should create an indicator', async () => {
    vi.mocked(api.gateway.post).mockResolvedValueOnce({ data: undefined })
    const payload = { code: 'ca', label: 'CA', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME }

    await IndicatorsService.createIndicator(payload)

    expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith('keymoments/api/indicators', payload)
  })

  it('should update an indicator, its code staying out of the body', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })
    const payload = { label: 'CA', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME }

    await IndicatorsService.updateIndicator('ca', payload)

    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith('keymoments/api/indicators/ca', payload)
  })

  it('should deprecate and restore an indicator', async () => {
    vi.mocked(api.gateway.post).mockResolvedValue({ data: undefined })

    await IndicatorsService.deprecate('ca')
    await IndicatorsService.restore('ca')

    expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith('keymoments/api/indicators/ca/deprecate')
    expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith('keymoments/api/indicators/ca/restore')
  })

  it('should read the templates citing an indicator', async () => {
    const usages = [{ templateId: 1, code: 'engagement', label: 'Engagement', versions: ['1.0.0'] }]
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: usages })

    expect(await IndicatorsService.getUsages('ca')).toEqual(usages)
    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/indicators/ca/usages')
  })

  it('should write the whole composition of an aggregate', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: undefined })

    await IndicatorsService.setComponents('marge', ['ca', 'achats'])

    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
      'keymoments/api/indicators/marge/components',
      { components: [{ indicator: 'ca' }, { indicator: 'achats' }] },
    )
  })
})
