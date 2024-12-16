export interface ToastPluginType {
  message: string
  icon: any
  showClose: boolean
  customClass: string
  position: string
  onClick?: Function
}


export type ToastPluginFunc = (toastPluginType: ToastPluginType) => void
