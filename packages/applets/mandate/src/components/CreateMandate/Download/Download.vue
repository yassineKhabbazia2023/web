<template>
  <div class="download-or-wait-mandate">
    <!-- Not using a ternary or computed on pName because once an image is loaded you can't change it -->
    <div class="download-or-wait-mandate__illustration margin-bottom--6 margin-x--auto">
      <Transition>
        <PImage
          v-if="isTrackedMandateAvailable"
          pType="paupulse"
          pName="ok"
          pFit="contain"
          data-testid="availaible-illustration"
        />
        <PImage
          v-else
          pType="paupulse"
          pName="time"
          pFit="contain"
          data-testid="wait-illustration"
        />
      </Transition>
    </div>

    <h4
      class="
        download-or-wait-mandate__title
        font-semibold
        flex flex--align-items-center flex--justify-content-center
        margin-bottom--2
      "
    >
      <span
        v-if="!isTrackedMandateAvailable"
        class="
          flex flex--align-items-center flex--justify-content-center
          padding-right--2
        "
      >
        <PLoader pType="primary" />
      </span>
      {{ title }}
    </h4>

    <div class="download-or-wait-mandate__body margin-bottom--6 font-normal">
      <template v-if="isTrackedMandateAvailable">
        <p>
          {{ t('download') }} <span class="font-semibold">
            {{ t('manual-sign') }}
          </span>
        </p>
        <p>{{ t('deposit') }}</p>
      </template>

      <template v-else>
        {{ t('keep-open-or-close') }}
      </template>
    </div>

    <Transition>
      <PFileCard
        v-if="isTrackedMandateAvailable"
        :pName="`unsigned-mandate-${mandateId}.pdf`"
        pFormat="PDF"
        pSize=""
        pHasIcon
        pHasButton
        class="download-or-wait-mandate__file-card margin-x--6 margin-bottom--4"
      >
        <template #icon>
          <PIcon pName="filetypePdf" />
        </template>
        <template #buttons>
          <PButton
            pType="white"
            pSize="default"
            data-testid="download-prefilled-mandate"
            @click="downloadMandate()"
          >
            <PIcon pName="download" />
          </PButton>
        </template>
      </PFileCard>
    </Transition>

    <div class="flex">
      <PAlert class="download-or-wait-mandate__file-card margin-x--6 margin-bottom--4">
        <p class="download-or-wait-mandate__alert-title font-semibold">
          {{ t('help') }}
        </p>
        <p class="download-or-wait-mandate__alert-body font-normal">
          {{ t('help-label-prefix') }}
          <a
            href="https://help.collaborateurs.app.rydge.fr/fr/article/mandat-parcours-et-creation"
            class="download-or-wait-mandate__alert-body--color"
          >{{ t('help-label-link') }}
          </a>
          {{ t('help-label-suffix') }}
        </p>
      </PAlert>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { logger } from '@pulse/core'
