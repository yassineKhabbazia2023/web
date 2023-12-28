'use strict'

export const dateFormatter = (date: string, locale = 'fr') =>
  new Intl.DateTimeFormat(locale).format(new Date(date))

export const debounce = (callback: any, timer = 500) => {
  let timeoutId: undefined | ReturnType<typeof setTimeout>
  return (...args: any) => {
    const context = this
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback.apply(context, args)
    }, timer)
  }
}

export const downloadFile = (filename: string, data: any, window: any) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  let link: HTMLAnchorElement | null = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
  link = null
}
