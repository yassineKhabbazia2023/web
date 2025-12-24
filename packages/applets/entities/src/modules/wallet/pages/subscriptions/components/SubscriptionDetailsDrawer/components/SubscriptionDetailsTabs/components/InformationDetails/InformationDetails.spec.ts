import { flushPromises, shallowMount } from '@vue/test-utils'
import { ProviderName } from '@entities/enums'
import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'
import InformationDetails from './InformationDetails.vue'
import type { SubscriptionOfferServices } from '@entities/types'

const getFormStructureMock = vi.hoisted(() => vi.fn())
const cleanRecordStructureMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/utils/referential', () => ({
  getFormStructure: getFormStructureMock,
  cleanRecordStructure: cleanRecordStructureMock,
}))

const fetchAccountMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/account', () => ({
  fetchAccount: fetchAccountMock,
}))

const subscriptionOfferDetails = {
  providers: [
    { providerName: ProviderName.RYDGE },
    { providerName: ProviderName.PENNYLANE },
  ],
} as unknown as SubscriptionOfferServices

const getWrapper = (pageContext?: SubscriptionDetailsContext) => shallowMount(InformationDetails, {
  props: {
    subscriptionOfferDetails,
    accountId: 1,
    pageContext,
  },
  global: {
    stubs: {
      PAlert: true,
      PForm: {
        template: '<form><slot /></form>',
      },
      PFieldSet: true,
      PLoader: true,
    },
  },
})

describe('InformationDetails', () => {
  beforeEach(() => {
    getFormStructureMock.mockReset()
    cleanRecordStructureMock.mockReset()
    fetchAccountMock.mockReset()

    getFormStructureMock.mockResolvedValue([])
    fetchAccountMock.mockResolvedValue({})
  })

  describe('provider form selection', () => {
    const tests = [{
      pageContext: undefined,
      expectedProviderName: ProviderName.PENNYLANE,
    }, {
      pageContext: SubscriptionDetailsContext.MOD_APPROVALS,
      expectedProviderName: ProviderName.PENNYLANE_MOD,
    }]

    it.each(tests)(
      'should load form structure with $expectedProviderName when pageContext is $pageContext',
      async ({ pageContext, expectedProviderName }) => {
        const wrapper = getWrapper(pageContext)

        await flushPromises()

        expect(wrapper.exists()).toBeTruthy()
        expect(getFormStructureMock).toHaveBeenCalledExactlyOnceWith(expectedProviderName, true)
      },
    )
  })
})
