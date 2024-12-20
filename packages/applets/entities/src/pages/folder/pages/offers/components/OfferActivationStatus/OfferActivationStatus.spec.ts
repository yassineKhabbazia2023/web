import { describe, expect, it } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import type { OfferActivationStatusProps } from './OfferActivationStatusTypes'
import OfferActivationStatus from '.'

const createWrapper = (
  status: OfferActivationStatusProps['status'],
): VueWrapper<any> => {
  return shallowMount(OfferActivationStatus, {
    props: {
      status,
    },
    global: {
      stubs: {
        PTag: {
          name: 'PTag',
          template: '<div />',
          props: ['pColor', 'pIconLeftName', 'pContent'],
        },
      },
    },
  })
}

describe('offerActivationStatus', () => {
  describe('display', () => {
    it.each([
      {
        status: 'validated',
        expectedValue: {
          pContent: 'Validated',
          pColor: 'success',
          pIconLeftName: 'checkCircle',
        },
      },
      {
        status: 'rejected',
        expectedValue: {
          pContent: 'Rejected',
          pColor: 'danger',
          pIconLeftName: 'xCircle',
        },
      },
      {
        status: 'pending',
        expectedValue: {
          pContent: 'Pending',
          pColor: 'warning',
          pIconLeftName: 'infoCircle',
        },
      },
    ])(
      'should display the correct tag for $status',
      ({ status, expectedValue }) => {
        const wrapper = createWrapper(
          status as OfferActivationStatusProps['status'],
        )

        const pTag = wrapper.findComponent({ name: 'PTag' })
        expect(pTag.props()).toStrictEqual(expectedValue)
      },
    )
  })
})
