import { routes } from '@pulse/common'
import { RouteName, RouteParam } from '@pulse/common/enums'

routes.push({
  path: `/dossier/:${RouteParam.ENTITY_ID}/launcher`,
  name: RouteName.LAUNCHER,
  component: () => import('@launcher/pages/launcher'),
})

export default routes
