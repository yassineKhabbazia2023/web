import type { Decorator } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { LoginLayout } from '@pulse/shared/layouts'

interface LoginLayoutDecoratorOptions {
  routeName?: string
  routeQuery?: Record<string, string>
}

export const withLoginLayout = (options: LoginLayoutDecoratorOptions = {}): Decorator => {
  return (story, context) => {
    const StoryComponent = story(context.args)

    return {
      setup() {
        const router = useRouter()
        const storyRouteName = `story-${context.id}`

        // Clean up all story routes (they all start with 'story-' or 'parent-story-')
        const existingRoutes = router.getRoutes()
        existingRoutes.forEach((existingRoute) => {
          if (existingRoute.name && typeof existingRoute.name === 'string' &&
              (existingRoute.name.startsWith('story-') || existingRoute.name.startsWith('parent-story-'))) {
            router.removeRoute(existingRoute.name)
          }
        })

        // Create the story component properly
        const StoryComponentDef = defineComponent({
          name: 'StoryComponent',
          ...StoryComponent,
        })

        // Add parent route with LoginLayout
        const parentRouteName = `parent-${storyRouteName}`
        const parentPath = `/${storyRouteName}`

        router.addRoute({
          path: parentPath,
          name: parentRouteName,
          component: LoginLayout,
          children: [
            {
              path: '',
              name: storyRouteName,
              component: StoryComponentDef,
            },
          ],
        })

        // Navigate to the child route (the parent will render via nesting)
        router.replace({
          path: parentPath,
          query: options.routeQuery || {},
        })

        return {}
      },
      template: '<router-view />',
    }
  }
}

// Convenience decorators for different login types
export const withLoginLayoutCollab = withLoginLayout({
  routeName: 'login.collab',
})

export const withLoginLayoutClient = withLoginLayout({
  routeName: 'login.client',
})
