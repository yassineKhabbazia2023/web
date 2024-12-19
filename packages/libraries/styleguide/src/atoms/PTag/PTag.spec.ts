import { shallowMount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTag from '.'
import type { PTagProps } from './PTagTypes'
import type { IconName } from '../../types/IconName.types'

const createWrapper = (overridenProps: Partial<PTagProps> = {}) => {
  const props: PTagProps = {
    pColor: '',
    pContent: '',
    pEffect: 'plain',
    ...overridenProps,
  }

  return shallowMount(PTag, {
    props,
    global: {
      stubs: {
        ElTag: {
          name: 'ElTag',
          template: '<div class="el-tag"><slot /></div>',
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

describe('pTag', () => {
  describe('props', () => {
    const leftTests: {
      pIconLeftName?: IconName
      shouldHaveIconLeftClass: boolean
      text: string
    }[] = [{
      pIconLeftName: 'pulse',
      shouldHaveIconLeftClass: true,
      text: 'show',
    }, {
      pIconLeftName: undefined,
      shouldHaveIconLeftClass: false,
      text: 'hide',
    }]
    it.each(leftTests)(
      'should $text icon zone when pIconLeftName is $shouldHaveIconLeftClass',
      async ({ pIconLeftName, shouldHaveIconLeftClass }) => {
        const wrapper = createWrapper({
          pIconLeftName,
        })
        await flushPromises()

        const hasIconLeftClass = wrapper.find('.el-tag__icon--left').exists()

        expect(hasIconLeftClass).toBe(shouldHaveIconLeftClass)
      },
    )

    const rightTests: {
      pIconRightName?: IconName
      shouldHaveIconRightClass: boolean
      text: string
    }[] = [{
      pIconRightName: 'pulse',
      shouldHaveIconRightClass: true,
      text: 'show',
    }, {
      pIconRightName: undefined,
      shouldHaveIconRightClass: false,
      text: 'hide',
    }]
    it.each(rightTests)(
      'should $text icon zone when pIconRightName is $shouldHaveIconRightClass',
      async ({ pIconRightName, shouldHaveIconRightClass }) => {
        const wrapper = createWrapper({
          pIconRightName,
        })
        await flushPromises()
        const hasIconRightClass = wrapper.find('.el-tag__icon--right').exists()

        expect(hasIconRightClass).toBe(shouldHaveIconRightClass)
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
