import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ReportTableProps } from './report-table.types'
import { getFormattedMockReports } from '@entities/__mocks__/bi-report.mocks'

import ReportTable from '.'

const mockFirstFormattedReport = getFormattedMockReports().at(0)

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
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            return {
              row: mockFirstFormattedReport,
            }
          },
        },
      },
    },
  })
}

describe('ReportTable', () => {
  it('should match the snapshot', async () => {
    const wrapper = createWrapper({ reports: getFormattedMockReports() })

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/ReportTable.snap')
  })
})
