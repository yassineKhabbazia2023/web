import { shallowMount } from '@vue/test-utils'
import type { DocumentSearchFilterProps } from './DocumentSearchFilterTypes'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'
import { Period } from '@ged/models/DocumentSearchFilters'

import DocumentSearchFilter from '.'

const defaultProps: DocumentSearchFilterProps = {
  modelValue: true,
  filters: null,
}

const createWrapper = (
  props: DocumentSearchFilterProps = defaultProps,
) => {
  return shallowMount(DocumentSearchFilter, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /><slot name="footer" /></div>',
          events: ['close-drawer-button'],
          props: ['pTitle'],
        },
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
          events: ['click'],
        },
        PDatePicker: {
          name: 'PDatePicker',
          template: '<div />',
          props: [
            'modelValue',
            'rangeSeparator',
            'startPlaceholder',
            'endPlaceholder',
          ],
          events: ['calendar-change'],
        },
      },
    },
  })
}

const date = new Date(1998, 11, 19)

describe('documentSearchFiltrer', () => {
  describe('props', () => {
    it('should render properly', async () => {
      const wrapper = createWrapper()

      expect(wrapper.html()).toMatchFileSnapshot('__snap__/DocumentSearchFiltrer.html')
    })

    it('should render PDatePicker properly binded', async () => {
      const wrapper = createWrapper()
      const pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })

      expect(pDatePicker.exists()).toBeTruthy()
      expect(pDatePicker.props('startPlaceholder')).toBe('Date de début')
      expect(pDatePicker.props('endPlaceholder')).toBe('Date de fin')
      expect(pDatePicker.props('rangeSeparator')).toBe('À')
      expect(pDatePicker.props('modelValue')).toBe('')
    })
  })

  describe('interactions', () => {
    it('should emit close-filters-drawer event when PDrawer close event', async () => {
      const wrapper = createWrapper()

      const pDocumentViewerWrapper = wrapper.findComponent({ name: 'PDrawer' })
      await pDocumentViewerWrapper.vm.$emit('close-drawer-button')

      expect(wrapper.emitted('close-filters-drawer')).toBeTruthy()
    })

    it('should emit reset-filters-drawer event when reset Btn click event', async () => {
      const wrapper = createWrapper()

      const pButtons = wrapper.findAllComponents({ name: 'PButton' })
      await pButtons[0].trigger('click')

      expect(wrapper.emitted('reset-filters-drawer')).toBeTruthy()
    })

    it('should emit apply-filters-drawer event when confirm Btn click event', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(date)

      const wrapper = createWrapper()
      const pDropdown = wrapper.findComponent({ name: 'PDropdown' })

      const newPeriod = Period.DAY
      pDropdown.vm.$emit('update:modelValue', newPeriod)
      pDropdown.vm.$emit('change', newPeriod)

      const pButtons = wrapper.findAllComponents({ name: 'PButton' })
      await pButtons[1].trigger('click')

      const expectedFilters: DocumentSearchFilters = {
        selectedPeriod: newPeriod,
        startDate: date,
        endDate: date,
      }

      expect(wrapper.emitted('apply-filters-drawer')).toStrictEqual([[expectedFilters]])
    })

    it('should set date range when PDropdown change event', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(date)

      const wrapper = createWrapper()

      const pDropdown = wrapper.findComponent({ name: 'PDropdown' })
      const pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
      await pDropdown.vm.$emit('change', Period.DAY)

      expect(pDatePicker.props('modelValue')).toStrictEqual([date, date])
      await pDropdown.vm.$emit('change', Period.WEEK)

      const expectedDate1 = [new Date(new Date().setDate(date.getDate() - 7)), date]
      expect(pDatePicker.props('modelValue')).toStrictEqual(expectedDate1)

      await pDropdown.vm.$emit('change', Period.MONTH)
      const expectedDate2 = [new Date(new Date().setDate(date.getDate() - 30)), date]
      expect(pDatePicker.props('modelValue')).toStrictEqual(expectedDate2)

      vi.useRealTimers()
    })

    it('should reset selectedPeriod when PDatePicker calendar-change event', async () => {
      const wrapper = createWrapper()
      const pDropdown = wrapper.findComponent({ name: 'PDropdown' })

      pDropdown.vm.$emit('update:modelValue', Period.WEEK)

      const pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
      await pDatePicker.vm.$emit('calendar-change', [date, date])

      expect(pDropdown.props('modelValue')).toBe('')
    })
  })
})
