import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { OfferActivationStatusProps } from './OfferActivationStatusTypes'
import OfferActivationStatus from '.'

const createWrapper = (
  status: OfferActivationStatusProps['status'],
): VueWrapper<any> => {
  return mount(OfferActivationStatus, {
    props: {
      status,
    },
  })
}

describe('offerActivationStatus', () => {
  describe('display', () => {
    it.each([
      {
        status: 'validated',
        expectedValue: {
          text: 'Validated',
          color: 'success',
          icon: 'PICheckCircle',
        },
      },
      {
        status: 'rejected',
        expectedValue: { text: 'Rejected', color: 'danger', icon: 'PIXCircle' },
      },
      {
        status: 'pending',
        expectedValue: {
          text: 'Pending',
          color: 'warning',
          icon: 'PIInfoCircle',
        },
      },
    ])(
      'should display the correct tag for $status',
      ({ status, expectedValue }) => {
        const wrapper = createWrapper(
          status as OfferActivationStatusProps['status'],
        )

        expect(wrapper.vm.formattedStatus).toStrictEqual(expectedValue)
      },
    )
  })
})
