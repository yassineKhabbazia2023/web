<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--4
    "
  >
    <p
      class="
        margin--0
        font-size--16
        font-bold
      "
    >
      {{ t(`${I18N}.title`) }}
    </p>

    <p class="margin--0 font-size--14">
      {{ t(`${I18N}.description`) }}
    </p>

    <!--
      The signing URL is served by GetAccept; if it refuses to be framed
      (X-Frame-Options / CSP), the iframe stays blank, so a fallback link to
      open the signature in a new tab is always offered below.
    -->
    <div
      v-if="isIframeBlocked === false"
      class="signature-step__iframe-container border-radius--4"
    >
      <iframe
        :src="signatureUrl"
        :title="t(`${I18N}.iframeTitle`)"
        class="signature-step__iframe"
        allow="camera; microphone"
        @load="onIframeLoad"
        @error="onIframeError"
      />
    </div>

    <PAlert
      v-else
      pType="warning"
    >
      {{ t(`${I18N}.blockedWarning`) }}
    </PAlert>

    <PAlert pType="warning">
      {{ t(`${I18N}.directDebitAuthorization`) }}
    </PAlert>

    <a
      :href="signatureUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="
        signature-step__fallback-link
        font-size--14
        font-semibold
      "
    >
      {{ t(`${I18N}.openInNewTab`) }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE } from '../../../../payment.consts'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer.signature`

const { t } = useI18n()

defineProps<{ signatureUrl: string }>()

const emit = defineEmits<{
  'iframe-load': []
}>()

const isIframeBlocked = ref(false)

const onIframeError = (): void => {
  isIframeBlocked.value = true
}

let iframeLoadTimer: ReturnType<typeof setTimeout> | undefined

// We cannot read the cross-origin iframe URL, but every navigation fires a load event. The drawer
// uses each one as an opportunity to re-check whether the mandate has just been signed.
const onIframeLoad = (): void => {
  // Each navigation reschedules a single check; clearing first avoids stacking timers.
  clearTimeout(iframeLoadTimer)
  iframeLoadTimer = setTimeout(() => {
    emit('iframe-load')
  }, 500)
}

onBeforeUnmount(() => {
  // The drawer can close during the 500ms window; don't emit after teardown.
  clearTimeout(iframeLoadTimer)
})
</script>

<style scoped>
.signature-step__iframe-container {
  overflow: hidden;
  border: 1px solid var(--p-stroke-neutral);
}

.signature-step__iframe {
  width: 100%;
  height: 50vh;
  border: none;
}
</style>
