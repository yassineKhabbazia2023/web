import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiMonitoringStats from './ai-monitoring-stats.vue'
import type { AiMonitoringSummary } from '@backoffice/types/ai-monitoring.type'

const mockSummary: AiMonitoringSummary = {
  total_calls: 251,
  total_cost: 0.99,
  average_time: 2.21,
  satisfaction_rate: 75,
}

describe('AiMonitoringStats', () => {
  it('should render 4 stat cards', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: mockSummary,
        isLoading: false,
      },
    })

    const statCards = wrapper.findAllComponents({ name: 'PStatCard' })
    expect(statCards.length).toBe(4)
  })

  it('should display formatted values when summary is provided', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: mockSummary,
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('251')
    expect(wrapper.text()).toContain('€')
    expect(wrapper.text()).toContain('s')
    expect(wrapper.text()).toContain('75%')
  })

  it('should display dash when summary is null', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: null,
        isLoading: false,
      },
    })

    const statCards = wrapper.findAllComponents({ name: 'PStatCard' })
    statCards.forEach(card => {
      expect(card.props('pValue')).toBe('-')
    })
  })

  it('should display correct titles', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: mockSummary,
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Utilisation')
    expect(wrapper.text()).toContain('Coût total')
    expect(wrapper.text()).toContain('Temps moyen')
    expect(wrapper.text()).toContain('Satisfaction')
  })

  it('should display correct descriptions', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: mockSummary,
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Nombre total d\'appels')
    expect(wrapper.text()).toContain('sur la sélection actuelle')
    expect(wrapper.text()).toContain('Latence moyenne de réponse')
    expect(wrapper.text()).toContain('Taux d\'avis positif')
  })

  it('should have correct icons on stat cards', () => {
    const wrapper = mount(AiMonitoringStats, {
      props: {
        summary: mockSummary,
        isLoading: false,
      },
    })

    const statCards = wrapper.findAllComponents({ name: 'PStatCard' })
    expect(statCards[0].props('pIcon')).toBe('barChart')
    expect(statCards[1].props('pIcon')).toBe('currencyEuro')
    expect(statCards[2].props('pIcon')).toBe('clock')
    expect(statCards[3].props('pIcon')).toBe('thumbsUp')
  })
})
