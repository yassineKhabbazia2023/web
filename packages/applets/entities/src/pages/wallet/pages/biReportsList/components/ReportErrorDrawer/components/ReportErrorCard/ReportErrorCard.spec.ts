import { shallowMount } from '@vue/test-utils'
import { ReportErrorCardProps } from './report-error-card.type'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'

import ReportErrorCard from '.'

const defaultProps: ReportErrorCardProps = getMockReportErrors()[0]

const createWrapper = (props: ReportErrorCardProps = defaultProps) => {
  return shallowMount(ReportErrorCard, {
    props,
    global: {
      stubs: {
        PNotificationCard: {
          template: `
            <div class="notification">
              <slot name="text" />
              <slot name="actions" />
            </div>
          `,
          props: ['pTime'],
        },
        PTag: {
          template: '<span class="tag">{{ pContent }}</span>',
          props: ['pContent'],
        },
      },
    },
  })
}

describe('ReportErrorCard.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should render correctly with default props', async () => {
    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/ReportErrorCard.snap')
  })
})
