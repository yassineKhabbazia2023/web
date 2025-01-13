import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
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
  shallowMount(SubscriptionsFilter, {
    global: {
      stubs: {
        PDropdown: {
          name: 'PDropdown',
          template: '<div />',
          props: ['modelValue', 'pOptions'],
          emits: ['update:model-value'],
        },
      },
    },
    props: {
      offerTypeSelection: ['MEG Smart'],
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
      const filterOfferTypesDropdown = wrapper.findComponent({ name: 'PDropdown' })

      expect(filterOfferTypesDropdown.exists()).toBeTruthy()
      expect(filterOfferTypesDropdown.props('pOptions')).toHaveLength(offerTypes.length)
    })
  })
  describe('events', () => {
    it('should filter the subscription table to show all offer types by default', async () => {
      wrapper.vm.$emit('apply-offer-filter')
      await nextTick()

      expect(wrapper.emitted('update:offerTypeSelection')).toStrictEqual([
        [offerTypes],
      ])
      expect(wrapper.emitted('apply-offer-filter')).toBeTruthy()
    })
    it("should deselect all offer type filters when 'Deselect All Offers' is clicked", async () => {
      wrapper.vm.$emit('update:offerTypeSelection', [])
      await nextTick()

      expect(wrapper.emitted('update:offerTypeSelection')?.at(1)).toStrictEqual([[]])
    })
    it("should update the model value and emit 'apply-offer-filter' event to apply the filter", () => {
      const filterOfferTypesDropdown = wrapper.findComponent(
        '[data-testid=subscription-filter-offers-dropdown]',
      ) as VueWrapper<any>

      filterOfferTypesDropdown.vm.$emit('update:model-value', ['MEG Smart'])
      wrapper.vm.$emit('apply-offer-filter')

      expect(
        filterOfferTypesDropdown.emitted('update:model-value'),
      ).toStrictEqual([[['MEG Smart']]])
      expect(wrapper.emitted('apply-offer-filter')).toBeTruthy()
    })
  })
})
