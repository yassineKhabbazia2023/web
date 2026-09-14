export const getPlainTextFromAgentLockMessage = (message: string): string => {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
    .replaceAll('<br><br>', '\n\n')
    .replaceAll('<br />', '\n')
    .replaceAll('<br/>', '\n')
    .replaceAll('<br>', '\n')

  return (messageElement.textContent ?? '').trim()
}