import { useI18n } from 'vue-i18n'
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue'
import {
  PAlert,
  PButton,
  PFileCard,
  PIcon,
  PImage,
  PLoader,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import { downloadUnsignedMandate, getMandateAvailability } from '@mandate/services/mandate'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'
import { showNotification } from '@mandate/helpers/NotificationHelper'
import type { NotificationMessagesByType } from '@mandate/helpers/NotificationHelperTypes'
import type { DownloadProps } from './DownloadTypes'
import { mandateAvailabilityCheckStatuses } from '@mandate/constants/mandateStatuses'

const props = defineProps<DownloadProps>()
const emit = defineEmits<{
  'close-drawer': [void]
}>()

/* #region Mandate status tracking */
const trackedMandateState = ref(mandateAvailabilityCheckStatuses.NOT_AVAILABLE)

const availabilityTrackerIntervalId = ref<ReturnType<typeof setInterval>>()

const isTrackedMandateAvailable = computed(
  () => trackedMandateState.value === mandateAvailabilityCheckStatuses.AVAILABLE,
)

const isTrackedMandateNotAvailable = computed(
  () => trackedMandateState.value === mandateAvailabilityCheckStatuses.NOT_AVAILABLE,
)

const isTrackedMandateErrored = computed(
  () => trackedMandateState.value === mandateAvailabilityCheckStatuses.ERRORED,
)

onBeforeMount(async () => {
  try {
    trackedMandateState.value = await getMandateAvailability(props.mandateId)
  } catch (error) {
    logger.error(error)
  }

  if (isTrackedMandateAvailable.value) {
    return
  }
  if (isTrackedMandateNotAvailable.value) {
    availabilityTrackerIntervalId.value = setInterval(() => {
      trackMandateStatus()
    }, 10000)
  }
  if (isTrackedMandateErrored.value) {
    handleErroredMandate()
  }
})

onBeforeUnmount(() => {
  clearInterval(availabilityTrackerIntervalId.value)
})

function resetInterval() {
  clearInterval(availabilityTrackerIntervalId.value)
  availabilityTrackerIntervalId.value = undefined
}

async function trackMandateStatus() {
  try {
    trackedMandateState.value = await getMandateAvailability(props.mandateId)
    if (isTrackedMandateAvailable.value) {
      resetInterval()
    }
    if (isTrackedMandateErrored.value) {
      handleErroredMandate()
      resetInterval()
    }
  } catch (error) {
    logger.error('Mandate status tracking is not available')
  }
}

function handleErroredMandate() {
  displayErrorStatusNotification()
  emit('close-drawer')
}

function displayErrorStatusNotification() {
  PNotification({
    message: t('notification.technical-error'),
    iconName: 'exclamationTriangle',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}
/* #endregion */

const title = computed(() => isTrackedMandateAvailable.value
  ? t('generated-mandate')
  : t('creating-mandate'))

const downloadMandate = async () => {
  const messages: NotificationMessagesByType = {
    downloading: t('notification.downloading'),
    error: t('notification.downloading-error'),
  }
  const notification = showNotification(messages, 'downloading', false)
  try {
    const { data } = await downloadUnsignedMandate(props.mandateId)
    if ('showSaveFilePicker' in window) {
      try {
        await saveFileAs(props.mandateId, data, 'unsigned')
      } catch (error) {
        if (error instanceof Error && error.message !== 'The user aborted a request.') {
          downloadFile(`unsigned-mandate-${props.mandateId}.pdf`, data, window)
        }
      }
    } else {
      downloadFile(`unsigned-mandate-${props.mandateId}.pdf`, data, window)
    }
  } catch (error) {
    logger.error('Error downloading file:', error)
    showNotification(messages, 'error', true, notification)
  } finally {
    notification.close()
  }
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

</script>

<style lang="scss" scoped>
// Transitions for waiting / ok illustrations and download card
.v-enter-active {
  transition: opacity 0.3s ease;
  transition-delay: 0.3s;
}

.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.download-or-wait-mandate {
  &__illustration {
    display: block;
    width: 316px;
    height: 320px;
  }
  &__title {
    color: var(--el-color-neutral-gray-900);
    text-align: center;
    font-size: 2.1rem;
    font-style: normal;
    line-height: 120%;
  }
  &__body {
    width: 72%;
    margin: 0 auto;
    text-align: center;
    color: var(--el-color-neutral-gray-900);
    font-style: normal;
    line-height: 140%;
  }
  &__button {
    display: flex;
    justify-content: center;
  }
  &__alert-title {
    font-style: normal;
    line-height: 140%;
  }
  &__alert-body {
    color: var(--pulse-color-neutral-gray-700);
    font-style: normal;
    line-height: 140%;
    &--color {
      color: var(--el-color-primary);
    }
  }
}
</style>
<i18n lang="yaml">
  en-US:
    creating-mandate: 'The mandate is being created !'
    keep-open-or-close: >
      You have the option to keep this window open on your screen, or if you prefer,
      you can close it and refer to the mandate page later to retrieve the mandate.
    generated-mandate: 'The mandate is generated !'
    manual-sign: 'manual sign.'
    download: 'Download the mandate for'
    deposit: 'Once signed, upload the mandate to Rydge to activate the collection.'
    help: 'Need help?'
    help-label-prefix: 'Consult the '
    help-label-link: 'practical guide'
    help-label-suffix: ' to ensure that the collection is active'
    notification:
      downloading: 'The download is in preparation'
      downloading-error: 'There was an error during preparation'
      technical-error: 'A technical issue has occurred, please try again later'
  fr-FR:
    creating-mandate: 'Le mandat est en cours de création.'
    keep-open-or-close: >
      Vous avez le choix de garder cette fenêtre ouverte sur votre écran,
      ou si vous le préférez, vous pouvez la fermer et consulter la page mandat ultérieurement pour récupérer le mandat
    generated-mandate: 'Le mandat est généré !'
    manual-sign: 'signature manuscrite.'
    download: 'Téléchargez dès maintenant le mandat pour'
    deposit: 'Une fois signé, déposez le mandat sur Rydge pour activer la collecte.'
    help: "Besoin d'aide ?"
    help-label-prefix: 'Consultez le '
    help-label-link: 'guide pratique'
    help-label-suffix: " pour garantir l'activation de la collecte"
    notification:
      downloading: 'Le téléchargement est en cours de préparation'
      downloading-error: "Il y'a eu une erreur lors de la préparation"
      technical-error: "Un incident technique est survenu, merci de réessayer ultérieurement."
</i18n>
