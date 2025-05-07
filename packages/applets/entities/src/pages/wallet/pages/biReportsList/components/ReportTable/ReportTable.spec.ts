import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ReportTableProps } from './report-table.types'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { getFormattedMockReports } from '@entities/__mocks__/bi-report.mocks'

import ReportTable from '.'

const mockReport = getFormattedMockReports()[0]!

const createWrapper = (propsData: ReportTableProps) => {
  return shallowMount(ReportTable, {
    props: propsData,
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
        },
        PToolbox: {
          name: 'PToolbox',
          template: '<button><slot /></button>',
          emits: ['p-toolbox-item-clicked'],
          props: ['pElements'],
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            return {
              row: mockReport,
            }
          },
        },
      },
    },
  })
}

describe('ReportTable', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper({
      reports: getFormattedMockReports(),
    })
  })

  describe('Rendering', () => {
    it('matches the snapshot', async () => {
      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/ReportTable.snap')
    })
  })

  describe('Event Handling', () => {
    it('emits update-report-status when toolbox item is clicked', async () => {
      const toolbox = wrapper.findComponent({ name: 'PToolbox' })

      // Simulate click on "Deactivate Report" if the status is ONLINE
      await toolbox.vm.$emit('p-toolbox-item-clicked', 'DeactivateReport')
      await nextTick()

      expect(wrapper.emitted('update-report-status')).toStrictEqual([
        [mockReport.accountId, mockReport.reportId, mockReport.name, ReportStatus.OFFLINE],
      ])
    })

    it('emits update-report-status with ONLINE when activating', async () => {
      const toolbox = wrapper.findComponent({ name: 'PToolbox' })

      await toolbox.vm.$emit('p-toolbox-item-clicked', 'ActivateReport')
      await nextTick()

      expect(wrapper.emitted('update-report-status')).toStrictEqual([
        [mockReport.accountId, mockReport.reportId, mockReport.name, ReportStatus.ONLINE],
      ])
    })
  })
})
