import { routes } from '@pulse/Common'

routes.push({
  path: '/dossier/:id/launcher',
  name: 'launcher',
  component: () => import('@launcher/pages/home'),
})

export default routes
