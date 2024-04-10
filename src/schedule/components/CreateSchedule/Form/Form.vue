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
    <PRow :pGutter="16">
      <PCol :pSpan="12">
        <PFormItem pProp="date" :pLabel="t('date')">
          <PDatePicker
            v-model="createScheduleForm.date"
            pPlaceholder="JJ/MM/AAAA"
            pFormat="DD/MM/YYYY"
          />
        </PFormItem>
      </PCol>
      <PCol :pSpan="12">
      </PCol>
    </PRow>
    <PFormItem
      pProp="description"
      inline
      disabled
    >
      <div class="font-small">
        <span class="create-schedule-form__optional-title font-semibold">{{ t('description') }}
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
import { ref, reactive, watch } from 'vue'
import {
  PForm,
  PFormItem,
  PDatePicker,
  PCol,
  PRow,
  PInput,
} from '@kpmg/styleguide'
import DropdownSchedule from '@/schedule/components/CreateSchedule/DropdownSchedule'
import type { FormProps } from './FormTypes.ts'
import type { Schedule } from './CreateScheduleFormModel.ts'
import DropdownMultiSelectWithToggleAll from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll'
import { dateISOFormatter } from '@/schedule/helpers/utils'
import { getScheduleModels } from '@/schedule/services'

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
  date: '',
  description: '',
})

const scheduleModel: Schedule = {
  template: {
    typeShort: '',
  },
  targets: [],
  scheduling: {
    date: '',
    time: '',
    frequency: 'None',
  },
  description: '',
  isDraft: false,
  isPrivate: false,
}

// Utility functions
const createRule = (message: string, trigger = 'change') => ({
  required: true,
  message: t(message),
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
    typeShort: 'autre',
    typeLong: reminder,
  }
}
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
    "optional": "optional",
    "descripitionPlaceholder":
    "List the expected items to carry out the reminder (documents, information...)",
    "form": {
      "error": {
        "requiredField": "Required field"
      }
    }
  },
  "fr-FR": {
    "reminder": "Titre du rappel",
    "recipients": "Destinataire(s)",
    "date": "Date",
    "description": "Description",
    "optional": "facultatif",
    "descripitionPlaceholder":
    "Listez les éléments attendus pour réaliser le rappel (documents, informations...)",
    "form": {
      "error": {
        "requiredField": "Champ obligatoire"
      }
    }
  }
}</i18n>
