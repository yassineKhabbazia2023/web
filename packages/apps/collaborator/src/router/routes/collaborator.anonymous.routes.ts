import { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, APP_TITLE_COLLABORATOR, HTML_TITLE_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { useLoadingStore } from '@pulse/common/stores'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { logger } from '@pulse/toolbox'
import { CollaboratorAnonymousFlowManager } from '@collaborator/managers/collaborator.anonymous.flow.manager'

export const anonymousCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.anonymous.path,
    name: COLLABORATOR_ROUTES.anonymous.name,
    component: () => import('@collaborator/pages/CollaboratorAnonymous.root.vue'),
    beforeEnter: (to) => {
      const loadingStore = useLoadingStore()
      try {
        CollaboratorAnonymousFlowManager.enterAnonymousFlow()

        // Check if redirection is needed (landing page)
        const redirection = CollaboratorAnonymousFlowManager.getAnonymousRedirection(to)
        if (redirection) {
          return redirection
        }
      } catch (error) {
        logger.error('Error while entering anonymous flow', error)
        // Continue anyway (graceful degradation)
      } finally {
        // stop any loading
        loadingStore.stopGlobalLoading()
      }
    },
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [ALLOW_ANONYMOUS_META]: true,
    },
    children: [
      {
        path: COLLABORATOR_ROUTES.login.path,
        name: COLLABORATOR_ROUTES.login.name,
        component: () => import('@pulse/login/pages').then(pages => pages.LoginCollab),
        meta: {
          [HTML_TITLE_META]: APP_TITLE_COLLABORATOR,
          [ALLOW_ANONYMOUS_META]: true,
        },
      },
      {
        // we redirect /login to the login route in case the user comes from another app
        // or an old bookmark
        path: COLLABORATOR_ROUTES.loginRedirect.path,
        name: COLLABORATOR_ROUTES.loginRedirect.name,
        redirect: { name: COLLABORATOR_ROUTES.login.name },
        meta: {
          [ALLOW_ANONYMOUS_META]: true,
        },
      },
    ],
  },
]
