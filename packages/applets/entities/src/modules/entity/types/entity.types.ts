export type TabName = 'offers' | 'invoices' | 'info' | 'users' | 'collab' | 'delegationsHistory'

export interface Tab {
  name: TabName
  title: string
}
