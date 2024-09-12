import type {
  Report,
} from '@/layouts/Home/Sidebar/components/SidebarEntity/components/SidebarEntityMenu/SidebarEntityMenuTypes'

export interface GetReportsRequest {
  items: Report[]
  currentPage: number
  totalItems: number
  totalPage: number
}
