export type TabName = 'offers' | 'info' | 'users' | 'collab' | 'delegationsHistory'

export interface Tab {
  name: TabName
  title: string
}
