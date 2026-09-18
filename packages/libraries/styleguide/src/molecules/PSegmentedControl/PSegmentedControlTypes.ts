export type PSegmentedControlValue = string | number | boolean

export interface PSegmentedControlOption {
  pValue: PSegmentedControlValue
  pLabel: string
}

export interface PSegmentedControlProps {
  /** Every choice offered, in the order they read */
  pOptions: PSegmentedControlOption[]
  /**
   * Displayed, but none of the options is pickable. What a caller reaches for
   * when the choice exists and cannot be made: hiding the control instead
   * would say nothing about why it is not there.
   */
  pDisabled?: boolean
  pSize?: 'default' | 'small'
  /**
   * Names the group for a screen reader. Superfluous when a visible caption
   * already labels it — pass `aria-labelledby` in that case, it lands on the
   * group itself.
   */
  pAriaLabel?: string
  /** Stem of the `data-testid` of every option, suffixed by its own value */
  pTestId?: string
}
