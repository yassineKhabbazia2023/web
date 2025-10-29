export interface AddAppSettingDialogProps {
  modelValue: boolean
}

export interface AddAppSettingFormData {
  key: string
  type: 'String' | 'Secret'
  domain: string
  values: AddAppSettingValuePayload[]
}

export interface AddAppSettingValuePayload {
  environment: string
  label: string
  envLabel: string
  value: string
  eTag: string
}

export interface ValidationErrors {
  key?: string
  environment?: string
  domain?: string
  value?: string
}
