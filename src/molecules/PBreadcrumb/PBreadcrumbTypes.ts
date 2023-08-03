export type BreadcrumbItems ={
  readonly id: number
  readonly text: string
}

export type PBreadcrumbProps = {
  elements: BreadcrumbItems[],
  size?:string
}
