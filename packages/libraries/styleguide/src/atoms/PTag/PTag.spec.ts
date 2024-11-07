import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { PIPulse } from '@/atoms/PIcon/components'
import PTag from '.'
import type { PTagProps } from './PTagTypes'

const createWrapper = (overridenProps: Partial<PTagProps> = {}) => {
  const props: PTagProps = {
    pColor: '',
    pContent: '',
    pEffect: 'plain',
    ...overridenProps,
  }

  return mount(PTag, {
    props,
  })
}

describe('pTag', () => {
  describe('props', () => {
    it.each([
      {
        pIconLeft: PIPulse,
        shouldHaveIconLeftClass: true,
        text: 'show',
      },
      {
        pIconLeft: '',
        shouldHaveIconLeftClass: false,
        text: 'hide',
      },
    ])(
      'should $text icon zone when pIconLeft is $shouldHaveIconLeftClass',
      async ({ pIconLeft, shouldHaveIconLeftClass }) => {
        const wrapper = createWrapper({
          pIconLeft,
        })
        await flushPromises()

        const hasIconLeftClass = wrapper.find('.el-tag__icon--left').exists()
        const hasIconLeftComponent = wrapper
          .findComponent({ name: 'PIPulse' })
          .exists()

        expect(hasIconLeftClass).toBe(shouldHaveIconLeftClass)
        expect(hasIconLeftComponent).toBe(shouldHaveIconLeftClass)
      },
    )
    it.each([
      {
        pIconRight: PIPulse,
        shouldHaveIconRightClass: true,
        text: 'show',
      },
      {
        pIconRight: '',
        shouldHaveIconRightClass: false,
        text: 'hide',
      },
    ])(
      'should $text icon zone when pIconRight is $shouldHaveIconRightClass',
      async ({ pIconRight, shouldHaveIconRightClass }) => {
        const wrapper = createWrapper({
          pIconRight,
        })
        await flushPromises()
        const hasIconRightClass = wrapper.find('.el-tag__icon--right').exists()
        const hasIconRightComponent = wrapper
          .findComponent({ name: 'PIPulse' })
          .exists()

        expect(hasIconRightClass).toBe(shouldHaveIconRightClass)
        expect(hasIconRightComponent).toBe(shouldHaveIconRightClass)
      },
    )

    it('should render the text values of the component', () => {
      const wrapper = createWrapper({
        pContent: 'Validated',
      })

      expect(wrapper.find('.el-tag').text()).toContain('Validated')
    })
  })
})
