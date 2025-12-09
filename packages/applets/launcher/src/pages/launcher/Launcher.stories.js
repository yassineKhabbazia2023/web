import { useRouter } from 'vue-router'
import { useCurrentEntityStore, usePermissionsStore, useUserStore } from '@pulse/common/stores'
import { CustomerPermission } from '@pulse/common/enums'
import LauncherComponent from './Launcher.vue'

const withLauncherSetup = () => {
  return (_story, context) => ({
    setup() {
      const router = useRouter()

      // Setup route for launcher
      const storyRouteName = `story-${context.id}`
      const existingRoutes = router.getRoutes()
      existingRoutes.forEach((existingRoute) => {
        if (existingRoute.name && typeof existingRoute.name === 'string' &&
            existingRoute.name.startsWith('story-')) {
          router.removeRoute(existingRoute.name)
        }
      })

      router.addRoute({
        path: `/${storyRouteName}`,
        name: 'launcher',
        component: { render: () => null },
      })

      router.replace({ name: 'launcher' })

      // Setup stores
      const currentEntityStore = useCurrentEntityStore()
      currentEntityStore.currentEntity = {
        accountId: 602,
        accountNumber: '2025546345',
        legalName: 'Boulangerie Bel Epi',
      }

      const permissionsStore = usePermissionsStore()
      permissionsStore.currentEntityPermissions = [
        CustomerPermission.ACCEDER_OUTIL_MEG,
        CustomerPermission.ACCEDER_OUTIL_SILAE,
        CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
      ]

      const userStore = useUserStore()
      userStore.setUser({ isCollab: false })

      return {}
    },
    template: '<story />',
  })
}

const meta = {
  title: 'Applets/Launcher/Launcher',
  component: LauncherComponent,
  tags: ['!autodocs'],
  decorators: [withLauncherSetup()],
}

export default meta

export const Launcher = {
  render: () => ({
    components: { LauncherComponent },
    template: '<LauncherComponent />',
  }),
}
