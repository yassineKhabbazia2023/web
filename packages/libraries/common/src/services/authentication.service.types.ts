export interface CreateNewPasswordPayload {
  contactId: string
  newPassword: string
  resetPasswordToken: string
  isCreatePasswordAction?: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginData {
  userId: string
  webToken: string
}

export interface ApiErrorData {
  errorCode: string
  errorMessage: string
}
