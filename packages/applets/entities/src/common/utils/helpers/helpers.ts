import { PICheck, PIX, PNotification } from '@pulse/styleguide'

type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string, string}
 * @returns {string}
 */
export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined,
  lastNameToUpper: boolean = false,
) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  return lastNameToUpper && lastName
    ? `${firstName ?? ''} ${lastName.toUpperCase()}`.trim()
    : fullName
}

export const displayNotification = (
  type: 'success' | 'error',
  message: string,
  position: NotificationPosition = 'bottom-right',
  duration: number = 3000,
) => {
  PNotification({
    message,
    icon: type === 'success' ? PICheck : PIX,
    showClose: true,
    customClass: type,
    position,
    duration,
  })
}
