import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { Indicator, Indicators } from '../types/key-moments.types'
import type {
  IndicatorRequest,
  IndicatorUpdateRequest,
  IndicatorUsageItem,
} from './indicators.service.types'

const INDICATORS = `${API_PREFIXES.KEY_MOMENTS}/indicators`

/** The vocabulary as the editor writes it: one document, edited term by term. */
export class IndicatorsService {

  /** The deprecated terms included: the editor is where they are seen again. */
  static async getIndicators(): Promise<Indicator[]> {
    const { data } = await api.gateway.get<Indicators>(INDICATORS)

    return data.indicators
  }

  static async createIndicator(payload: IndicatorRequest): Promise<void> {
    await api.gateway.post(INDICATORS, payload)
  }

  static async updateIndicator(code: string, payload: IndicatorUpdateRequest): Promise<void> {
    await api.gateway.put(`${INDICATORS}/${code}`, payload)
  }

  static async deprecate(code: string): Promise<void> {
    await api.gateway.post(`${INDICATORS}/${code}/deprecate`)
  }

  static async restore(code: string): Promise<void> {
    await api.gateway.post(`${INDICATORS}/${code}/restore`)
  }

  static async getUsages(code: string): Promise<IndicatorUsageItem[]> {
    const { data } = await api.gateway.get<IndicatorUsageItem[]>(`${INDICATORS}/${code}/usages`)

    return data
  }

  /**
   * The whole composition every time rather than one term: what an aggregate
   * combines is read back as a whole, and a replayed call says the same thing.
   */
  static async setComponents(code: string, components: string[]): Promise<void> {
    await api.gateway.put(
      `${INDICATORS}/${code}/components`,
      { components: components.map(indicator => ({ indicator })) },
    )
  }
}
