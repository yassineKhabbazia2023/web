import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'

export function getCssVarName(namespace: string, type: string) {
  return type ? `--el-${namespace}-${type}` : `--el-${namespace}`
}

/**
 * get css var value by css var name
 * @param name
 * @returns
 */
export function getCssVarValue(name: string) {
  const val = ref(
    getComputedStyle(document.documentElement).getPropertyValue(name)
  )
  watch(
    () => {
      setTimeout(() => {
        val.value = getComputedStyle(document.documentElement).getPropertyValue(
          name
        )
      }, 100)
    }
  )
  return val
}

export function getColorValue(type: string) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(
    `--el-color-${type}`
  )
  return color
}

// copy color
export function useCopyColor() {
  const source = ref('')
  const color = ref('')
  const { copy, isSupported } = useClipboard({ source })

  const copyColor = async (colorType: string) => {
    const colorValue = getColorValue(colorType)
    color.value = colorValue
    source.value = `--el-color-${colorType}`
    if (!isSupported) { ElMessage.error('Copy failed') }

    try {
      await copy()
      ElMessage.success(`--el-color-${colorType}: ${color.value}`)
    } catch (e: any) {
      ElMessage.error(e.message)
    }
  }

  return {
    copyColor
  }
}
