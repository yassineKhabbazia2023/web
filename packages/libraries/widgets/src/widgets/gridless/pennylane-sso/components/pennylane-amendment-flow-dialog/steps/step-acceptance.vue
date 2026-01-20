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
      :class="{ 'bg--black-rock-100': props.isAccepted }"
    >
      <PCheckbox
        :model-value="props.isAccepted"
        class="step-acceptance__checkbox"
        @update:model-value="emit('update:isAccepted', $event)"
      >
        <span class="step-acceptance__checkbox-label">
          {{ t('widgets.pennylaneAmendmentFlow.step4.checkboxLabelPrefix') }}
          <a
            :href="cguUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="step-acceptance__link text-color--jungle-400"
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
          {{ t('widgets.pennylaneAmendmentFlow.step4.listItem2') }}
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
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PCheckbox, PAlert } from '@pulse/styleguide/components'
import type { StepAcceptanceProps } from './step-acceptance.types'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { CurrentUserManager } from '@pulse/common/managers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<StepAcceptanceProps>()

const emit = defineEmits<{
  'update:isAccepted': [value: boolean]
}>()

const cguUrl = ref<string>()

onMounted(() => {
  const encodedToken = window.btoa(CurrentUserManager.getToken())
  cguUrl.value = PennylaneService.buildTermsContentUrl(props.accountId, encodedToken)
})
</script>

<style lang="scss" scoped>
.step-acceptance {
  &__checkbox-label {
    @media screen and (max-width: 768px) {
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
