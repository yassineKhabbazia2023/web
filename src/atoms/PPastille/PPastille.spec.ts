import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PPastille from './PPastille.vue'

type PPastilleProps = {
  kind: 'default' | 'warning';
  disabled?: boolean;
};

const createWrapper = (props: PPastilleProps) => mount(PPastille, {
  props
})
describe('pPastille', () => {
  describe('props', () => {
    it('should bind class when kind is warning', () => {
      const wrapper = createWrapper({
        kind: 'warning',
        disabled: false
      })
      expect(wrapper.classes()).toContain('p-pastille--warning')
    })
    it('should bind class when disabled is true', () => {
      const wrapper = createWrapper({
        kind: 'default',
        disabled: true
      })
      expect(wrapper.classes()).toContain('p-pastille--disabled')
    })
  })
})
