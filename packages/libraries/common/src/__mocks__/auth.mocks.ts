import type { UserInfoApi, UserContextInfo } from '../types/user.type'
import type { BookingServiceExpert } from '@pulse/common/types'
import { CustomerPermission } from '../enums/permission.enum'
import { tokenMock } from './token.mocks'
import { getMockedUserApi, getMockedUserContext } from './user.mocks'
import { getBookingServiceExpert } from './booking.mocks'
import { getPaginationMock } from './pagination.mocks'
import { MockEntityId, MockEntityData } from './entities.mocks'

export interface LoginResponse {
  userId: string
  webToken: string
}

export function getLoginResponseMock(override: Partial<LoginResponse> = {}): LoginResponse {
  return {
    userId: 'test-user-123',
    webToken: tokenMock,
    ...override,
  }
}

export function getCurrentUserResponseMock(override: Partial<UserInfoApi> = {}): UserInfoApi {
  return getMockedUserApi({
    isCustomer: true,
    oldId: undefined,
    ...override,
  })
}

export function getUserContextResponseMock(override: Partial<UserContextInfo> = {}): UserContextInfo {
  return getMockedUserContext({
    contact: {
      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isCollab: false,
      gigyaUserId: '',
      occupation: '',
      officeMobile: '',
      oldId: '',
      entities: { default: undefined },
    },
    permissions: [
      CustomerPermission.ACCEDER_GED_COMPTABLE,
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
      CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
    ],
    favoriteEntities: [
      {
        accountId: MockEntityId.BASIC,
        accountNumber: MockEntityData.BASIC.accountNumber,
        legalName: MockEntityData.BASIC.legalName,
      },
      {
        accountId: MockEntityId.LEGACY_GED,
        accountNumber: MockEntityData.LEGACY_GED.accountNumber,
        legalName: MockEntityData.LEGACY_GED.legalName,
      },
      {
        accountId: MockEntityId.PENNYLANE,
        accountNumber: MockEntityData.PENNYLANE.accountNumber,
        legalName: MockEntityData.PENNYLANE.legalName,
      },
    ],
    ...override,
  })
}

export function getBookingExpertsResponseMock(experts: BookingServiceExpert[] = [
  getBookingServiceExpert({ contactId: 1, fullName: 'Expert One', email: 'expert1@test.com', link: 'https://booking.test/1' }),
  getBookingServiceExpert({ contactId: 2, fullName: 'Expert Two', email: 'expert2@test.com', link: 'https://booking.test/2' }),
]) {
  return getPaginationMock({
    items: experts,
    currentPage: 1,
    totalPages: 1,
    totalItems: experts.length,
  })
}
