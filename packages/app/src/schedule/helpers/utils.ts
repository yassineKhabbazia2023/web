'use strict'
import { toRaw } from 'vue'
import { isEqual } from 'lodash-es'
import type { Account } from '@app/schedule/models/Account'
import type { Deadline } from '../models/Deadline'
import { TEMPLATE_TYPE_SHORT_OTHER } from './scheduleConsts'
import type { Filters } from '@app/schedule/components/FilterDrawer/FilterDrawerTypes'
import type { POptionProps } from '@pulse/styleguide/types'

declare let window: {
  showSaveFilePicker: any
  URL: any
} & Window

export const dateToLocaleFormat = (date: string | Date, locale = 'fr') =>
  new Intl.DateTimeFormat(locale).format(new Date(date))

export const accountsDataTransformer = (accountsCollection: Account[]) =>
  accountsCollection
    .map<POptionProps>(({ id, name }: Account) => ({
      pLabel: `${name} (${id})`,
      pValue: id,
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

export function getTypeLabel(
  scheduleModelsByKey: Record<string, string> | undefined,
  template: Deadline['template'],
) {
  const { typeShort, typeLong } = template
  if (typeShort === TEMPLATE_TYPE_SHORT_OTHER) {
    return typeLong
  }

  return scheduleModelsByKey?.[typeShort] ?? typeShort
}

export const base64ToBlob = (base64Data:string) => {
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray])
}

export const base64ToBase64URL = (base64String: string) => base64String.replace(/\+/g, '-').replace(/\//g, '_')

export const downloadFile = (filename: string, data: string) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  let link: HTMLAnchorElement | null = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  link.type = 'application/octet-stream'
  link.click()
  window.URL.revokeObjectURL(url)
  link = null
}

export const saveFileAs = async (filename: string, data: any) => {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: filename,
  })
  const writableStream = await fileHandle.createWritable()
  await writableStream.write(data)
  await writableStream.close()
}

export const getFileExtension = (fileName = '') => fileName.split('.')?.pop()?.toUpperCase() ?? ''

export const fileSizeHumanFormatter = (fileSize:number, decimals = 2) => {
  const kilobytes = 1024
  const decimalsAccuracy = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(fileSize) / Math.log(kilobytes))
  return `${parseFloat((fileSize / Math.pow(kilobytes, i)).toFixed(decimalsAccuracy))}${sizes[i]}`
}

export function getDefaultFilters(isCollab: boolean): Filters {
  return {
    targets: [],
    templates: [],
    status: [],
    mineOnly: isCollab,
  }
}

export function getAppliedFilterCount(defaultFilters: Filters, filters: Filters) {
  const filterKeys = Object.keys(defaultFilters) as any as (keyof Filters)[]
  const rawFilters = toRaw(filters)

  const appliedFilterCount = filterKeys
    .reduce((count, filterKey) => {
      const value = rawFilters[filterKey]
      const defaultValue = defaultFilters[filterKey]
      const isSameValue = isEqual(value, defaultValue)

      return count + (isSameValue ? 0 : 1)
    }, 0)

  return appliedFilterCount
}
