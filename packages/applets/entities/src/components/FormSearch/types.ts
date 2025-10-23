export interface Props {
  placeholder?: string
  // Using a v-model implies refactoring 5 other components.
  // In order to be faster and avoid potential regressions i'm using an additional prop
  forcedValue?: string
}
