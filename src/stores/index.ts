import { defineStore } from 'pinia'

type UserInfo = {
  firstName: string
  lastName: string
  occupation: string
  email: string
  token: string
}

export default defineStore('common', {
  state: () => {
    return {
      // for user informations
      user: null as UserInfo | null
    }
  }
})
