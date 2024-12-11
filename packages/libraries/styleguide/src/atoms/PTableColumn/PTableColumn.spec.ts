import { describe, beforeEach, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import type { PTableColumnProps } from './PTableColumnTypes'
import PTableColumn from '.'

const defaultProps: PTableColumnProps = {
  pType: undefined,
  pIndex: 0,
  pLabel: '',
  pColumnKey: '',
  pProp: '',
  pWidth: '',
  pMinWidth: '',
  pFixed: false,
  pRenderHeader: undefined,
  pSortable: false,
  pSortMethod: (_a: any, _b: any) => 0,
  pSortBy: [],
  pSortOrders: [],
  pResizable: false,
  pFormatter: (
    _row: any,
    _column: any,
    _cellValue: number,
    _index: number) => '',
  pShowOverflowTooltip: false,
  pAlign: 'left',
  pHeaderAlign: 'left',
  pClassName: '',
  pLabelClassName: '',
  pSelectable: (_row: any, _index: number) => false,
  pReserveSelection: false,
  pFilters: [],
  pFilterPlacement: 'top',
  pFilterMultiple: false,
  pFilteredValue: [],
}
function createWrapper(
  overriddenProps: Partial<PTableColumnProps> = {},
): VueWrapper {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }
  return shallowMount(PTableColumn, {
    props,
    global: {
      stubs: {
        ElTableColumn: true,
      },
    },
  })
}

const pData = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 22, name: 'Jane Smith', age: 25 },
  { id: 357, name: 'Paul Simon', age: 84 },
]

const columns: (Partial<PTableColumnProps> & {
  reason: string
})[] = [{
  reason: 'typeIsSelection',
  pType: 'selection',
}, {
  reason: 'noType',
  pLabel: 'Name',
  pProp: 'name',
}, {
  reason: 'typeIsIndex',
  pType: 'index',
  pProp: 'id',
}]

describe('test PTableColumn', () => {
  it.each(columns)('should call ElColumn with proper props', ({
    reason,
    pType,
    pLabel,
    pProp,
  }) => {
    const wrapper = createWrapper({
      pType,
      pLabel,
      pProp,
    })
    const elTableColumn = wrapper.findComponent({ name: 'ElTableColumn' })

    expect(elTableColumn.props()).toMatchFileSnapshot(`__snap__/elTableColumn.${ reason }.snap`)
  })
})
