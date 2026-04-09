<template>
  <div class="booking-configuration-text">
    <p class="booking-configuration-text__intro font-semibold margin-bottom--6">
      {{ t('booking-configuration-text.intro') }}
    </p>

    <i18n-t
      keypath="booking-configuration-text.withBookings"
      tag="p"
      class="margin-bottom--4"
    >
      <template #timeSlots>
        <span class="font-bold">{{ t('booking-configuration-text.timeSlots') }}</span>
      </template>
      <template #platform>
        <span class="font-bold">{{ t('booking-configuration-text.platform') }}</span>
      </template>
    </i18n-t>

    <FeatureHighlight iconName="calendarEvent">
      {{ t('booking-configuration-text.highlights.keep-control') }}
    </FeatureHighlight>
    <FeatureHighlight iconName="command">
      {{ t('booking-configuration-text.highlights.centralize-relation') }}
    </FeatureHighlight>
    <FeatureHighlight iconName="arrowRepeat">
      {{ t('booking-configuration-text.highlights.strengthen-satisfaction') }}
    </FeatureHighlight>

    <div class="margin-top--6">
      <PAlert pType="information">
        <i18n-t keypath="booking-configuration-text.noLimitation">
          <template #note>
            <span class="font-bold">{{ t('booking-configuration-text.note') }}</span>
          </template>
          <template #noLimit>
            <span class="font-bold">{{ t('booking-configuration-text.noLimit') }}</span>
          </template>
        </i18n-t>
      </PAlert>
    </div>

    <Teleport to="#booking-drawer__footer">
      <div class="margin-left--auto">
        <PButton
          pType="primary"
          @click="emit('next-step')"
        >
          {{ t('booking-configuration.buttons.next') }}
        </PButton>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { PAlert, PButton } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import FeatureHighlight from '../feature-highlight/feature-highlight.vue'

const emit = defineEmits<{
  'next-step': []
}>()

const { t } = useI18n({ useScope: 'global' })

</script>

<style lang="scss" scoped>
.booking-configuration-text {
  &__intro {
    font-size: 16px;
  }
}
</style>
