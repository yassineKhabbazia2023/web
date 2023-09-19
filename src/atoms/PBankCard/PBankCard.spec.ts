import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PBankCard from '.'

const defaultProps = {
  startTitle: 'Aller à la',
  title: 'Synthèse des comptes',
  accountNumber: 4,
  accountText: 'comptes actifs',
  amount: '248 660,00 €'
}

const createWrapper = (props: any = defaultProps) =>
  mount(PBankCard, {
    props
  })

describe('pBankCard', () => {
  describe('props', () => {
    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-bankcard__title').text())
        .toContain('Synthèse des comptes')
      expect(wrapper.find('.p-bankcard__accounts').text())
        .toContain('4 comptes actifs')
      expect(wrapper.find('.p-bankcard__amount').text())
        .toContain('248 660,00 €')
    })

    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-bankcard').attributes('title'))
        .toBe('Aller à la Synthèse des comptes - 4 comptes actifs')
    })
  })
})
