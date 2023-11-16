export interface BreadcrumbItems{
  readonly pId: number
  readonly pText: string
}

export interface PBreadcrumbProps {
  pElements: BreadcrumbItems[],
  pSize?:string
}
