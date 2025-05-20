import { shallowMount } from '@vue/test-utils'
import ReportErrorCard from '.'
import '@entities/__mocks__/i18n.import.mocks'
import { ReportTypeEnum } from '@entities/common/types/BIReports.enums'
import { ReportErrorCardProps } from './types/report-error-card.type'

const data = {
  detectionDate: '2024-01-01',
  reportName: 'Broken Widget Report',
  embedReportId: 'RPT-123',
  messages: ['Error 1', 'Error 2'],
  reportType: ReportTypeEnum.LOOP,
}

const createWrapper = (prop: ReportErrorCardProps) =>
  shallowMount(ReportErrorCard, {
    props: prop,
    global: {
      stubs: {
        PNotificationCard: {
          template: '<div class="notification"><slot name="text" /><slot name="actions" /></div>',
          props: ['pTime'],
        },
        PTag: {
          template: '<span class="tag">{{ pContent }}</span>',
          props: ['pContent'],
        },
      },
    },
  })

describe('Error card', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper(data)
  })

  it('render correctly', async () => {
    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/ReportErrorCard.snap')
  })
})
