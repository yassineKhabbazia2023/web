'use strict'
import type { Account } from '@/schedule/models/Account'

export const dateToLocaleFormat = (date: string | Date, locale = 'fr') =>
  new Intl.DateTimeFormat(locale).format(new Date(date))

export const accountsDataTransformer = (accountsCollection: Account[]) =>
  accountsCollection.map(({ id, name }: Account) => ({
    label: `${name} (${id})`,
    value: id,
  }))

export const dateISOFormatter = (date: Date | string) => {
  try {
    if (date) {
      const dateWithHoursUpdated = (new Date(date)).setHours(10)
      return (new Date(dateWithHoursUpdated)).toISOString().split('T')[0]
    }
  } catch (error) {
    console.error(error)
  }
  return ''
}

export const daysInTheMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}

export const getYearMonth = (date: Date) => {
  return dateISOFormatter(date).substring(0, 7)
}
