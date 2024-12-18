import type { PErrorBlockProps } from './PErrorTypes'

export function getErrorText(
  pErrorName: PErrorBlockProps['pErrorName'],
  pErrorText: PErrorBlockProps['pErrorText'],
) {
  const errorTexts = []

  if (pErrorName) {
    errorTexts.push(pErrorName)
  }
  if (pErrorName && pErrorText) {
    errorTexts.push('-')
  }
  if (pErrorText) {
    errorTexts.push(pErrorText)
  }

  return errorTexts.join(' ')
}
