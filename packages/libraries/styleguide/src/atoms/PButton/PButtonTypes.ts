export interface PButtonProps {
  pType?: 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'white'
    | 'warning'
    | 'danger'
  pRound?: boolean
  pCircle?: boolean
  pDisabled?: boolean
  pLoading?: boolean
  pSize?: 'default' | 'small'
  pIconOnly?: boolean
  pIsActive?: boolean
}
