<template>
  <div
    class="
      launch-card
      padding--6
      flex
      flex--direction-column
      flex-gap--2
    "
  >
    <div class="flex flex--justify-content-center margin-bottom--1">
      <PImage
        class="launch-card__image"
        data-testid="launch-card-image"
        :pType="imageType"
        :pName="imageName"
      />
    </div>

    <p
      class="text-center font-large font-bold text-color--neutral-gray-900"
      data-testid="launch-card-title"
    >
      {{ title }}
    </p>
    <p
      class="text-center flex--grow-1 margin-bottom--4 text-color--neutral-gray-700"
      data-testid="launch-card-subtitle"
    >
      {{ subtitle }}
    </p>
    <div
      class="
        flex
        flex--justify-content-center
        flex--align-items-center
      "
    >
      <PButton
        v-if="downloadLabel"
        pType="default"
        pSize="small"
        data-testid="launch-card-download"
        @click="onDownloadAction"
      >
        {{ downloadLabel }}
      </PButton>

      <PButton
        v-if="actionLabel"
        v-bind="actionButtonProps"
        pType="primary"
        pSize="small"
        data-testid="launch-card-action"
        @click="onSSOConnection"
      >
        {{ actionLabel }}
        <PIcon
          class="el-button__icon--right"
          pName="arrowRight"
        />
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { PImage, PIcon, PButton } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { LauncherFeature, LauncherTitle } from './LaunchCardTypes'
import type { LaunchCardProps } from './LaunchCardTypes'
import { AmplitudeTrackingLocation } from '@pulse/common/enums'

const emit = defineEmits<{
  'click-download': []
  'click-action': []
}>()

const props = defineProps<LaunchCardProps>()

const sanitizedActionUrl = computed(() => {
  return props.actionUrl ? sanitizeUrl(props.actionUrl) : undefined
})

const actionButtonProps = computed(() => {
  if (props.preventNavigation === true) {
    return { tag: 'button' as const }
  }
  return {
    tag: 'a' as const,
    href: sanitizedActionUrl.value,
    target: '_blank',
  }
})

const logAmplitudeEvent = (featureName: string) => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName,
    feature_consultation_localisation: AmplitudeTrackingLocation.LAUNCHER,
  })
}

const onDownloadAction = () => {
  logAmplitudeEvent(LauncherFeature.SILAE_DOWNLOAD)
  emit('click-download')
}

const onSSOConnection = () => {
  if (props.title === LauncherTitle.SILAE) {
    logAmplitudeEvent(LauncherFeature.SSO_SILAE)
  } else if (props.title === LauncherTitle.PENNYLANE) {
    logAmplitudeEvent(LauncherFeature.SSO_PENNYLANE)
  } else {
    logAmplitudeEvent(LauncherFeature.SSO_MEG)
  }
  emit('click-action')
}
</script>

<style lang="scss" scoped>
.launch-card {
  background: var(--p-gray-50);
  border-left: 5px solid var(--p-gray-50);
  border-right: 5px solid var(--p-gray-50);
  max-width: 350px;

  &:hover {
    background: var(--p-jungle-75);
    border-left-color: var(--p-jungle-400);
    border-right-color: var(--p-jungle-75);
  }

  &__image {
    height: 6rem;
    max-width: 100px;
  }
}
</style>
