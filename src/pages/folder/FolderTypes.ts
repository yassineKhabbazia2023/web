export type TabName = 'offers' | 'info' | 'usersCollab' | 'collab' | 'delegationsHistory' | 'usersClient'

export interface Tab {
  name: TabName
  title: string
  display: boolean
}
