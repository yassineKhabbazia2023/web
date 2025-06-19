import { describe, expect, it } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import type { OfferActivationStatusProps } from './OfferActivationStatusTypes'
import OfferActivationStatus from '.'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import type { UserInfo } from '@pulse/common/types'

const currentUser: UserInfo = { ...getMockedUser(), isCollab: false }
const currentCollab: UserInfo = { ...getMockedUser() }

const createWrapper = (
  status: OfferActivationStatusProps['status'],
  currentUser: UserInfo,
): VueWrapper<any> => {
  return shallowMount(OfferActivationStatus, {
    props: {
      status,
      currentUser,
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
      {
        status: 'pending-migration',
        currentUser: currentUser,
        expectedValue: {
          pContent: 'In the process of activation',
          pColor: 'warning',
          pIconLeftName: 'infoCircle',
        },
      },
      {
        status: 'pending-migration',
        currentUser: currentCollab,
        expectedValue: {
          pContent: 'In the process of validation',
          pColor: 'warning',
          pIconLeftName: 'infoCircle',
        },
      },
      {
        status: 'failed-migration',
        expectedValue: {
          pContent: 'Failed migration',
          pColor: 'danger',
          pIconLeftName: 'exclamationTriangle',
        },
      },
    ])(
      'should display the correct tag for $status',
      ({ status, currentUser, expectedValue }) => {
        const wrapper = createWrapper(
          status as OfferActivationStatusProps['status'],
          currentUser as UserInfo,
        )

        const pTag = wrapper.findComponent({ name: 'PTag' })
        expect(pTag.props()).toStrictEqual(expectedValue)
      },
    )
  })
})
