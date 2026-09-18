/** What the confirmation popup of the indicators page is waiting on. */
export interface IndicatorTransition {
  code: string
  action: 'deprecate' | 'restore'
}
