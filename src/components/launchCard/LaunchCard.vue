<template>
  <div
    class="
      launch-card
      padding--6
      radius--2
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
        pType="white"
        pSize="small"
        data-testid="launch-card-download"
        @click="emit('click-download')"
      >
        {{ downloadLabel }}
      </PButton>

      <PButton
        v-if="actionLabel"
        :href="sanitizedActionUrl"
        pType="primary"
        pSize="small"
        data-testid="launch-card-action"
        tag="a"
        target="_blank"
        @click.stop="emit('click-action')"
      >
        {{ actionLabel }}
        <PIcon
          class="el-button__icon--right"
        >
          <PIArrowRight />
        </PIcon>
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { PImage, PIcon, PButton, PIArrowRight } from '@kpmg/styleguide'
import type { LaunchCardProps } from './LaunchCardTypes'

const emit = defineEmits<{
  'click-download': []
  'click-action': []
}>()

const props = defineProps<LaunchCardProps>()

const sanitizedActionUrl = computed(() => {
  return props.actionUrl
    ? sanitizeUrl(props.actionUrl)
    : undefined
})
</script>

<style lang="scss" scoped>
$shadow-color: #7090b0;

.launch-card {
  border: 1px solid var(--el-color-neutral-gray-100);

  &:hover {
    box-shadow: 0 12px 15px 0 rgba($shadow-color, 0.04),
     0 8px 8px 0 rgba($shadow-color, 0.05),
     0 4px 4px 0 rgba($shadow-color, 0.08),
     0 2px 2px 0 rgba($shadow-color, 0.05),
     0 1px 2px 0 rgba($shadow-color, 0.10);
  }

  &__image {
    height: 6rem;
  }
}
</style>
