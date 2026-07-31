import { SortDirection } from '@pulse/common/enums'

export interface SortChangeEventData {
  column: any,
  prop: string,
  order: SortDirection | null,
}
