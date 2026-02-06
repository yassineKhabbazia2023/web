export type TabName = 'offers' | 'invoices' | 'info' | 'users' | 'collab' | 'history' | 'delegationsHistory'

export interface Tab {
  name: TabName
  title: string
}
