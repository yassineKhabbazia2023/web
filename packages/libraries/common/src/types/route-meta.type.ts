import {
  ALLOW_ANONYMOUS_META,
  ALLOW_AUTHENTICATED_META,
  FEATURE_FLAG_META,
  GED_CONTEXT_META,
  HTML_TITLE_META,
  IS_UNITARY_VIEW_META,
  LAYOUT_META,
  LAYOUT_NO_PADDING_META,
  PERMISSIONS_META,
  ROUTE_IS_COLLAB_META,
} from '@pulse/common/constants'
import { Permission } from '@pulse/common/types'
import { Feature, Layout, GedContext } from '@pulse/common/enums'


declare module 'vue-router' {
  interface RouteMeta {
    [ALLOW_ANONYMOUS_META]?: boolean
    [ALLOW_AUTHENTICATED_META]?: boolean
    [FEATURE_FLAG_META]?: Feature
    [GED_CONTEXT_META]?: GedContext
    [HTML_TITLE_META]?: string
    [IS_UNITARY_VIEW_META]?: boolean
    [LAYOUT_META]?: Layout
    [LAYOUT_NO_PADDING_META]?: boolean
    [PERMISSIONS_META]?: Permission[]
    [ROUTE_IS_COLLAB_META]?: boolean
  }
}
