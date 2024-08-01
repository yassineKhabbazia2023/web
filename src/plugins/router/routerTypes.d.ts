// Ensure this file is parsed as a module regardless of dependencies.
export {}

interface StylesMeta {
  hasPaddings: boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    styles?: StylesMeta
  }
}
