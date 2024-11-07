import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

export function stringToClassList(prefix: string, suffixes: string) {
  return suffixes
    .split(',')
    .map(suffix => `${prefix}${suffix.trim()}`)
}

export function numbersToClassList(prefix: string, lastIndex: number) {
  const suffixes = Array.from(Array(lastIndex + 1).keys())

  return suffixes
    .map(suffix => `${prefix}${suffix}`)
}

export function onClickCssClass(source1: string, source2: string = '') {
  const source = [source1, source2].join(' ').trim()
  const { copy, isSupported } = useClipboard({ source })

  copy(source)
  if (isSupported.value) {
    ElMessage.success(`Copied ${source}`)
  }
}
