<template>
  <div
    class="
      booking-share-link
      bg--gray-50
      padding--4
    "
  >
    <div
      class="
        flex
        flex--align-items-flex-start
        flex-gap--3
        margin-bottom--4
      "
    >
      <PIcon
        pName="envelopeDuotone"
        pSize="24px"
      />
      <div class="flex--grow-1">
        <h3
          class="
            font-size--16
            font-semibold
            text-color--ink-500
            margin-bottom--1
          "
        >
          {{ t('booking-confirmation.share-link.title') }}
        </h3>
        <p class="text-color--ink-400">
          {{ t('booking-confirmation.share-link.description') }}
        </p>
      </div>
    </div>
    <div class="flex margin-y--3">
      <PInput
        v-model="localBookingUrl"
        pReadonly
        class="flex--grow-1 margin-right--3"
      />
      <PButton
        :pType="copyButtonType"
        :class="{ 'copy-button--copied': isCopied }"
        @click="copyToClipboard"
      >
        <PIcon
          :pName="copyIconName"
          pSize="16px"
          class="margin-right--3"
        />
        {{ copyButtonText }}
      </PButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PInput } from '@pulse/styleguide/components'
import type { BookingShareLinkProps } from './booking-confirmation.types'
import { COPY_FEEDBACK_TIMEOUT_MS } from '@booking/constants'

const props = defineProps<BookingShareLinkProps>()

const { t } = useI18n({ useScope: 'global' })

const localBookingUrl = toRef(props, 'bookingUrl')
const isCopied = ref(false)

const copyButtonType = computed(() => isCopied.value ? 'secondary' : 'primary')
const copyIconName = computed(() => isCopied.value ? 'check' : 'files')
const copyButtonText = computed(() => {
  return isCopied.value
    ? t('booking-confirmation.share-link.copied')
    : t('booking-confirmation.share-link.copy-button')
})

function showCopyFeedback() {
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, COPY_FEEDBACK_TIMEOUT_MS)
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.bookingUrl)
  showCopyFeedback()
}
</script>

<style scoped>
.booking-share-link {
  border: 1px solid var(--p-ink-200);
  border-radius: var(--p-radius-2);
}

.copy-button--copied {
  animation: scale-pop 0.3s ease-out;
}
</style>
