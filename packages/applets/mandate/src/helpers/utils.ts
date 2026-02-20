'use strict'

declare let window: {
  showSaveFilePicker: any
  URL: any
} & Window

export const dateFormatter = (date: string, locale = 'fr') =>
  new Intl.DateTimeFormat(locale).format(new Date(date))

export const downloadFile = (filename: string, data: any, window: any) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  link.remove()
}

export const saveFileAs = async (id: string, data: any, mandateType:string) => {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `${mandateType}-mandate-${id}.pdf`,
    types: [{
      description: 'PDF Document',
      accept: { 'application/pdf': ['.pdf'] },
    }],
  })

  const writableStream = await fileHandle.createWritable()
  await writableStream.write(data)
  await writableStream.close()
}
