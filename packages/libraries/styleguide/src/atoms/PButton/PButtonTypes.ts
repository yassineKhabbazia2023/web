export interface PButtonProps {
  pType?: 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'white'
    | 'generic'
    | 'warning'
    | 'danger'
  pPlain?: boolean
  pRound?: boolean
  pCircle?: boolean
  pDisabled?: boolean
  pLoading?: boolean
  pSize?: 'default' | 'small'
  pIconOnly?: boolean
  pIsActive?: boolean
}
