import { defineStore } from 'pinia'

export default defineStore('common', {
  state: () => {
    return {
      // for user informations
      user: null as UserInfo | null,
    }
  },
})

type UserInfo = {
  firstName: string
  lastName: string
  occupation: string
  email: string
  token: string
}