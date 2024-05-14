<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="occurrence?.template?.typeLong ?? ''"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="isDrawerOpened = false"
  >
    <div v-if="isLoading" class="flex flex--justify-content-center">
      <PLoader pType="primary" pSize="32" />
    </div>
    <template #footer>
      <PButton
        class="margin-left--4"
        pType="primary"
        pSize="default"
        :pLoading="isLoading"
      >
        {{ t('save') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getOccurrence } from '@/schedule/services'
import {
  PButton,
  PDrawer,
  PLoader,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import type { Occurrence } from '@/schedule/models/Deadline'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{ 'update:model-value' : [value: boolean] }>()

const props = defineProps<OccurrenceDrawerProps>()

const isLoading = ref(false)
const occurrence = ref<Occurrence>()

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

onMounted(async () => {
  try {
    isLoading.value = true
    occurrence.value = await getOccurrence(props.occurrenceId)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="yaml">
  en-US:
    save: 'Save'
  fr-FR:
    save: 'Enregistrer'
</i18n>
