import { logger } from '@pulse/toolbox'
import { api } from '../../api'

const AUTH_API = 'authorization/api'

export async function fetchUserPermissions() {
  try {
    const url = `${AUTH_API}/authorization/currentuser`
    const { data } = await api.gateway.get(url)

    return data
  } catch (error) {
    logger.error('Unable to retrieve user permissions: ', error)
  }
}

export async function fetchUserAccountPermissions(accountId: number) {
  try {
    const url = `${AUTH_API}/authorization/currentuser?accountId=${accountId}`
    const { data } = await api.gateway.get(url)

    return data
  } catch (error) {
    logger.error(`Unable to retrieve permissions for accountId: ${accountId}`, error)
  }
}
