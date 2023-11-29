<template>
  <div>
    <div class="header">
      <div class="header__title">
        {{ t('bank-mandates') }}
      </div>
      <PButton
        class="header__create-mandate-button"
        pType="primary"
        pSize="default"
        :pPlain="false"
        :pRound="false"
        :pDisabled="false"
        :pLoading="false"
        @click="drawerHandler"
      >
        <PIcon class="el-button__icon--left">
          <PIAdd />
        </PIcon>
        {{ t('new-mandate') }}
      </PButton>
    </div>
    <Drawer
      v-if="openDrawer"
      v-model="openDrawer"
    />
  </div>
</template>

<i18n lang="yaml">
    en-US:
        bank-mandates: 'Banking flows'
        new-mandate: 'New mandate'
    fr-FR:
        bank-mandates: 'Flux bancaires'
        new-mandate: 'Nouveau mandat'
</i18n>

<script setup lang="ts">
import Drawer from '@/components/CreateMandate/Drawer'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { PButton, PIcon, PIAdd } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const openDrawer = ref(false)
const drawerHandler = () => {
  openDrawer.value = true
}
defineExpose({
  openDrawer
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
