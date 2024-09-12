import type { ButtonAction } from '@/modules/common/Types/ButtonAction'

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
    plain: false,
    round: false,
    circle: false,
    loading: false,
    disabled: false,
    size: 'small',
  }

  return {
    ...defaultButton,
    ...override,
  }
}
