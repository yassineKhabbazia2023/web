import type { Component } from 'vue'

export interface Contact {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  type: string
  status: string
  personaName: string
  creationDate: string
}

export interface UserStatus {
  text: string
  color:
    | ''
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'persian'
    | 'fuschia'
    | 'cyan'
    | 'amethyste'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900'
  icon: Component
}
