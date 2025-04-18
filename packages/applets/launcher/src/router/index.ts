import { routes } from '@pulse/common'

routes.push({
  path: '/dossier/:id/launcher',
  name: 'launcher',
  component: () => import('@launcher/pages/launcher'),
})

export default routes
