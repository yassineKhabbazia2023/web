export interface BreadcrumbItems {
  readonly pId: number
  readonly pText: string
}

export interface DisplayBreadcrumbItem extends BreadcrumbItems {
  isEllipsis?: boolean
}

export interface PBreadcrumbProps {
  pElements: BreadcrumbItems[]
  pSize?: string
}
