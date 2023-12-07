<template>
  <Story
    title="1. Basic/Config Provider"
    icon="ph:layout-thin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <PButton mb2 @click="toggle">
        Switch Language
      </PButton>
      <br />
      <PConfigProvider :pLocale="locale">
        <el-table mb1 :data="[]" />
        <el-pagination :total="100" />
      </PConfigProvider>
    </Variant>
    <Variant title="Button">
      <div m="b-2">
        <PCheckbox v-model="configButton.autoInsertSpace">
          autoInsertSpace
        </PCheckbox>
      </div>

      <PConfigProvider :pButton="configButton">
        <PButton>中文</PButton>
      </PConfigProvider>
    </Variant>
    <Variant title="Message">
      <PConfigProvider :pMessage="configMessage">
        <PButton @click="open">
          OPEN
        </PButton>
      </PConfigProvider>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import PButton from '@/atoms/PButton'
import { computed, reactive, ref } from 'vue'
import PCheckbox from '@/atoms/PCheckbox'
import { ElMessage } from 'element-plus'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}

const open = () => {
  ElMessage('This is a message.')
}

const configButton = reactive({
  autoInsertSpace: true
})

const configMessage = reactive({
  max: 3
})
</script>
