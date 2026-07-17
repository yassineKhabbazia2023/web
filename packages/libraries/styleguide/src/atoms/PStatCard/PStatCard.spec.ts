import { mount } from '@vue/test-utils'
import PStatCard from './PStatCard.vue'

describe('PStatCard', () => {
  it('renders title and value correctly', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Utilisation',
        pValue: '10',
      },
    })

    expect(wrapper.text()).toContain('Utilisation')
    expect(wrapper.text()).toContain('10')
  })

  it('renders description when provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
        pDescription: 'Test description',
      },
    })

    expect(wrapper.text()).toContain('Test description')
  })

  it('does not render description when not provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
      },
    })

    expect(wrapper.findAll('.font-size--18').length).toBe(0)
  })

  it('renders icon when provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
        pIcon: 'clock',
      },
    })

    expect(wrapper.findComponent({ name: 'PIcon' }).exists()).toBe(true)
  })

  it('does not render icon when not provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
      },
    })

    expect(wrapper.findComponent({ name: 'PIcon' }).exists()).toBe(false)
  })

  it('applies default background class', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
      },
    })

    expect(wrapper.classes()).toContain('bg--surface-information-primary')
  })

  it('applies default accent class to title', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
      },
    })

    const title = wrapper.find('.text-uppercase')
    expect(title.classes()).toContain('text-color--text-information-primary')
  })

  it('applies custom background class when provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
        pBackgroundClass: 'bg--surface-success',
      },
    })

    expect(wrapper.classes()).toContain('bg--surface-success')
    expect(wrapper.classes()).not.toContain('bg--surface-information-primary')
  })

  it('applies custom accent class when provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
        pAccentClass: 'text-color--text-success',
      },
    })

    const title = wrapper.find('.text-uppercase')
    expect(title.classes()).toContain('text-color--text-success')
  })

  it('applies custom accent class to icon when provided', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Test',
        pValue: '100',
        pIcon: 'checkCircle',
        pAccentClass: 'text-color--text-success',
      },
    })

    const icon = wrapper.findComponent({ name: 'PIcon' })
    expect(icon.classes()).toContain('text-color--text-success')
  })

  it('renders with currency value', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Coût total',
        pValue: '0.99 €',
        pDescription: 'sur la sélection actuelle',
        pIcon: 'currencyEuro',
      },
    })

    expect(wrapper.text()).toContain('0.99 €')
  })

  it('renders with percentage value', () => {
    const wrapper = mount(PStatCard, {
      props: {
        pTitle: 'Satisfaction',
        pValue: '75%',
        pDescription: 'Taux d\'avis positif',
        pIcon: 'thumbsUp',
      },
    })

    expect(wrapper.text()).toContain('75%')
  })
})
