<template>
  <div>
    <div class="header padding--6">
      <div class="header__title font-normal">
        {{ t('bank-mandates') }}
      </div>
      <PButton
        class="header__create-mandate-button font-semibold"
        pType="primary"
        pSize="default"
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
      @new-mandate-crated="$emit('refresh-mandate-collection')"
    />
  </div>
</template>

<script setup lang="ts">
import Drawer from '@/components/CreateMandate/Drawer'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { PButton, PIcon, PIAdd } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineEmits<{
  'refresh-mandate-collection': []
}>()

const openDrawer = ref(false)
const drawerHandler = () => {
  openDrawer.value = true
}

</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__title {
    color: var(--el-color-neutral-gray-900);
    font-size: 24px;
    font-style: normal;
    line-height: 120%;
  }

  &__create-mandate-button {
    font-style: normal;
    line-height: 120%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    bank-mandates: ''
    new-mandate: 'New mandate'
  fr-FR:
    bank-mandates: ''
    new-mandate: 'Nouveau mandat'
</i18n>
