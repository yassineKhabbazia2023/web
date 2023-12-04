import type { FormItemRule } from "element-plus";
import type { Arrayable } from "element-plus/es/utils";

export interface PFormItemProps {
  pLabel: string,
  pLabelWidth: string | number,
  pRequired: boolean,
  pRules: Arrayable<FormItemRule>,
  pError: string,
  pShowMessage: boolean,
  pInlineMessage: boolean | string,
  pSize: '' | 'large' | 'default' | 'small',
  pFor: string,
  pValidateStatus: '' | 'error' | 'validating' | 'success'
}
