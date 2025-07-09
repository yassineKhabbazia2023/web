import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { loggerMock } from '@pulse/core/mocks'
import { getMockReportStatistics } from '@entities/__mocks__/bi-report.mocks'

import ReportStatusFilter from './ReportStatusFilter.vue'

const reportStatisticsMock = getMockReportStatistics()
const fetchReportStatisticsMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@entities/services/reporting', () => ({
  fetchReportStatistics: fetchReportStatisticsMock,
}))

const createWrapper = (props: any = {}) =>
  shallowMount(ReportStatusFilter, {
    props: {
      reportFilters: {},
      ...props,
    },
    global: {
      stubs: {
        PFilterGroup: {
          name: 'PFilterGroup',
          template: '<div></div>',
          props: ['modelValue', 'pFilters'],
          emits: ['toggle'],
        },
      },
    },
  })

describe('ReportStatusFilter.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(async () => {
    fetchReportStatisticsMock.mockResolvedValue(reportStatisticsMock)
    wrapper = createWrapper()
    await flushPromises()
  })

  it('should fetch report statistics on mount', async () => {
    expect(fetchReportStatisticsMock).toHaveBeenCalledOnce()
  })

  it('should render status filters correctly on mount', async () => {
    const filterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
    expect(filterGroup.exists()).toBe(true)
    expect(filterGroup.props('pFilters')).toHaveLength(3)

    const failedFilter = filterGroup.props('pFilters').find((f: any) => f.pCode === ReportStatus.FAILED)

    expect(failedFilter).toMatchObject({
      pContent: 'Failure',
      pValue: reportStatisticsMock.failed,
      pColor: 'danger',
      pIconName: 'exclamationTriangle',
    })
  })

  it.each([{ status: ReportStatus.FAILED }, { status: ReportStatus.OFFLINE }, { status: ReportStatus.ONLINE }])(
    'should emit apply-status-filter when selecting "$status"',
    async ({ status }) => {
      const filterGroup = wrapper.findComponent({ name: 'PFilterGroup' })

      // Simulation d’un clic sur le filtre
      filterGroup.vm.$emit('toggle', status, true)
      await nextTick()

      expect(wrapper.emitted('apply-status-filter')).toBeTruthy()
      expect(wrapper.emitted('apply-status-filter')![0]).toEqual([status])
    },
  )

  it('should emit reset-status-filter when deselecting a filter', async () => {
    wrapper = createWrapper({
      reportFilters: {
        reportStatusFilter: [ReportStatus.FAILED],
      },
    })
    await flushPromises()

    const filterGroup = wrapper.findComponent({ name: 'PFilterGroup' })

    // Simule un toggle off sur le filtre FAILED
    filterGroup.vm.$emit('toggle', ReportStatus.FAILED, false)
    await nextTick()

    expect(wrapper.emitted('reset-status-filter')).toBeTruthy()
    expect(wrapper.emitted('reset-status-filter')!).toStrictEqual([[[]]])
  })

  it('should display a console error if the request to fetch report statistics fails', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'
    fetchReportStatisticsMock.mockRejectedValue(expectedErrorMessage)
    wrapper = createWrapper()
    await flushPromises()

    expect(loggerMock.error).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(
      'Error fetching report statistics: ',
      expectedErrorMessage,
    )
  })
})
