export interface ToastPluginType {
  message: string
  icon: any
  showClose: boolean
  customClass: string
  position: string
  onClick?: Function
}

// eslint-disable-next-line no-unused-vars
export type ToastPluginFunc = (toastPluginType: ToastPluginType) => void
