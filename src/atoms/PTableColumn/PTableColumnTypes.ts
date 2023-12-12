import type { PlacementOptions } from '@/constants/placementOptions'
import type { Filters } from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableOverflowTooltipOptions } from 'element-plus/es/components/table/src/util'
import type { VNode } from 'vue'

export interface PTableColumnProps {
  pType?: 'selection' | 'index' | 'expand',
  pIndex?: number | ((_index?: number) => number),
  pLabel?: string,
  pColumnKey?: string,
  pProp?: string,
  pWidth?: string | number,
  pMinWidth?: string | number,
  pFixed?: boolean | 'left' | 'right',
  pRenderHeader?: (_data: { column: any, $index: number }) => VNode,
  pSortable?: boolean | 'custom',
  pSortMethod?: (_a: any, _b: any) => number,
  pSortBy?: ((_row: any, _index: number) => string) | string | string[],
  pSortOrders?: ('ascending' | 'descending' | null)[],
  pResizable?: boolean,
  pFormatter?: (
    _row: any,
    _column: any,
    _cellValue: number,
    _index: number) => VNode | string,
  pShowOverflowTooltip?: boolean | TableOverflowTooltipOptions,
  pAlign?: 'left' | 'center' | 'right',
  pHeaderAlign?: 'left' | 'center' | 'right',
  pClassName?: string,
  pLabelClassName?: string,
  pSelectable?: (_row: any, _index: number) => boolean,
  pReserveSelection?: boolean,
  pFilters?: Filters,
  pFilterPlacement?: PlacementOptions,
  pFilterMultiple?: boolean,
  pFilterMethod?: (_value: any, _row: any, _column: any) => void,
  pFilteredValue?: [],
  pHasCustomColumn?: boolean
}
