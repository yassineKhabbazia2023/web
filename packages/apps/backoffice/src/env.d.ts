declare module 'env-vars'

declare module '@pulse/styleguide/fonts'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}
