<template>
  <div>
    <pre>{{ filters }}</pre>
    <div class="header">
      <div class="header__title font-normal">
        {{ t('bank-mandates') }}
      </div>
      <PFilterGroupNumber
        class="flex--grow-1"
        v-model="activeFilters"
        :pFilters="filters"
        @update:model-value="onClickFilter($event)"
      />
      <PButton
        class="header__create-mandate-button font-semibold"
        pType="primary"
        pSize="small"
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
      @new-mandate-crated="onNewMandateCreated"
    />
  </div>
</template>

<script setup lang="ts">
import Drawer from '@/components/CreateMandate/Drawer'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import {
  PButton,
  PIcon,
  PIAdd,
  PFilterGroup,
} from '@kpmg/styleguide'
import type { UpdateTableDisplayParams } from '@/pages/home/HomeTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const PFilterGroupNumber = PFilterGroup<number>

const emit = defineEmits<{
  'refresh-mandate-collection': [Partial<UpdateTableDisplayParams>]
}>()

const openDrawer = ref(false)
const drawerHandler = () => {
  openDrawer.value = true
}

const activeFilters = ref<number[]>([])

function onNewMandateCreated() {
  emit('refresh-mandate-collection', {
    statusCodes: activeFilters.value,
  })
}

function onClickFilter(activeFilterCodes: number[]) {
  activeFilters.value = activeFilterCodes
  onNewMandateCreated()
}

const filters = [{
  pContent: t('incident'),
  pCode: 10,
  pColor: 'danger',
  pIcon: 'PIExclamationTriangle',
}, {
  pContent: t('to-do'),
  pCode: 20,
  pColor: 'warning',
  pIcon: 'PIUpload',
}, {
  pContent: t('in-progress'),
  pCode: 30,
  pColor: 'amethyste',
  pIcon: 'PIArrowRepeat',
}, {
  pContent: t('active'),
  pCode: 40,
  pColor: 'success',
  pIcon: 'PICheckCircle',
}, {
  pContent: t('inactive'),
  pCode: 50,
  pColor: 'gray-900',
  pIcon: 'PIXCircle',
}]
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
    incident: 'Incident'
    to-do: 'To do'
    in-progress: 'In progress'
    active: 'Active'
    inactive: 'Inactive'
  fr-FR:
    bank-mandates: ''
    new-mandate: 'Nouveau mandat'
    incident: 'Incident'
    to-do: 'À déposer'
    in-progress: 'En cours'
    active: 'Actif'
    inactive: 'Résilié'
</i18n>
