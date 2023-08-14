<template>
  <div class="header">
    <div class="header__title">
      {{ t('bank-mandates') }}
    </div>

    <PButton
      class="header__create-mandate-button"
      type="primary"
      size="default"
      :plain="false"
      :round="false"
      :disabled="false"
      :loading="false"
    >
      <PIcon class="el-button__icon--left">
        <PIAdd />
      </PIcon>
      {{ t('new-mandate') }}
    </PButton>
  </div>
</template>

<i18n lang="yaml">
    en-US:
        bank-mandates: 'Bank mandates'
        new-mandate: 'New mandate'
    fr-FR:
        bank-mandates: 'Mandats bancaires'
        new-mandate: 'Nouveau mandat'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;

  &__title {
    color: var(--el-color-neutral-gray-900);
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }

  &__create-mandate-button {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
  }
}
</style>
