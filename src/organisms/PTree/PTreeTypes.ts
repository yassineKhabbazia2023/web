type dataKeys = {
  label: string
  children: string
}

export type PTreeProps = {
  data: Array<any>
  dataKeys?: dataKeys,
  hasCustomNodes?: boolean
}
