/* eslint-disable vitest/max-expects */
// eslint-disable-next-line vitest/max-expects
import { createPinia } from 'pinia'
import { ComponentPublicInstance, nextTick } from 'vue'
import { VueWrapper, mount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { PDrawer, PText, PSelect, POption, PDatePicker, PButton } from '@kpmg/styleguide'
import { DocumentSearchFiltrerProps } from './DocumentSearchFiltrerTypes'
import DocumentSearchFiltrer from '.'
import { DocumentSearchFilters } from '@/models/DocumentSearchFilters'

const defaultProps: DocumentSearchFiltrerProps = {
  modelValue: true,
  filters: null
}

type DocumentSearchFiltrerSetup = {
  selectedPeriod: string
  dateRange: [Date, Date ] | ''
}

export type DocumentSearchFiltrerWrapper = VueWrapper<
  ComponentPublicInstance<DocumentSearchFiltrerSetup, DocumentSearchFiltrerProps>
>

const pinia = createPinia()

const createWrapper = (
  props: DocumentSearchFiltrerProps = defaultProps
): DocumentSearchFiltrerWrapper => {
  return mount(DocumentSearchFiltrer, {
    props,
    global: {
      plugins: [pinia]
    }
  }) as unknown as DocumentSearchFiltrerWrapper
}

const date = new Date(1998, 11, 19)

describe('documentSearchFiltrer', () => {
  describe('props', () => {
    it('should render PDrawer properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pdrawer = wrapper.findComponent(PDrawer)
      expect(pdrawer.exists()).toBeTruthy()
      expect(pdrawer.props('pTitle')).toBe('Filtres')
    })

    it('should render PText properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pTexts = wrapper.findAllComponents(PText)
      expect(pTexts).toHaveLength(2)
      expect(pTexts[0].props('pContent')).toBe('Période')
      expect(pTexts[1].props('pContent')).toBe('Période personnalisée')
    })

    it('should render PSelect properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pSelect = wrapper.findComponent(PSelect)
      expect(pSelect.exists()).toBeTruthy()
      expect(pSelect.props('pPlaceholder')).toBe('Sélectionner une période')

      const pOptions = wrapper.findAllComponents(POption)
      expect(pOptions).toHaveLength(3)
    })

    it('should render PButton properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pBtns = wrapper.findAllComponents(PButton)
      expect(pBtns).toHaveLength(4)
      expect(pBtns[2].text()).toBe('Réinitialiser')
      expect(pBtns[3].text()).toBe('Appliquer')
    })

    it('should render PDatePicker properly binded', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()
      await nextTick()

      const pDatePicker = wrapper.findComponent(PDatePicker)
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

      const pDocumentViewerWrapper = wrapper.findComponent(PDrawer)
      await pDocumentViewerWrapper.vm.$emit('close-drawer-button')

      await nextTick()

      expect(wrapper.emitted('close-filters-drawer')).toBeTruthy()
    })

    it('should emit reset-filters-drawer event when reset Btn click event', async () => {
      expect.hasAssertions()
      const wrapper = createWrapper()
      await nextTick()

      const pButtons = wrapper.findAllComponents(PButton)
      await pButtons[2].trigger('click')
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

      const pButtons = wrapper.findAllComponents(PButton)
      await pButtons[3].trigger('click')
      await nextTick()

      const res:DocumentSearchFilters = {
        selectedPeriod: 'DAY',
        startDate: date,
        endDate: date
      }

      expect(wrapper.emitted('apply-filters-drawer')).toStrictEqual([[res]])
    })

    it('should set date range when PSelect change event', async () => {
      expect.hasAssertions()
      vi.useFakeTimers()
      vi.setSystemTime(date)
      const wrapper = createWrapper()
      await nextTick()

      const pSelect = wrapper.findComponent(PSelect)
      await pSelect.vm.$emit('change', 'DAY')
      await nextTick()
      expect(wrapper.vm.dateRange).toStrictEqual([date, date])
      await pSelect.vm.$emit('change', 'WEEK')
      await nextTick()
      expect(wrapper.vm.dateRange)
        .toStrictEqual([new Date(new Date().setDate(date.getDate() - 7)), date])
      await pSelect.vm.$emit('change', 'MONTH')
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

      const pDatePicker = wrapper.findComponent(PDatePicker)
      await pDatePicker.vm.$emit('calendar-change', [date, date])
      await nextTick()
      expect(wrapper.vm.selectedPeriod).toBe('')
    })
  })
})
