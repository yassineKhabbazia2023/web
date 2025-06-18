import { routes } from '@pulse/common'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { RouteName, RouteParam } from '@pulse/common/enums'

routes.push({
  path: `/dossier/:${RouteParam.ENTITY_ID}/launcher`,
  name: RouteName.LAUNCHER,
  meta: {
    [IS_UNITARY_VIEW_META]: true,
  },
  component: () => import('@launcher/pages/launcher'),
})

export default routes
