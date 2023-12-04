import type { PlacementOptions } from "@/constants/placementOptions"
import type { TableColumnCtx } from "element-plus"
import type { TableOverflowTooltipOptions } from "element-plus/es/components/table/src/util"
import type { VNode } from "vue"

export interface PTableColumnProps {
  pType: 'selection' | 'index' | 'expand',
  pIndex: number | ((index: number) => number),
  pLabel: string,
  pColumnKey: string,
  pProp: string,
  pWidth: string | number,
  pMinWidth: string | number,
  pFixed: boolean | 'left' | 'right',
  pRenderHeader: (data: { column: TableColumnCtx<any>, $index: number }) => VNode,
  pSortable: boolean | 'custom',
  pSortMethod: (a: any, b: any) => number,
  pSortBy: ((row: any, index: number) => string) | string | string[],
  pSortOrders:  ('ascending' | 'descending' | null)[],
  pResizable: boolean,
  pFormatter: (row: any, column: TableColumnCtx<any>, cellValue: number, index: number) => VNode | string,
  pShowOverflowTooltip: boolean | TableOverflowTooltipOptions,
  pAlign: 'left' | 'center' | 'right',
  pHeaderAlign: 'left' | 'center' | 'right',
  pClassName: string,
  pLabelClassName: string,
  pSelectable: (row: any, index: number) => boolean,
  pReserveSelection: boolean,
  pFilters: [{ text: string, value: string }],
  pFilterPlacement: PlacementOptions,
  pFilterMultiple: boolean,
  pFilterMethod: (value: any, row: any, column: TableColumnCtx<any>) => void,
  pFilteredValue: []
}
