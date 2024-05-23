<template>
  <PForm
    ref="createScheduleFormRef"
    :pModel="createScheduleForm"
    pHideRequiredAsterisk
    pLabelPosition="top"
    :pRules="rules"
    class="create-schedule-form font-small"
  >
    <PFormItem pProp="reminder" :pLabel="t('reminder')">
      <DropdownSchedule
        v-model="createScheduleForm.reminder"
        :schedulesCollection="scheduleModels"
      />
    </PFormItem>
    <PFormItem pProp="recipients" :pLabel="t('recipients')">
      <DropdownMultiSelectWithToggleAll
        v-model="createScheduleForm.recipients"
        :optionsCollection="recipientsCollection"
      />
    </PFormItem>
    <PRow
      :pGutter="16"
      class="margin-bottom--0"
    >
      <PCol
        :pSpan="12"
      >
        <PFormItem pProp="date" :pLabel="t('date')">
          <PDatePicker
            v-model="createScheduleForm.date"
            pPlaceholder="JJ/MM/AAAA"
            pFormat="DD/MM/YYYY"
          />
        </PFormItem>
      </PCol>
      <PCol :pSpan="12">
        <PFormItem pProp="frequency" :pLabel="t('frequency')">
          <PDropdown
            v-model="createScheduleForm.frequency"
            :pOptions="frequenciesOptionsFormatted"
          />
        </PFormItem>
      </PCol>
    </PRow>
    <PAlert
      v-if="showMonthlyAlert"
      pType="warning"
      class="margin-bottom--4"
    >
      <template #bold-text>
        {{t('Warning')}}
      </template> {{ monthyWarning(createScheduleForm.date.getDate()) }}
    </PAlert>
    <PFormItem
      pProp="description"
      inline
      disabled
    >
      <div class="font-small">
        <span class="create-schedule-form__optional-title font-semibold">
          {{ t('description') }}
        </span>
        <span class="create-schedule-form__optional">
          {{ t('optional') }}
        </span>
      </div>
      <PInput
        v-model="createScheduleForm.description"
        pType="textarea"
        :pPlaceholder= "t('descripitionPlaceholder')"
        :pAutosize="{ minRows: 6, maxRows: 8 }"
      />
    </PFormItem>
  </PForm>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, onMounted, computed } from 'vue'
import {
  PForm,
  PFormItem,
  PDatePicker,
  PCol,
  PRow,
  PInput,
  PAlert,
  PDropdown,
} from '@kpmg/styleguide'
import DropdownSchedule from '@/schedule/components/CreateSchedule/DropdownSchedule'
import type { FormProps } from './CreateScheduleFormTypes'
import type { Schedule, Frequency } from './CreateScheduleFormModel'
import DropdownMultiSelectWithToggleAll from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll'
import { dateISOFormatter } from '@/schedule/helpers/utils'
import { getScheduleModels } from '@/schedule/services'
import { TEMPLATE_TYPE_SHORT_OTHER } from '@/schedule/helpers/scheduleConsts'

// i18n
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<FormProps>()

// Emits
const emit = defineEmits<{
  'update-schedule-model': [scheduleModel: Schedule]
}>()

const scheduleModels = getScheduleModels('both')

// Reactive state
const createScheduleFormRef = ref<any>()
const createScheduleForm = reactive({
  reminder: '',
  recipients: [],
  date: new Date(),
  description: '',
  frequency: 'None',
})

const scheduleModel: Schedule = {
  template: {
    typeShort: '',
  },
  targets: [],
  reminders: [],
  scheduling: {
    date: '',
    time: '',
    frequency: 'None',
  },
  description: '',
  isDraft: false,
  isPrivate: false,
}

const showMonthlyAlert = computed(() =>
  createScheduleForm.frequency === 'Monthly' && createScheduleForm.date.getDate() >= 29)

const frequenciesOptionsFormatted = computed(() => {
  const frequencyMap: Record<string, string> = {
    None: t('None'),
    Monthly: t('Monthly'),
  }
  return props.frequenciesCollection.map((key: string) => ({
    pValue: key,
    pLabel: frequencyMap[key],
  }))
})

// Utility functions
const createRule = (message: string, trigger = 'change') => ({
  required: true,
  message,
  trigger,
})

// Validation rules
const rules = reactive<any>({
  reminder: [
    createRule(t('form.error.requiredField')),
  ],
  date: [createRule(t('form.error.requiredField'))],
  recipients: [createRule(t('form.error.requiredField'))],
})

watch(() => props.checkValidity, (value: boolean) => value && evaluateForm())

const evaluateForm = () => {
  createScheduleFormRef?.value?.validate((isValid: boolean) => {
    if (isValid) {
      scheduleModel.template = reminderBuilder(createScheduleForm.reminder)
      scheduleModel.targets = createScheduleForm.recipients
      scheduleModel.scheduling.date = dateISOFormatter(createScheduleForm.date)
      scheduleModel.description = createScheduleForm.description
      scheduleModel.scheduling.frequency = createScheduleForm.frequency as Frequency
      scheduleModel.reminders = []
      emit('update-schedule-model', scheduleModel)
    }
  })
}

const reminderBuilder = (reminder: string): Schedule['template'] => {
  const isInReferential = scheduleModels.some(({ key }) => key === reminder)

  if (isInReferential) {
    return { typeShort: reminder }
  }

  return {
    typeShort: TEMPLATE_TYPE_SHORT_OTHER,
    typeLong: reminder,
  }
}
onMounted(() => {
  if (props.defaultCreateDate) {
    createScheduleForm.date = props.defaultCreateDate
  }
})

const monthyWarning = (frequencyDate: number) =>
  // eslint-disable-next-line max-len
  `Certains mois contiennent moins de ${frequencyDate} jours. Pour ces mois, l'occurrence sera créée le dernier jour du mois.`
</script>

<style lang="scss" scoped>
.create-schedule-form {
  &__optional-title {
    line-height: 120%;
    color: var(--el-color-neutral-gray-900);
  }

  &__optional {
    line-height: 120%;
    color: var(--el-color-neutral-gray-500);
  }
}
</style>

<i18n lang="json">{
  "en-US": {
    "reminder": "Reminder title",
    "recipients": "Recipient(s)",
    "date": "Date",
    "description": "Description",
    "optional": " (optional)",
    "descripitionPlaceholder":
    "List the expected items to carry out the reminder (documents, information...)",
    "form": {
      "error": {
        "requiredField": "Required field"
      }
    },
    "frequency": "Frequency",
    "None": "None",
    "Monthly": "Monthly",
    "Warning": "Warning !"
  },
  "fr-FR": {
    "reminder": "Titre du rappel",
    "recipients": "Destinataire(s)",
    "date": "Date",
    "description": "Description",
    "optional": " (facultatif)",
    "descripitionPlaceholder":
    "Listez les éléments attendus pour réaliser le rappel (documents, informations...)",
    "form": {
      "error": {
        "requiredField": "Champ obligatoire"
      }
    },
    "frequency": "Périodicité",
    "None": "Ne se répète pas",
    "Monthly": "Tous les mois",
    "Warning": "Attention !"
  }
}</i18n>
