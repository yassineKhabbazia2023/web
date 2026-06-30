<template>
  <div
    class="
      signature-step
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
      Top-right actions for the signing frame. "Open in a new tab" stays available even when blocked:
      GetAccept may refuse to be framed (X-Frame-Options / CSP), leaving the iframe blank. "Reload"
      re-mounts the frame when GetAccept freezes, instead of the browser's right-click "reload frame".
    -->
    <div
      class="
        flex
        flex--justify-content-flex-end
        flex-gap--2
      "
    >
      <PButton
        pTag="a"
        :href="signatureUrl"
        target="_blank"
        rel="noopener noreferrer"
        pType="tertiary"
        pSize="small"
      >
        <PIcon
          class="el-button__icon--left"
          pName="link45deg"
        />
        {{ t(`${I18N}.openInNewTab`) }}
      </PButton>
      <PButton
        v-if="isIframeBlocked === false"
        pType="tertiary"
        pSize="small"
        @click="reloadIframe"
      >
        <PIcon
          class="el-button__icon--left"
          pName="arrowRepeat"
        />
        {{ t(`${I18N}.reload`) }}
      </PButton>
    </div>

    <div
      v-if="isIframeBlocked === false"
      class="signature-step__iframe-container border-radius--4"
    >
      <iframe
        :key="reloadKey"
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
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PButton, PIcon } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE } from '../../../../payment.consts'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer.signature`

const { t } = useI18n()

defineProps<{ signatureUrl: string }>()

const emit = defineEmits<{
  'iframe-load': []
}>()

const isIframeBlocked = ref(false)

// Bumped to force-remount the iframe when GetAccept hangs (see reloadIframe).
const reloadKey = ref(0)

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

// GetAccept occasionally freezes inside the signing frame; bumping :key remounts the iframe into a
// fresh browsing context, reloading the flow without reopening the drawer. We can't just call
// contentWindow.location.reload() — GetAccept is cross-origin, so that throws a SecurityError.
const reloadIframe = (): void => {
  reloadKey.value += 1
}

onBeforeUnmount(() => {
  // The drawer can close during the 500ms window; don't emit after teardown.
  clearTimeout(iframeLoadTimer)
})
</script>

<style scoped>
/* Fill the drawer body (a flex column, see payment-configuration-drawer) so the iframe is the
   dominant scroll surface — otherwise the short iframe let the drawer body and the page behind
   scroll-chain instead of the signing document. The ancestors keep their default min-height (auto)
   so that, on short screens, the drawer body scrolls instead of squishing the iframe below its floor. */
.signature-step {
  flex: 1;
}

.signature-step__iframe-container {
  flex: 1;
  /* The iframe grows to fill the drawer but never shrinks below a usable signing height. */
  min-height: 350px;
  overflow: hidden;
  /* Keep wheel events from chaining out of the iframe to the page behind the drawer. */
  overscroll-behavior: contain;
  border: 1px solid var(--p-stroke-neutral);
}

.signature-step__iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
