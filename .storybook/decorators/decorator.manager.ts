import type { Decorator } from '@storybook/vue3-vite'
import { withLoginLayout } from './with-login-layout.decorator'

// Conditional decorator that applies login layout based on story parameters
// Usage in stories: parameters: { loginLayout: 'client' | 'collab' | true }
export const withConditionalLoginLayout: Decorator = (story, context) => {
  const layoutType = context.parameters?.loginLayout
  if (layoutType === true) {
    return withLoginLayout()(story, context)
  }
  if (layoutType === 'client' || layoutType === 'collab') {
    return withLoginLayout({ routeName: `login.${layoutType}` })(story, context)
  }
  return story()
}

// Export all global decorators for use in preview.ts
export const globalDecorators: Decorator[] = [
  withConditionalLoginLayout,
]
