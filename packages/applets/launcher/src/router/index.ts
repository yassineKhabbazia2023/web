import { routes } from '@kpmg/common'

routes.value.push({
  path: '/dossier/:id/launcher',
  name: 'launcher',
  component: () => import('@/pages/home'),
})

export default routes
