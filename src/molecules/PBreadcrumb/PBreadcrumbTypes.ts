export type BreadcrumbItems ={
  readonly id: number
  readonly text: string
  isActive: boolean
}

export type PBreadcrumbProps = {
  elements: BreadcrumbItems[]
}
