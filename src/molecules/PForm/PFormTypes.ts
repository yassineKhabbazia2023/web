import type { FormRules } from 'element-plus'

export interface PFormProps {
  pModel?: Record<string, any>,
  pRules?: FormRules,
  pInline?: boolean,
  pLabelPosition?: 'left' | 'right' | 'top',
  pLabelWidth?: string | number,
  pLabelSuffix?: string,
  pHideRequiredAsterisk?: boolean,
  pRequireAsteriskPosition?: 'left' | 'right',
  pShowMessage?: boolean,
  pInlineMessage?: boolean,
  pStatusIcon?: boolean,
  pValidateOnRuleChange?: boolean,
  pSize?: '' | 'large' | 'default' | 'small',
  pDisabled?: boolean,
  pScrollToError?: boolean,
  pScrollIntoViewOptions?: boolean | Record<string, any>
}
