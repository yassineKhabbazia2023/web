import { logger } from '@pulse/toolbox'
import { MsalService } from '../services/msal/msal.service'
import api from '../api'

declare let window: {
  gigya: any
} & Window

/**
 * Function to get initials
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
  const firstInitial = firstName?.at(0)?.toUpperCase() ?? ''
  const secondInitial = lastName?.at(0)?.toUpperCase() ?? ''

  return `${firstInitial}${secondInitial}`
}

export const logoutCollaborator = async () => {
  try {
    await MsalService.logout()
  } catch (error) {
    logger.error('Error during collaborator logout: ', error)
  }
}

export const logoutGigyaSSO = () => {
  try {
    window.gigya.accounts.logout()
  } catch (error) {
    logger.error('Error during Gigya SSO logout: ', error)
  }
}

export const logoutClient = async (gigyaUserId: string) => {
  try {
    const urlLogout = 'authentication/api/logout'
    await api().gateway.post(urlLogout, { gigyaUserId })
  } catch (error) {
    logger.error('Error during client logout: ', error)
  }
}
