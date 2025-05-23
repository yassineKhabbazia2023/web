import { routes } from '@pulse/common'
import { RouteName } from '@pulse/common/enums'

routes.push({
  path: '/dossier/:id/launcher',
  name: RouteName.LAUNCHER,
  component: () => import('@launcher/pages/launcher'),
})

export default routes
