export interface EmailPartsType {
  localPart: string
  domainPart: string
}

export interface PEmailInputFieldProps {
  modelValue: string
  pDefaultDomainPart?: string
  pLocalPartPlaceholder?: string
  pDomainPartPlaceholder?: string
  pLocalPartDisabled?: boolean
  pDomainPartDisabled?: boolean
}
