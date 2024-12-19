import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'

export function getButtonAction(
  buttonName: string,
  buttonActionName: string,
  override: Partial<ButtonAction> = {},
): ButtonAction {
  const defaultButton: ButtonAction = {
    buttonName,
    buttonType: 'primary',
    buttonIcon: '',
    buttonActionName,
    round: false,
    circle: false,
    loading: false,
    disabled: false,
  }

  return {
    ...defaultButton,
    ...override,
  }
}
