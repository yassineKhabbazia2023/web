<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="shortLabel"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    pSuffixUnderTitle
    @close-drawer-button="isDrawerOpened = false"
  >
    <template
      v-if="occurrence"
      #header-prefix
    >
      <Tag :status="occurrence?.globalStatus" />
    </template>

    <template
      v-if="longLabel"
      #header-suffix
    >
      <p
        class="text-color--neutral-gray-700"
        data-testid="occurrence-drawer-long-label"
      >
        {{ longLabel }}
      </p>
    </template>

    <div
      v-if="isLoading"
      class="
        occurrence-drawer__loader
        flex
        flex--justify-content-center
      "
    >
      <PLoader pType="primary" pSize="32" />
    </div>
    <PForm
      v-if="occurrence"
      pLabelPosition="top"
      class="margin-bottom--6"
    >
      <p class="flex flex--align-items-center">
        <PIcon pName="calendarEvent" />
        <span
          class="
            padding-left--2
            text-color--neutral-gray-900
            occurrence-drawer__occurrence-date
          "
          data-testid="occurrence-drawer-occurrence-date"
        >
          {{ occurrenceDate }}
        </span>

        <span
          v-if="frequencyLabel"
          class="
            padding-left--2
            text-color--neutral-gray-500
          "
          data-testid="occurrence-drawer-frequency-label"
        >
          {{ frequencyLabel }}
        </span>
      </p>
      <DeadlineReminders
        v-if="isCollab"
        :reminders="occurrence.schedule.reminders ?? []"
      />
      <DeadlineAccounts
        :title="t('deadlineAccounts')"
        :deadlineAccounts="occurrence.accountList"
        class="margin-top--6"
        @toggle-status="onToggleDeadlineAccountStatus"
      />
      <PAlert
        v-if="isNoteAlertShown && !isCollab"
        pClosable
        pIconName="arrowHere"
        @close="setAlertVisibility"
      >
        <template #bold-text>
          {{ t('check') }}
        </template> {{ t('reminderCollabNote') }}
      </PAlert>
      <StringField
        v-if="occurrence?.schedule?.description"
        :modelValue="occurrence.schedule.description"
        pFieldKey="description"
        pFieldType="input"
        pType="textarea"
        :pLabel="t('description')"
        pDisabled
        pAutosize
        class="margin-top--6"
        data-testid="occurrence-drawer-description"
      />
      <template v-if="occurrence.schedule.attachment?.name">
        <div class="font-small margin-bottom--2">
          <span class="create-schedule-form__optional-title font-semibold">
            {{ t('attachment') }}
          </span>
        </div>
        <PFileCard
          class="margin-bottom--2"
          pHasButton
          pHasIcon
          :pName="occurrence.schedule.attachment.name"
          :pSize="fileSize"
          :pFormat="fileFormat"
        >
          <template #buttons>
            <PButton
              pType="white"
              pPlain
              pSize="default"
              data-testid="occurrence-drawer-attachment-download"
              pIconOnly
              @click="downloadAttachment(occurrenceId, occurrence.schedule.attachment.name)"
            >
              <PIcon pName="download" />
            </PButton>
          </template>
        </PFileCard>
      </template>
      <p
        class="
          margin-top--6
          font-semibold
          font-small
        "
        data-testid="occurrence-drawer-created-by"
      >
        <span class="text-color--neutral-gray-900">
          {{ t('createdBy') }}
        </span>
        <span class="margin-left--1 text-color--persian-500">
          {{ createdByLabel }}
        </span>
      </p>
    </PForm>

    <template
      v-if="false && occurrence && isCollab"
      #footer
    >
      <div
        class="flex flex-align--start"
      >
        <PButton
          pType="danger"
          pPlain
          pSize="default"
          data-testid="occurrence-drawer-delete"
        >
          {{ t('delete') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  getOccurrence, getScheduleModelsByKey, postDeadlineAccountStatus,
  getOccurrenceAttachment,
} from '@app/schedule/services'
import {
  PButton,
  PDrawer,
  PLoader,
  PIcon,
  PForm,
  PField,
  PAlert,
  PFileCard,
} from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { OccurrenceDrawerProps } from './OccurrenceDrawerTypes'
import type { Occurrence, Status } from '@app/schedule/models/Deadline'
import Tag from '@app/schedule/components/Common/Tag'
import DeadlineAccounts from '@app/schedule/components/DeadlineAccounts'
import DeadlineReminders from '@app/schedule/components/DeadlineReminders'
import { downloadFile, saveFileAs, fileSizeHumanFormatter } from '@app/schedule/helpers/utils'
import { getFileExtension , logger } from '@pulse/core'
import {
  getFrequencyLabel,
  getCreatedByLabel,
  getShortLabel,
  getLongLabel,
  getNewStatus,
} from './OccurrenceDrawerHelper'
import { datetimeFormats } from '@app/schedule/helpers/scheduleConsts'
import { showNotification } from '@app/schedule/helpers/notification'
import type { NotificationType } from '@app/schedule/helpers/notificationTypes'
import { amplitudeService } from '@pulse/common'

const StringField = PField<string>

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const shortScheduleModelsByKey = ref<Record<string, string>>()
const longScheduleModelsByKey = ref<Record<string, string>>()

const emit = defineEmits<{ 'update:model-value' : [value: boolean] }>()

const props = defineProps<OccurrenceDrawerProps>()

const isLoading = ref(false)
const occurrence = ref<Occurrence>()

const frequencyLabels: Record<string, string> = {
  Monthly: t('frequency.Monthly'),
  Quarterly: t('frequency.Quarterly'),
  Yearly: t('frequency.Yearly'),
}

const isNoteAlertShown = ref(true)

const frequencyLabel = computed(() => getFrequencyLabel(frequencyLabels, occurrence.value))
const createdByLabel = computed(() => getCreatedByLabel(occurrence.value))
const shortLabel = computed(() => getShortLabel(shortScheduleModelsByKey.value, occurrence.value))
const longLabel = computed(() => getLongLabel(longScheduleModelsByKey.value, shortLabel.value, occurrence.value))

const occurrenceDate = computed(() => {
  return occurrence.value
    ? d(new Date(occurrence.value.occurrenceDate), 'longDate')
    : ''
})

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

const fileFormat = computed(() => {
  const extension = getFileExtension(occurrence.value?.schedule?.attachment?.name)

  return extension ?? ''
})

const fileSize = computed(() =>
  occurrence.value?.schedule?.attachment?.size
    ? fileSizeHumanFormatter(occurrence.value.schedule.attachment.size)
    : '',
)

async function onToggleDeadlineAccountStatus(accountId: number, actualStatus: Status) {
  let createdSuccessfully = false
  const status = getNewStatus(actualStatus)
  try {
    isLoading.value = true
    await postDeadlineAccountStatus(props.occurrenceId, accountId, status)
    createdSuccessfully = true
  } catch (error) {
    logger.error(error)
  } finally {
    amplitudeService.track('Reminder Status Updated', {
      reminder_update_status: status.toString(),
      reminder_update_result: createdSuccessfully ? 'succeeded' : 'failed',
    })
    isLoading.value = false
  }
  await refreshOccurrence()
}

async function refreshOccurrence() {
  try {
    isLoading.value = true
    shortScheduleModelsByKey.value = getScheduleModelsByKey('short')
    longScheduleModelsByKey.value = getScheduleModelsByKey('long')
    occurrence.value = await getOccurrence(props.occurrenceId)
  } catch (error) {
    logger.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  shortScheduleModelsByKey.value = getScheduleModelsByKey('short')
  longScheduleModelsByKey.value = getScheduleModelsByKey('long')
  isNoteAlertShown.value = !document.cookie.split('; ').find((row) => row.startsWith('showDeadlineReminderOnce'))
  await refreshOccurrence()
})

const setAlertVisibility = () => {
  document.cookie = 'showDeadlineReminderOnce=true; SameSite=Lax;'
  isNoteAlertShown.value = false
}

const downloadAttachment = async (occurenceId: number, attachmentName: string) => {
  const messageMap: Record<NotificationType, string> = {
    success: t('notification.success'),
    error: t('notification.error'),
    downloading: t('notification.downloading'),
  }
  const notification = showNotification(messageMap, 'downloading')
  try {
    const { data } = await getOccurrenceAttachment(occurenceId,
    )
    if ('showSaveFilePicker' in window) {
      try {
        await saveFileAs(attachmentName, data)
      } catch (error) {
        if (error instanceof Error && error.message !== 'The user aborted a request.') {
          downloadFile(attachmentName, data)
        }
      }
    } else {
      downloadFile(attachmentName, data)
    }
  } catch (error) {
    logger.error('Error downloading file:', error)
    showNotification(messageMap, 'error', notification)
  } finally {
    notification.close()
  }
}

</script>

<style lang="scss" scoped>
.occurrence-drawer {
  &__loader {
    position: absolute;
    width: calc(100% - 24px);
  }

  &__occurrence-date {
    &::first-letter {
      text-transform: capitalize;
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    description: 'Description'
    createdBy: 'Created by'
    deadlineAccounts: 'Accounts'
    delete: 'Delete'
    frequency:
      Monthly: 'Monthly'
      Quarterly: "Quarterly"
      Yearly: "Yearly"
    check: 'Check here'
    reminderCollabNote: 'to let your colleague know that you have completed the required action.'
    attachment: 'Attachment'
    notification:
      downloading: 'Downloading'
      success: 'Success'
      error: 'Error'
  fr-FR:
    description: 'Description'
    createdBy: 'Créé par'
    deadlineAccounts: 'Destinataires'
    delete: 'Supprimer le rappel'
    frequency:
      Monthly: 'Tous les mois'
      Quarterly: "Tous les trimestres"
      Yearly: "Tous les ans"
    check: 'Cochez ici'
    reminderCollabNote: "pour indiquer à votre collaborateur que vous avez réalisé l’action attendue."
    attachment: 'Pièce jointe'
    notification:
      downloading: 'Téléchargement en cours ...'
      success: 'Piéce jointe téléchargée avec succès.'
      error: 'Une erreur est survenue lors du téléchargement.'
</i18n>
