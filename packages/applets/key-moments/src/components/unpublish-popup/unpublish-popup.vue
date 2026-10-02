<template>
  <PConfirmationPopup
    v-model:pIsVisible="isVisible"
    pAppendToBody
    :pTitle="t('keyMoments.unpublish.popup.title')"
    :pConfirmButtonContent="t('keyMoments.unpublish.popup.confirm')"
    :pCancelButtonContent="t('keyMoments.unpublish.popup.cancel')"
    :pWidth="width"
    :pTestId="testId"
    @on-confirm-button-click="emit('confirm')"
    @on-cancel-button-click="isVisible = false"
  >
    {{ message }}
  </PConfirmationPopup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PConfirmationPopup } from '@pulse/styleguide/components'
import { formatInstant } from '../../utils/date.utils'
import type { PublicationPayload } from '../../services/key-moments.service.types'

const props = defineProps<{
  /** The publication withdrawn, named in the message by its date and author */
  publication?: PublicationPayload
  width?: string
  testId: string
}>()

const emit = defineEmits<{
  confirm: []
}>()

const isVisible = defineModel<boolean>('isVisible', { required: true })

// An instant, unlike a closing date, is read in the locale of the reader
const { t, locale } = useI18n()

const message = computed(() => (props.publication === undefined
  ? ''
  : t('keyMoments.unpublish.popup.message', {
    date: formatInstant(props.publication.publishedAt, locale.value),
    author: props.publication.publishedByName,
  })))
</script>
