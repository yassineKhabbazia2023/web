/**
 * This helper is created to get the current user's browser name
 * @returns string
 */
export const getBrowserName = (): string => {
  if (navigator.userAgent.includes('OPR')) {
    return 'Opera'
  } else if (navigator.userAgent.includes('Edg')) {
    return 'Microsoft Edge'
  } else if (navigator.userAgent.includes('Chrome')) {
    return 'Chrome'
  } else if (navigator.userAgent.includes('Safari')) {
    return 'Safari'
  } else if (navigator.userAgent.includes('Firefox')) {
    return 'Firefox'
  } else if (navigator.userAgent.includes('MSIE')) {
    return 'Microsoft Internet Explorer'
  } else {
    return 'Unknown'
  }
}

/**
 * Detects if the current device is a mobile device based on the user agent.
 * Covers iOS, Android, and other mobile platforms.
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
