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
