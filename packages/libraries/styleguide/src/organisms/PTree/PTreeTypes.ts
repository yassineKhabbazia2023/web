type dataKeys = {
  label: string
  children: string
}

export type PTreeProps = {
  pCurrentNodeKey?: string | number
  pData: Array<any>
  pDataKeys?: dataKeys
  pDefaultExpandedKeys?: Array<string | number>
  pHasCustomNodes?: boolean
  pNodeKey: string
}
