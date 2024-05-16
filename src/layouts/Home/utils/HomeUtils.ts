export const getBrowserName = () => {
  if (
    (navigator.userAgent.indexOf('Opera') !== -1 ||
      navigator.userAgent.indexOf('OPR')) !== -1
  ) {
    return 'Opera'
  } else if (navigator.userAgent.indexOf('Edge') !== -1) {
    return 'Edge'
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'Chrome'
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'Safari'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'Firefox'
  } else if (navigator.userAgent.indexOf('MSIE') !== -1) {
    return 'IE'
  } else {
    return 'unknown'
  }
}
