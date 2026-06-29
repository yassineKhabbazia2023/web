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

// The new tab needs the blob URL to stay valid long enough to load the document before we revoke it.
const OBJECT_URL_REVOKE_DELAY_MS = 60_000

// Opens a freshly-fetched document blob in a new browser tab.
//
// The tab is opened synchronously — before awaiting the fetch — so the call stays within the user
// activation triggered by the click. Opening it after the await would lose that activation and the
// popup would be blocked. The blob URL is revoked once the new tab had time to load it, and the tab
// is closed if the fetch fails. Returns false when the browser blocked the popup, so the caller can
// warn the user instead of failing silently.
export const openDocumentInNewTab = async (
  fetchDocument: () => Promise<Blob>,
): Promise<boolean> => {
  const documentTab = window.open('', '_blank')
  if (documentTab === null) {
    return false
  }
  // The document is same-origin (blob URL), so severing the opener reference is enough to keep the
  // new tab from reaching back into this one.
  documentTab.opener = null
  try {
    const documentBlob = await fetchDocument()
    const documentUrl = URL.createObjectURL(documentBlob)
    documentTab.location.href = documentUrl
    setTimeout(() => {
      URL.revokeObjectURL(documentUrl)
    }, OBJECT_URL_REVOKE_DELAY_MS)
  } catch (error) {
    documentTab.close()
    throw error
  }
  return true
}
