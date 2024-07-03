// Ensure this file is parsed as a module regardless of dependencies.
export {}

interface StylesMeta {
  hasPaddings: boolean
}
interface DisplayMeta {
  fullpage: boolean
}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    styles?: StylesMeta
    display?: DisplayMeta
  }
}
