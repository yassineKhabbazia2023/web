import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

export const errorRoutes = {
  path: APP_ROUTES.error.root.path,
  name: APP_ROUTES.error.root.name,
  redirect: { name: APP_ROUTES.error.error404.name },
  children: [
    {
      path: APP_ROUTES.error.error403.path,
      name: APP_ROUTES.error.error403.name,
      component: () => import('@app/pages/Error/403/Error403.page.vue'),
    },
    {
      path: APP_ROUTES.error.error500.path,
      name: APP_ROUTES.error.error500.name,
      component: () => import('@app/pages/Error/500/Error500.page.vue'),
    },
  ],
  meta: {
    [LAYOUT_META]: Layout.ERROR,
    [ALLOW_ANONYMOUS_META]: true,
    [ALLOW_AUTHENTICATED_META]: true,
  },
}
