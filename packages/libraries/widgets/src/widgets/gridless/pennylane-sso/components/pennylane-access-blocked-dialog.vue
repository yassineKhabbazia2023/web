<template>
  <PDialog
    v-model="isVisible"
    :p-width="dialogWidth"
    :p-show-close="false"
    :p-align-center="true"
    class="
      pennylane-access-blocked-dialog
      no-spacing
    "
  >
    <div
      class="
        pennylane-access-blocked-dialog__content
        font-large
        font-medium
        flex
      "
    >
      <div
        class="
          pennylane-access-blocked-dialog__left
          padding-responsive--dialog-content
          flex
          flex--direction-column
          flex--basis-50
          bg--base-white
        "
      >
        <h2 class="pennylane-access-blocked-dialog__title margin-bottom--6 font-bold">
          {{ t('widgets.pennylaneAccessBlocked.title') }}
        </h2>

        <p class="pennylane-access-blocked-dialog__text margin-bottom--4">
          {{ t('widgets.pennylaneAccessBlocked.complianceRequirement') }}
        </p>

        <p class="pennylane-access-blocked-dialog__text margin-bottom--4">
          {{ t('widgets.pennylaneAccessBlocked.authorizedRepresentativeOnly') }}
        </p>

        <p class="pennylane-access-blocked-dialog__text margin-bottom--4">
          {{ t('widgets.pennylaneAccessBlocked.connectionInstructions') }}
        </p>

        <p
          class="
            pennylane-access-blocked-dialog__text
            font-bold
          "
        >
          {{ t('widgets.pennylaneAccessBlocked.conclusion') }}
        </p>

        <PButton
          class="
            margin-top--8
            flex--align-self-flex-end
          "
          pType="primary"
          @click="handleClose"
        >
          {{ t('widgets.pennylaneAccessBlocked.understood') }}
        </PButton>
      </div>

      <div
        class="
          pennylane-access-blocked-dialog__right
          bg--black-rock-900
          flex
          flex--justify-content-center
          flex--basis-50
        "
      >
        <div
          class="
            pennylane-access-blocked-dialog__branding
            flex
            flex--direction-column
            flex--align-items-center
            flex-gap--6
          "
        >
          <PImage
            pName="brand-white"
            pFit="contain"
            class="
              pennylane-access-blocked-dialog__logo
              pennylane-access-blocked-dialog__logo--brand
            "
          />

          <div class="pennylane-access-blocked-dialog__separator bg--base-white" />

          <PImage
            pName="pennylane-logo"
            pFit="contain"
            class="
              pennylane-access-blocked-dialog__logo
              pennylane-access-blocked-dialog__logo--pennylane
            "
          />
        </div>

        <PImage
          pName="pennylane-header-illustration"
          pFit="cover"
          class="pennylane-access-blocked-dialog__background"
        />
      </div>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton, PImage } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import type { PennylaneAccessBlockedDialogProps } from './pennylane-access-blocked-dialog.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const { isMobile } = useResponsive()

const dialogWidth = computed(() => isMobile.value ? '95%' : '70%')

const props = defineProps<PennylaneAccessBlockedDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.pennylane-access-blocked-dialog {
  &__content {
    @include breakpoints.media(xs) {
      flex-direction: column;
    }
  }

  &__left {
    @include breakpoints.media(sm) {
      flex-basis: 100% !important;
    }
  }

  &__right {
    position: relative;

    @include breakpoints.media(sm) {
      display: none;
    }
  }

  &__text {
    line-height: 1.6;
  }

  &__branding {
    z-index: 1;
    margin-top: 45px;
  }

  &__logo {
    &--brand {
      width: 144px;
    }

    &--pennylane {
      width: 208px;
    }
  }

  &__separator {
    width: 32px;
    height: 1px;
  }

  &__background {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 380px;
    opacity: 0.5;
  }
}
</style>
