export interface AddAppSettingDialogProps {
  modelValue: boolean
}

export interface CreateAppSettingFormData {
  name: string
  value: string
  isSecret: boolean
  allEnvs: boolean
  withLabels: boolean
  selectedEnvironments: string[]
}

export interface UseAddAppSettingDialogOptions {
  onSuccess: () => void
  onClose: () => void
}

export interface ValidationErrors {
  name?: string
  selectedEnvironments?: string
  value?: string
}
