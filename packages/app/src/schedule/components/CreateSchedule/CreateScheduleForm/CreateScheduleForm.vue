<template>
  <PForm
    ref="createScheduleFormRef"
    :pModel="createScheduleForm"
    pHideRequiredAsterisk
    pLabelPosition="top"
    :pRules="rules"
    class="create-schedule-form"
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
      v-if="showEndOfMonthDayAlert"
      pType="warning"
      class="margin-bottom--4"
    >
      <template #bold-text>
        {{t('Warning')}}
      </template> {{ monthlyWarning }}
    </PAlert>
    <CreateScheduleReminders
      v-model="reminders"
      ref="createScheduleRemindersRef"
      class="margin-bottom--4"
    />
    <PFormItem
      pProp="description"
      inline
      disabled
    >
      <div class="font-small margin-bottom--2">
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
    <PFormItem
      inline
    >
      <div class="font-small margin-bottom--2">
        <span class="create-schedule-form__optional-title font-semibold">
          {{ t('attachment') }}
        </span>
        <span class="create-schedule-form__optional">
          {{ t('optional') }}
        </span>
      </div>
      <PUpload
        :pMultiple="false"
        pDrag
        :pDisabled="!!createScheduleForm.attachment.name"
        pAccept="image/*,.pdf,.doc,.docx"
        pShowFileList
        :limit="1"
        pUploadType="file-line"
        pTextLimitSize="5MB"
        :pPrefixLabelFileLine="t('attachment-prefix-label')"
        :pSuffixLabelFileLine="t('attachment-suffix-label')"
        @files-selected="addAttachment($event)"
        @delete-file="removeAttachment"
        :beforeUpload="beforeAttachmentUpload"
      />
      <span
        v-if="attachmentErrorType"
        class="create-schedule-form__attachment-error margin-bottom--2"
        data-testid="schedule-attachment-error"
      >
        {{ labelsErrorsMap[attachmentErrorType] }}
      </span>
      <PAlert pType="information">
        {{  t('attachment-alert') }}
      </PAlert>
    </PFormItem>
  </PForm>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import {
  PForm,
  PFormItem,
  PDatePicker,
  PCol,
  PRow,
  PInput,
  PAlert,
  PDropdown,
  PUpload,
} from '@kpmg/styleguide'
import DropdownSchedule from '@app/schedule/components/CreateSchedule/DropdownSchedule'
import CreateScheduleReminders from '@app/schedule/components/CreateSchedule/CreateScheduleReminders'
import type { FormProps } from './CreateScheduleFormTypes'
import type { Schedule, Frequency } from './CreateScheduleFormModel'
import DropdownMultiSelectWithToggleAll from '@app/schedule/components/Common/DropdownMultiSelectWithToggleAll'
import { dateISOFormatter, base64ToBase64URL } from '@app/schedule/helpers/utils'
import { getScheduleModels } from '@app/schedule/services'
import { TEMPLATE_TYPE_SHORT_OTHER } from '@app/schedule/helpers/scheduleConsts'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<FormProps>()
const reminders = ref<number[]>([])

// Emits
const emit = defineEmits<{
  'update-schedule-model': [scheduleModel: Schedule]
}>()

const scheduleModels = getScheduleModels('both')

