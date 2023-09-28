import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTag from '.'
import { ElTag } from 'element-plus'
import { PIPulse } from '@/atoms/PIcon/components'

const createWrapper = (props: any = {}) =>
  mount(PTag, {
    props,
    global: {
      components: {
        ElTag
      }
    }
  })

describe('pTag', () => {
  describe('props', () => {
    it.each([
      {
        iconLeft: PIPulse,
        shouldHaveIconLeftClass: true,
        text: 'show'
      },
      {
        iconLeft: '',
        shouldHaveIconLeftClass: false,
        text: 'hide'
      }
    ])('should $text icon zone when iconLeft is $shouldHaveIconLeftClass',
      ({ iconLeft, text, shouldHaveIconLeftClass }) => {
        const wrapper = createWrapper({
          iconLeft,
          text
        })
        const hasIconLeftClass = wrapper.find('.el-tag__icon--left').exists()
        const hasIconLeftComponent = wrapper.findComponent({ name: 'PIPulse' }).exists()
        expect(hasIconLeftClass).toBe(shouldHaveIconLeftClass)
        expect(hasIconLeftComponent).toBe(shouldHaveIconLeftClass)
      }
    )
    it.each([
      {
        iconRight: PIPulse,
        shouldHaveIconRightClass: true,
        text: 'show'
      },
      {
        iconRight: '',
        shouldHaveIconRightClass: false,
        text: 'hide'
      }
    ])('should $text icon zone when iconRight is $shouldHaveIconRightClass',
      ({ iconRight, text, shouldHaveIconRightClass }) => {
        const wrapper = createWrapper({
          iconRight,
          text
        })
        const hasIconRightClass = wrapper.find('.el-tag__icon--right').exists()
        const hasIconRightComponent = wrapper.findComponent({ name: 'PIPulse' }).exists()
        expect(hasIconRightClass).toBe(shouldHaveIconRightClass)
        expect(hasIconRightComponent).toBe(shouldHaveIconRightClass)
      }
    )

    it('should render the text values of the component', () => {
      const wrapper = createWrapper({
        content: 'Validated'
      })

      expect(wrapper.find('.el-tag').text())
        .toContain('Validated')
    })
  })
})
