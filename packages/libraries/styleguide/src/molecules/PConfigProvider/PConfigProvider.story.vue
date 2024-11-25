<template>
  <Story
    title="1. Basic/Config Provider"
    icon="ph:layout-thin"
    :layout="{
      type: 'single'
    }"
  >
    <Variant title="Basic Usage">
      <PButton class="margin-bottom--2" @click="toggle">
        Switch Language
      </PButton>
      <br>
      <PConfigProvider :pLocale="locale">
        <PTable class="margin-bottom--1" :pData="[]" />
        <PPagination :pTotal="100" />
      </PConfigProvider>
    </Variant>
    <Variant title="Button">
      <div class="margin-bottom--2">
        <PCheckbox v-model="configButton.autoInsertSpace">
          autoInsertSpace
        </PCheckbox>
      </div>

      <PConfigProvider :pButton="configButton">
        <PButton>Click</PButton>
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
import fr from 'element-plus/es/locale/lang/fr'
import PButton from '../../atoms/PButton'
import PTable from '../../atoms/PTable'
import PPagination from '../../atoms/PPagination'
import { computed, reactive, ref } from 'vue'
import PCheckbox from '../../atoms/PCheckbox'
import { ElMessage } from 'element-plus'
import PConfigProvider from '../../molecules/PConfigProvider'

const language = ref('fr')
const locale = computed(() => (language.value === 'fr' ? fr : en))

const toggle = () => {
  language.value = language.value === 'fr' ? 'en' : 'fr'
}

const open = () => {
  ElMessage('This is a message.')
}

const configButton = reactive({
  autoInsertSpace: true,
})

const configMessage = reactive({
  max: 3,
})
</script>
