
import { createPinia } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import type { DocumentSearchFilterProps } from './DocumentSearchFilterTypes'
import DocumentSearchFilter from '.'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'

const defaultProps: DocumentSearchFilterProps = {
  modelValue: true,
  filters: null,
}

type DocumentSearchFilterSetup = {
  selectedPeriod: string
  dateRange: [Date, Date ] | ''
}

export type DocumentSearchFilterWrapper = VueWrapper<
  ComponentPublicInstance<DocumentSearchFilterSetup, DocumentSearchFilterProps>
>

const pinia = createPinia()

const createWrapper = (
  props: DocumentSearchFilterProps = defaultProps,
): DocumentSearchFilterWrapper => {
  return mount(DocumentSearchFilter, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as DocumentSearchFilterWrapper
}

const date = new Date(1998, 11, 19)

describe('documentSearchFiltrer', () => {
  describe('props', () => {
    it('should render PDrawer properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pdrawer = wrapper.findComponent({ name: 'PDrawer' })
      expect(pdrawer.exists()).toBeTruthy()
      expect(pdrawer.props('pTitle')).toBe('Filtres')
    })

    it('should render PText properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pTexts = wrapper.findAll('.doc-search-filter-label')
      expect(pTexts).toHaveLength(2)
      expect(pTexts[0].text()).toBe('Période')
      expect(pTexts[1].text()).toBe('Période personnalisée')
    })

    it('should render PDropdown properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const PDropdown = wrapper.findComponent({ name: 'PDropdown' })
      expect(PDropdown.exists()).toBeTruthy()
      expect(PDropdown.props('pPlaceholder')).toBe('Sélectionner une période')

      const pOptions = wrapper.findAllComponents({ name: 'ElOption' })
      expect(pOptions).toHaveLength(3)
    })

    it('should render PButton properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pBtns = wrapper.findAllComponents({ name: 'PButton' })
      expect(pBtns).toHaveLength(3)
      expect(pBtns[1].text()).toBe('Réinitialiser')
      expect(pBtns[2].text()).toBe('Appliquer')
    })

    it('should render PDatePicker properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()
      await nextTick()

      const pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
      expect(pDatePicker.exists()).toBeTruthy()
      const range = wrapper.findAll('.el-range-input')
      expect(range[0].attributes('placeholder')).toBe('Date de début')
      expect(range[1].attributes('placeholder')).toBe('Date de fin')
      const rangeSeparator = wrapper.find('.el-range-separator')
      expect(rangeSeparator.text()).toBe('À')
      expect(wrapper.vm.dateRange).toBe('')
    })
  })

  describe('interactions', () => {
    it('should emit close-filters-drawer event when PDrawer close event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pDocumentViewerWrapper = wrapper.findComponent({ name: 'PDrawer' })
      await pDocumentViewerWrapper.vm.$emit('close-drawer-button')

      await nextTick()

      expect(wrapper.emitted('close-filters-drawer')).toBeTruthy()
    })

    it('should emit reset-filters-drawer event when reset Btn click event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pButtons = wrapper.findAllComponents({ name: 'PButton' })
      await pButtons[1].trigger('click')
      await nextTick()

      expect(wrapper.emitted('reset-filters-drawer')).toBeTruthy()
    })

    it('should emit apply-filters-drawer event when confirm Btn click event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.selectedPeriod = 'DAY'
      componentInstance.dateRange = [date, date]
      await nextTick()

      const pButtons = wrapper.findAllComponents({ name: 'PButton' })
      await pButtons[2].trigger('click')
      await nextTick()

      const res:DocumentSearchFilters = {
        selectedPeriod: 'DAY',
        startDate: date,
        endDate: date,
      }

      expect(wrapper.emitted('apply-filters-drawer')).toStrictEqual([[res]])
    })

    it('should set date range when PDropdown change event', async () => {
      expect.hasAssertions()
      vi.useFakeTimers()
      vi.setSystemTime(date)
      const wrapper = createWrapper()
      await nextTick()

      const PDropdown = wrapper.findComponent({ name: 'PDropdown' })
      await PDropdown.vm.$emit('change', 'DAY')
      await nextTick()
      expect(wrapper.vm.dateRange).toStrictEqual([date, date])
      await PDropdown.vm.$emit('change', 'WEEK')
      await nextTick()
      expect(wrapper.vm.dateRange)
        .toStrictEqual([new Date(new Date().setDate(date.getDate() - 7)), date])
      await PDropdown.vm.$emit('change', 'MONTH')
      await nextTick()
      expect(wrapper.vm.dateRange)
        .toStrictEqual([new Date(new Date().setDate(date.getDate() - 30)), date])
      vi.useRealTimers()
    })

    it('should reset selectedPeriod when PDatePicker calendar-change event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.selectedPeriod = 'WEEK'
      await nextTick()

      const pDatePicker = wrapper.findComponent({ name: 'PDatePicker' })
      await pDatePicker.vm.$emit('calendar-change', [date, date])
      await nextTick()
      expect(wrapper.vm.selectedPeriod).toBe('')
    })
  })
})
