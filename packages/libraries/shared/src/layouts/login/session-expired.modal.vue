<template>
  <PDialog
    v-model="isVisible"
    :pTitle="t('modals.sessionExpired.title')"
    :pShowClose="false"
    pWidth="350px"
    pAlignCenter
    pCenter
  >
    <div>
      <p>
        {{ t('modals.sessionExpired.message') }}
      </p>
    </div>

    <template #footer>
      <div>
        <PButton
          pType="primary"
          pSize="small"
          @click="emit('close')"
        >
          {{ t('modals.sessionExpired.okBtn') }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PDialog, PButton } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import { computed, onUnmounted } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'close': []
}>()

const { t } = useI18n()

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

onUnmounted(() => {
  // emit the close event on unMount to ensure the logout is handled
  // even if the user closes the popup by other means (e.g. navigation)
  // this means the popup needs to be conditioned with a v-if in the parent component
  emit('close')
})
</script>