// Reactive state
const createScheduleFormRef = ref<InstanceType<typeof PForm>>()
const createScheduleRemindersRef = ref<InstanceType<typeof CreateScheduleReminders>>()
const createScheduleForm = reactive({
  reminder: '',
  recipients: [],
  date: new Date(),
  description: '',
  frequency: 'None',
  attachment: {
    name: '',
    content: '',
  },
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
  attachment: null,
}
const reader: FileReader = new FileReader()
const attachmentErrorType = ref<'extension' | 'size' | ''>('')

const showEndOfMonthDayAlert = computed(() =>
  createScheduleForm.date?.getDate() >= 29 &&
(createScheduleForm.frequency === 'Monthly' || createScheduleForm.frequency === 'Quarterly'))

const frequenciesOptionsFormatted = computed(() => {
  const frequencyMap: Record<string, string> = {
    None: t('None'),
    Monthly: t('Monthly'),
    Quarterly: t('Quarterly'),
    Yearly: t('Yearly'),
  }
  return props.frequenciesCollection.map((key: string) => ({
    pValue: key,
    pLabel: frequencyMap[key],
  }))
})

const monthlyWarning = computed(() =>
  // eslint-disable-next-line max-len
  `Certains mois contiennent moins de ${createScheduleForm.date.getDate()} jours. Pour ces mois, l'occurrence sera créée le dernier jour du mois.`,
)

const labelsErrorsMap: Record<'extension' | 'size', string> = {
  extension: t('file-not-allowed'),
  size: t('size-exceed'),
}

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
  createScheduleFormRef.value?.validate((isValid: boolean) => {
    const isCreateScheduleRemindersValid = createScheduleRemindersRef.value?.getIsValid()
    if (isValid && isCreateScheduleRemindersValid) {
      scheduleModel.template = reminderBuilder(createScheduleForm.reminder)
      scheduleModel.targets = createScheduleForm.recipients
      scheduleModel.scheduling.date = dateISOFormatter(createScheduleForm.date)
      scheduleModel.description = createScheduleForm.description
      scheduleModel.scheduling.frequency = createScheduleForm.frequency as Frequency
      scheduleModel.reminders = reminders.value
      scheduleModel.attachment = createScheduleForm.attachment.name ? createScheduleForm.attachment : null
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

onBeforeUnmount(() => {
  reader.removeEventListener('load', () => {})
})

const addAttachment = (file: File[]) => {
  reader.addEventListener(
    'load',
    () => {
      createScheduleForm.attachment = {
        name: file[0].name,
        content: base64ToBase64URL((reader.result as string)?.split(',')[1]),
      }
    },
    false,
  )
  reader.readAsDataURL(file[0])
}

const beforeAttachmentUpload = (attachment: File) => {
  const allowedExtensions = [
    'application/pdf', 'image/png',
    'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!allowedExtensions.includes(attachment.type)) {
    attachmentErrorType.value = 'extension'
    return false
  }
  if ((attachment.size / (1024 * 1024)) > 5) {
    attachmentErrorType.value = 'size'
    return false
  }
  attachmentErrorType.value = ''
  return true
}

const removeAttachment = () => {
  createScheduleForm.attachment = {
    name: '',
    content: '',
  }
}

defineExpose({
  beforeAttachmentUpload,
})

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
  &__attachment-error {
    color: var(--el-color-danger);
    font-size: 12px;
    line-height: 1;
  }
  :deep(.el-form-item__content) {
    line-height: inherit;
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
    "Quarterly": "Quarterly",
    "Yearly": "Yearly",
    "Warning": "Warning !",
    "attachment": "Attachment",
    "size-exceed": "The maximum authorised size is 5Mb. Please resize your attachment.",
    "file-not-allowed": "This type of file format is not supported.",
    "attachment-alert": "Only the following file types are authorised: .jpg, .jpeg, .png, .doc and .docx",
    "attachment-prefix-label": "Drop the file or",
    "attachment-suffix-label": "browse the computer"
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
    "Quarterly": "Tous les trimestres",
    "Yearly": "Tous les ans",
    "Warning": "Attention !",
    "attachment": "Pièce jointe",
    "size-exceed": "Le poids maximal autorisé est de 5Mb. Veuillez redimensionner votre pièce jointe.",
    "file-not-allowed": "Ce type de format de fichier n'est pas supporté.",
    "attachment-alert": "Seuls les types de fichiers suivants sont autorisés : .jpg, .jpeg, .png, .doc et .docx.",
    "attachment-prefix-label": "Déposer le fichier ou",
    "attachment-suffix-label": "parcourir l'ordinateur"
  }
}</i18n>
