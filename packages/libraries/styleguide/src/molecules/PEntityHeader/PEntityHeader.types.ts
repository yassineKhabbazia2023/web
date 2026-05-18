export interface PEntityHeaderProps {
  pLegalName: string
  pAccountNumber: string
  pSize?: 'small' | 'default'
  pAccountType?: 'REGULAR' | 'PROSPECT' // This should ideally be typed using the AccountType enum, but it's in common library
}
