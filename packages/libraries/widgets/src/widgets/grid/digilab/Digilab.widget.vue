<template>
  <div
    class="
      widget-digilab height--100
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <div>
      <PImage pName="three-persons-in-meeting" />
      <i18n-t
        class="
          text-color--black-rock-900
          font-large
          margin-top--6
        "
        keypath="widgets.digilab.join"
        tag="p"
      >
        <template #brandName>
          <span class="text-color--secondary-amethyste">{{ t('widgets.digilab.brandNameLeftPart') }}</span>
          <span>{{ t('widgets.digilab.brandNameRightPart') }}</span>
        </template>
      </i18n-t>

      <i18n-t
        class="margin-top--4"
        keypath="widgets.digilab.contribute"
        tag="p"
      >
        <template #brandName>
          <span class="font-bold">{{ t('widgets.digilab.brandName') }}</span>
        </template>
      </i18n-t>
    </div>

    <PButton
      class="flex--align-self-flex-start"
      :href="sanitizeUrl(DIGILAB_JOIN_FORM_URL)"
      pSize="small"
      pTag="a"
      pType="secondary"
      target="_blank"
    >
      {{ t('widgets.digilab.joinAction') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PImage } from '@pulse/styleguide/components'
import { DIGILAB_JOIN_FORM_URL } from '@pulse/core'
import { sanitizeUrl } from '@braintree/sanitize-url'

const { t } = useI18n()
</script>
