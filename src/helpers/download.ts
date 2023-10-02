'use strict'
export const useDownload = () => {
  const downloadFile = ({
    data,
    fileName
  }: {
    data: any
    fileName: string
  }): void => {
    const url = URL.createObjectURL(new Blob([data]))
    const downloadLink = document.createElement('a')
    downloadLink.target = '_blank'
    downloadLink.href = url
    downloadLink.download = fileName
    downloadLink.type = 'application/octet-stream'
    document.body.appendChild(downloadLink)
    downloadLink.click()
  }

  return {
    downloadFile
  }
}
