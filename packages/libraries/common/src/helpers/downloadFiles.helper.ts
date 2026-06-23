export const downloadFile = (
  data:any,
  fileName:string,
): void => {
  const url = URL.createObjectURL(new Blob([data]))
  const downloadLink = document.createElement('a')

  downloadLink.target = '_blank'
  downloadLink.href = url
  downloadLink.download = fileName
  downloadLink.type = 'application/octet-stream'

  document.body.appendChild(downloadLink)

  downloadLink.click()

  // Release the DOM node and the object URL, otherwise both leak on every download.
  downloadLink.remove()
  URL.revokeObjectURL(url)
}
