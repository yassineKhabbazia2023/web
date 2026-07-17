import { flushPromises, shallowMount } from '@vue/test-utils'
import { ProviderName } from '@entities/enums'
import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'
import { cleanRecordStructure, getFormStructure } from '@entities/utils/referential'
import { fetchAccount } from '@entities/services/account'
import InformationDetails from './InformationDetails.vue'
import type { SubscriptionOfferServices } from '@entities/types'

const getFormStructureMock = vi.mocked(getFormStructure)
const cleanRecordStructureMock = vi.mocked(cleanRecordStructure)
const fetchAccountMock = vi.mocked(fetchAccount)

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
      PDynamicFields: true,
      PLoader: true,
    },
  },
})

describe('InformationDetails', () => {
  beforeEach(() => {
    getFormStructureMock.mockResolvedValue([])
    cleanRecordStructureMock.mockImplementation(() => undefined)
    fetchAccountMock.mockResolvedValue({} as unknown as Awaited<ReturnType<typeof fetchAccount>>)
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
