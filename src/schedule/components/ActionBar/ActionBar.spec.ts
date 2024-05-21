import { describe, it, expect, vi } from 'vitest'
import { KpmgCommontMock } from '@/schedule/tests/mocks/commonViMock'
import { createTestingPinia } from '@pinia/testing'
import { commonStore as useCommonStore } from '@kpmg/common'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { ComponentMountingOptions } from '@vue/test-utils'
import ActionBar from '.'
import { PTabs, PTabPane } from '@kpmg/styleguide'
import ActionBarLeft from '@/schedule/components/ActionBarLeft'

const TEST_DATE = '2024-04-10'

const createWrapper = (options: ComponentMountingOptions<any>) =>
  wrapperFactory(ActionBar, options)

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => KpmgCommontMock)
const commonStore = useCommonStore(pinia)

describe('action bar', () => {
  describe('interactions', () => {
    it('should emit create-schedule when create deadline button is clicked', async () => {
      const wrapper = createWrapper({
        props: {
          activeDate: new Date(TEST_DATE),
          modelValue: 'list',
        },
      })

      await wrapper.find('[data-testid="create-schedule"]').trigger('click')

      expect(wrapper.emitted('create-schedule')).toHaveLength(1)
    })

    it('should emit update:modelValue on tab change', () => {
      const wrapper = createWrapper({
        props: {
          activeDate: new Date(TEST_DATE),
          modelValue: 'list',
        },
        global: {
          stubs: {
            PTabs,
            PTabPane,
          },
        },
      })
      const emitValue = 'calendar'
      wrapper.findComponent(PTabs).vm.$emit('update:modelValue', emitValue)

      const emittedEvent = wrapper.emitted('update:modelValue')
      expect(emittedEvent).toHaveLength(1)
      expect(emittedEvent).toBeDefined()
      expect(emittedEvent?.at(0)).toStrictEqual([emitValue])
    })

    it('should emit update:active-date', () => {
      const wrapper = createWrapper({
        props: {
          activeDate: new Date(TEST_DATE),
          modelValue: 'list',
        },
      })
      const newDate = new Date('2024-05-03')
      const actionBarLeft = wrapper.findComponent(ActionBarLeft)
      actionBarLeft.vm.$emit('update:active-date', newDate)
      expect(wrapper.emitted('update:active-date')).toStrictEqual([[newDate]])
    })
    it('should hide create schedule', () => {
      // @ts-expect-error: Getter is read only
      commonStore.isCollab = false
      const wrapper = createWrapper({
        props: {
          activeDate: new Date(TEST_DATE),
          modelValue: 'list',
        },
      })
      expect(wrapper.find('[data-testid="create-schedule"]').exists()).toBeFalsy()
    })
  })
})
