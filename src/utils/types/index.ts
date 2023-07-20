export interface VueComponent {
  template?: string
  name: string
  components?: Record<string, any>
  props?: string[]
  emits?: string[]
  methods?: { [key: string]: () => void }
  setup?: () => any
}

export interface StubbedComponents {
  [key: string]: VueComponent
}
