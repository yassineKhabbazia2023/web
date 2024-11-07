export interface PFileAndFolderLineCheckProps {
  pFileName: string
  pAdditionalText?: string
  pState?: 'default' | 'loading' | 'error' | 'success'
  modelValue: boolean
}
