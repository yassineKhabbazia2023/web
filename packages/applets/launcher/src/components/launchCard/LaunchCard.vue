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
        @click="emit('click-action')"
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
import { sanitizeUrl } from '@braintree/sanitize-url'
import { PImage, PIcon, PButton } from '@pulse/styleguide/components'
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
.launch-card {
  background: var(--el-color-neutral-gray-50);
  border-left: 5px solid var(--el-color-neutral-gray-50);
  border-right: 5px solid var(--el-color-neutral-gray-50);
  max-width: 350px;

  &:hover {
    background: var(--el-color-persian-50);
    border-left-color: var(--el-color-secondary-amethyste);
    border-right-color: var(--el-color-persian-50);
  }

  &__image {
    height: 6rem;
  }
}
</style>
