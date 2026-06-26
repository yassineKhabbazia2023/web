<template>
  <div class="step-acceptance">
    <h2 class="font-xxlarge font-semibold margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step4.title') }}
    </h2>

    <p class="font-large font-bold margin-bottom--4">
      {{ t('widgets.pennylaneAmendmentFlow.step4.validationNotice') }}
    </p>

    <div
      class="radius--2 padding-x--2 padding-bottom--3"
      :class="{ 'bg--black-rock-100': isAccepted }"
    >
      <PCheckbox
        v-model="isAccepted"
        class="step-acceptance__checkbox"
      >
        <span class="step-acceptance__checkbox-label">
          {{ t('widgets.pennylaneAmendmentFlow.step4.checkboxLabelPrefix') }}
          <a
            href="#"
            class="step-acceptance__link text-color--jungle-400"
            @click.prevent="openTermsPdf"
          >
            {{ t('widgets.pennylaneAmendmentFlow.step4.checkboxLinkText') }}
          </a>
          {{ t('widgets.pennylaneAmendmentFlow.step4.checkboxLabelSuffix') }}
        </span>
      </PCheckbox>

      <ul class="step-acceptance__list font-base margin-left--10">
        <li class="margin-bottom--3">
          {{ t('widgets.pennylaneAmendmentFlow.step4.listItem1') }}
        </li>
        <li>
          {{ listItem2Text }}<template v-if="isDelayedActivation && isFreeTrialExpired === false">
            {{ t('widgets.pennylaneAmendmentFlow.step4.listItem2Delayed') }}
          </template><template v-else>
            {{ t('widgets.pennylaneAmendmentFlow.step4.listItem2Punctuation') }}
          </template>
        </li>
      </ul>
    </div>

    <PAlert
      pType="info"
      class="font-base margin-top--10 margin-bottom--2"
    >
      {{ t('widgets.pennylaneAmendmentFlow.step4.supportNotice') }}
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PCheckbox, PAlert } from '@pulse/styleguide/components'
import { openTermsPdfInNewTab } from '../pennylane-terms.helper'
import { DELAYED_ACTIVATION_DATE } from '../../../pennylane-amendment.consts'
import type { StepAcceptanceProps } from './step-acceptance.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<StepAcceptanceProps>()

const isAccepted = defineModel<boolean>('isAccepted', { required: true })

const isDelayedActivation = computed(() => props.freeTrialEndDate === DELAYED_ACTIVATION_DATE)

const isFreeTrialExpired = computed(() => props.isFreeTrialExpired === true)

const listItem2Text = computed(() =>
  isFreeTrialExpired.value
    ? t('widgets.pennylaneAmendmentFlow.step4.listItem2Expired')
    : t('widgets.pennylaneAmendmentFlow.step4.listItem2'),
)

function openTermsPdf() {
  openTermsPdfInNewTab()
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.step-acceptance {
  &__checkbox-label {
    @include breakpoints.media(xs) {
      font-size: 16px;
    }
  }

  &__link {
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      text-decoration: none;
    }
  }

  &__list {
    list-style-type: disc;
    line-height: 1.4;
  }
}
</style>
