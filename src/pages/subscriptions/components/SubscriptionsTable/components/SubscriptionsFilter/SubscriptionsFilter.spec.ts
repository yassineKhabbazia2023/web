import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import SubscriptionsFilter from '.'
import { nextTick } from 'vue'

const offerTypes = [
  'MEG Smart',
  'MEG Premium',
  'Loop collaboratif',
  'Forms',
  'Pennylane',
]

const createWrapper = (): VueWrapper =>
  mount(SubscriptionsFilter, {
    global: {
      stubs: {
        PSelect: {
          template: '<div><slot /></div>',
          props: ['modelValue'],
          emits: ['update:model-value'],
        },
        PCheckbox: {
          template: '<div><slot /></div>',
          props: ['modelValue'],
          emits: ['update:model-value'],
        },
        POption: {
          template: '<div></div>',
        },
      },
    },
  })

describe('subscriptionsFilter', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await nextTick()
  })
  describe('display', () => {
    it('should correctly display the subscription table filtered by offer type', () => {
      const filterOfferTypesDropdown = wrapper.find(
        '[data-testid=subscription-filter-offers-dropdown]',
      )
      const filterOfferTypesOptions = wrapper.findAllComponents(
        '[data-testid=subscription-offer-option]',
      )

      expect(filterOfferTypesDropdown.exists()).toBeTruthy()
      expect(filterOfferTypesOptions).toHaveLength(offerTypes.length)
    })
  })
  describe('events', () => {
    it('should filter the subscription table to show all offer types by default', () => {
      expect(wrapper.emitted('apply-offer-filter')).toStrictEqual([
        [offerTypes],
      ])
    })
    it("should deselect all offer type filters when 'Deselect All Offers' is clicked", () => {
      wrapper.vm.handleSelectAllOfferTypes(false)

      expect(wrapper.emitted('apply-offer-filter')?.at(1)).toStrictEqual([[]])
    })
    it("should update the model value and emit 'apply-offer-filter' event to apply the filter", () => {
      const filterOfferTypesDropdown = wrapper.findComponent(
        '[data-testid=subscription-filter-offers-dropdown]',
      ) as VueWrapper<any>

      filterOfferTypesDropdown.vm.$emit('update:model-value', ['MEG Smart'])
      wrapper.vm.handleOfferTypeFilter()

      expect(
        filterOfferTypesDropdown.emitted('update:model-value'),
      ).toStrictEqual([[['MEG Smart']]])
      expect(wrapper.emitted('apply-offer-filter')?.at(1)).toStrictEqual([
        ['MEG Smart'],
      ])
    })
  })
})
