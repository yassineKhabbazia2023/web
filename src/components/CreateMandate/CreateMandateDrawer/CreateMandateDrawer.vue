<template>
  <PDrawer
    v-model="drawerModel"
    :title="`${t('new-collection')}`"
    :showPreviousStep="false"
    size="50%"
    direction="rtl"
  >
    <template #footer>
      <div>
        <PButton
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          disabled
          :loading="false"
        >
          {{ t('next') }}
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<i18n lang="yaml">
    en-US:
        new-collection: 'New collection'
        next: 'Next'
    fr-FR:
        new-collection: 'Nouvelle collecte'
        next: 'Suivant'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['drawer-previous-button-click', 'update:modelValue'])

const props = defineProps({
  modelValue: Boolean
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

defineExpose({
  drawerModel
})
</script>
