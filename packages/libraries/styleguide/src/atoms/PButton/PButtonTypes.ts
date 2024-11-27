export interface PButtonProps {
  pType?: 'default'
    | 'primary'
    | 'secondary'
    | 'terciary'
    | 'white'
    | 'generic'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
  pPlain?: boolean
  pRound?: boolean
  pCircle?: boolean
  pDisabled?: boolean
  pLoading?: boolean
  pSize?: 'default' | 'small'
  pIconOnly?: boolean
  pIsActive?: boolean
}
