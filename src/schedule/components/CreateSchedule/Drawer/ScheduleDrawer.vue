<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('new-schedule')"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="isDrawerOpened=false"
  >
    <div v-if="loading" class="flex flex--justify-content-center">
      <PLoader pType="primary" pSize="32" />
    </div>
    <CreateScheduleForm
      v-else
      :recipientsCollection="recipientsCollection"
      :checkValidity="evaluateForm"
      @update-schedule-model="sendReminder"
    />
    <template #footer>
      <PButton
        class="margin-left--4"
        pType="primary"
        pSize="default"
        data-testid="schedule-send-reminder-button"
        :pLoading="loadFormIndicator"
        @click="triggerFormEvaluation">
        {{ t('send-reminder') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import type { Options }
  from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll/DropdownMultiSelectWithToggleAllTypes'
import type { Schedule } from '@/schedule/components/CreateSchedule/Form/CreateScheduleFormModel'
import { getAccountsCollection, postSchedule } from '@/schedule/services'
import {
  PButton,
  PDrawer,
  PLoader,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { ScheduleDrawerProps } from './ScheduleDrawerTypes.ts'
import CreateScheduleForm from '@/schedule/components/CreateSchedule/Form'
import { accountsDataTransformer } from '@/schedule/helpers/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{ 'update:modelValue' : [value: boolean] }>()

const props = withDefaults(defineProps<ScheduleDrawerProps>(), {
  drawerUsageMode: 'creation',
})

const loading = ref(false)
const recipientsCollection = ref<Options[]>([])
const evaluateForm = ref(false)
const loadFormIndicator = ref(false)

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

onMounted(async () => {
  try {
    loading.value = true
    const accounts = await getAccountsCollection()
    recipientsCollection.value = accountsDataTransformer(accounts)
  } catch (error) {
    console.warn(error)
  } finally {
    loading.value = false
  }
})

const triggerFormEvaluation = async () => {
  evaluateForm.value = false
  loadFormIndicator.value = true
  await nextTick()
  evaluateForm.value = true
  loadFormIndicator.value = false
}

const sendReminder = async (schedule: Schedule) => {
  try {
    loadFormIndicator.value = true
    await postSchedule(schedule)
    isDrawerOpened.value = false
  } catch (error) {
    console.warn(error)
  } finally {
    loadFormIndicator.value = false
  }
}
</script>

<i18n lang="yaml">
  en-US:
    new-schedule: 'New schedule'
    send-reminder: 'Send Reminder'
  fr-FR:
    new-schedule: 'Nouveau rappel'
    send-reminder: 'Envoyer le rappel'
</i18n>
