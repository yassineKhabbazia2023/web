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
      :defaultCreateDate="defaultCreateDate"
      :recipientsCollection="recipientsCollection"
      :frequenciesCollection="frequenciesCollection"
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
        @click="triggerFormEvaluation"
      >
        {{ t('send-reminder') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import type { Schedule } from '@app/schedule/components/CreateSchedule/CreateScheduleForm/CreateScheduleFormModel'
import { getAccountsCollection, postSchedule, getFrequenciesCollection } from '@app/schedule/services'
import {
  PButton,
  PDrawer,
  PLoader,
} from '@pulse/styleguide/components'
import type { POptionProps } from '@pulse/styleguide/types'
import { useI18n } from 'vue-i18n'
import type { ScheduleDrawerProps } from './ScheduleDrawerTypes'
import CreateScheduleForm from '@app/schedule/components/CreateSchedule/CreateScheduleForm'
import { accountsDataTransformer } from '@app/schedule/helpers/utils'
import { amplitudeService } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{ 'update:modelValue' : [value: boolean] }>()

const props = withDefaults(defineProps<ScheduleDrawerProps>(), {
  drawerUsageMode: 'creation',
})

const loading = ref(false)
const recipientsCollection = ref<POptionProps[]>([])
const frequenciesCollection = ref<string[]>([])

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
    const [accounts, frequency] = await Promise.all([getAccountsCollection(), getFrequenciesCollection()])
    recipientsCollection.value = accountsDataTransformer(accounts)
    frequenciesCollection.value = frequency
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
  let createdSuccessfully = false
  try {
    loading.value = true
    loadFormIndicator.value = true
    await postSchedule(schedule)
    isDrawerOpened.value = false
    createdSuccessfully = true
  } catch (error) {
    console.warn(error)
  } finally {
    amplitudeService.track('Reminder Add Completed', {
      reminder_add_type: schedule.template.typeShort,
      reminder_add_recipient: schedule.targets.length === 1 ? '1' : 'many',
      reminder_add_file_attached: schedule.attachment ? 'true' : 'false',
      reminder_add_result: createdSuccessfully ? 'succeeded' : 'failed',
    })
    loading.value = false
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
