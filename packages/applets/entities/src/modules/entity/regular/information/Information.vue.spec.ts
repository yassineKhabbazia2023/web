import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import { useUserStore } from '@pulse/common/stores'
import InformationFormStructure from '@entities/config/forms/InformationFormStructure.json'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { RouteParam } from '@pulse/common/enums'

import Information from './Information.vue'

const userStoreMock = getStoreMock(useUserStore)

// Mocks
const getFormStructureMock = vi.hoisted(() => vi.fn(() => InformationFormStructure))
const cleanRecordStructureMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/utils/referential', () => ({
  getFormStructure: getFormStructureMock,
  cleanRecordStructure: cleanRecordStructureMock,
}))

const mockedGetCanEdit = vi.hoisted(() => vi.fn(() => true))
const savePatchedAccountMock = vi.hoisted(() => vi.fn())
vi.mock('./InformationHelper', () => ({
  getCanEdit: mockedGetCanEdit,
  savePatchedAccount: savePatchedAccountMock,
}))

const accountMock = getMockedAccount()
const fetchAccountMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/account', () => ({
  fetchAccount: fetchAccountMock,
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

const ACCOUNT_ID = 5

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: ACCOUNT_ID,
    },
  }),
}))

vi.mock('@entities/utils/helpers')

const getWrapper = () => shallowMount(Information, {
  global: {
    stubs: {
      PForm: {
        template: '<div><slot /></div>',
      },
      PAlert: {
        template: '<div><slot /></div>',
      },
      PDynamicFields: true,
      PButton: {
        template: '<div><slot /></div>',
      },
    },
  },
})

// Unit Tests
describe('information', () => {
  let wrapper: ReturnType<typeof getWrapper>
  beforeEach(() => {
    fetchAccountMock.mockResolvedValue(accountMock)
    cleanRecordStructureMock.mockResolvedValue(accountMock)
  })

  describe('display', () => {
    beforeEach(() => {
      wrapper = getWrapper()
    })
    it('should not display the alert if the user is a client', async () => {
      userStoreMock.isCollab = false
      await nextTick()
      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )

      expect(alertInstruction.exists()).toBeFalsy()
    })
  })

  describe('test onMounted', () => {
    const tests = [{
      isCollab: false,
      mockedCanEdit: true,
      expectedHasInformationSaveButton: true,
    }, {
      isCollab: true,
      mockedCanEdit: true,
      expectedHasInformationSaveButton: true,
    }, {
      isCollab: true,
      mockedCanEdit: false,
      expectedHasInformationSaveButton: false,
    }]
    it.each(tests)(
      'should call with proper argument when isCollab equals $isCollab and canEdit is $mockedCanEdit', async ({
        isCollab,
        mockedCanEdit,
        expectedHasInformationSaveButton,
      }) => {
        const expectedForceDisabled = !mockedCanEdit
        userStoreMock.isCollab = isCollab

        mockedGetCanEdit.mockReturnValue(mockedCanEdit)

        const wrapper = getWrapper()

        await flushPromises()

        const informationSaveButton = wrapper.find('[data-testid="information-save-button"]')

        expect(mockedGetCanEdit).toHaveBeenCalledExactlyOnceWith(isCollab)

        expect(getFormStructureMock).toHaveBeenCalledExactlyOnceWith('CompanyProfile', expectedForceDisabled)

        expect(cleanRecordStructureMock).toHaveBeenCalledExactlyOnceWith(InformationFormStructure, accountMock)

        expect(informationSaveButton.exists()).toBe(expectedHasInformationSaveButton)
      })
  })
})
