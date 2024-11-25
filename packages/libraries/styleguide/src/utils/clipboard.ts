import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

export const useCopyClipboard = async (value: string) => {
  const source = ref('')
  const { copy, isSupported } = useClipboard({ source })
  source.value = value
  if (!isSupported) { ElMessage.error('Copy failed') }

  try {
    await copy()
    ElMessage.success(`Copied in clipboard !
${source.value}`)
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}
