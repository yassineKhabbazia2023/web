export interface AddAppSettingDialogProps {
  modelValue: boolean
}

export interface CreateAppSettingFormData {
  name: string
  valuesByTarget: Record<string, string>
}

export interface UseAddAppSettingDialogOptions {
  onSuccess: () => void
  onClose: () => void
}

export interface ValidationErrors {
  name?: string
  valuesByTarget?: string
}
