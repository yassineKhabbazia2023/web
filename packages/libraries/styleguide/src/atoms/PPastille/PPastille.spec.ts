import { shallowMount } from '@vue/test-utils'
import PPastille from './PPastille.vue'
import type { PPastilleProps } from './PPastilleTypes'

type PPastillePropsTypes = PPastilleProps['pType']
const componenRootCSSClass = 'p-pastille'

const defaultProps: PPastilleProps = {
  pType: 'default',
  pSize: 'default',
  pDisabled: false,
}

const createWrapper = (props = defaultProps) => shallowMount(PPastille, {
  props,
  global: {
    stubs: {
      ElTag: {
        name: 'ElTag',
        template: '<div><slot /></div>',
      },
    },
  },
})
describe('pPastille', () => {
  describe('props', () => {
    it.each([
      {
        pType: 'default',
        expectedClassBinding: `${componenRootCSSClass}--type-default`,
      },
      {
        pType: 'warning',
        expectedClassBinding: `${componenRootCSSClass}--type-warning`,
      },
      {
        pType: 'error',
        expectedClassBinding: `${componenRootCSSClass}--type-error`,
      },
      {
        pType: 'dark-green',
        expectedClassBinding: `${componenRootCSSClass}--type-dark-green`,
      },
    ])(
      'should always bind class based on current type : $pType',
      ({ pType, expectedClassBinding }) => {
        const wrapper = createWrapper({
          pType: pType as PPastillePropsTypes,
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      },
    )
    it('should bind class when disabled is true', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pDisabled: true,
      })
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--disabled`)
    })
    it('should bind class when size is small', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pSize: 'small',
      })
      expect(wrapper.classes()).toContain(`${componenRootCSSClass}--size-small`)
    })
  })
})
