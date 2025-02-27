const FIVE_MINUTES_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

export function getExpirationDelays(tokenExp: number) {
  const nowTimeStamp = new Date().getTime()
  const expireTimeStamp = tokenExp * 1000

  const expiredTokenDelay = expireTimeStamp - nowTimeStamp
  const openPopupDelay = expiredTokenDelay - FIVE_MINUTES_MS

  return {
    expiredTokenDelay, // in ms
    openPopupDelay, // in ms
  }
}
