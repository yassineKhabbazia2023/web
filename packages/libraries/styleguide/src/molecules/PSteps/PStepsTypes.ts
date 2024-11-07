export interface PStepsProps {
  pSpace?: number | string
  pDirection?: 'vertical' | 'horizontal'
  pActive?: number
  pProcessStatus?: 'wait' | 'process' | 'finish' | 'error' | 'success'
  pFinishStatus?: 'wait' | 'process' | 'finish' | 'error' | 'success'
  pAlignCenter?: boolean
  pSimple?: boolean
}
