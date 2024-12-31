<template>
  <div>
    <div class="header">
      <div class="header__title margin-bottom--2">
        {{ t('bank-mandates') }}
      </div>
      <PFilterGroupNumber
        v-model="activeFilters"
        class="flex--grow-1"
        :pFilters="filters"
        @update:model-value="onClickFilter($event)"
      />
      <PButton
        class="header__create-mandate-button font-semibold"
        pType="primary"
        pSize="small"
        @click="drawerHandler"
      >
        <PIcon class="el-button__icon--left" pName="add" />
        {{ t('new-mandate') }}
      </PButton>
    </div>
    <Drawer
      v-if="openDrawer"
      v-model="openDrawer"
      @new-mandate-created="emitRefreshMandateCollection"
    />
  </div>
</template>

<script setup lang="ts">
import Drawer from '@mandate/components/CreateMandate/Drawer'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import {
  PButton,
  PIcon,
  PFilterGroup,
} from '@pulse/styleguide/components'
import { type FilterOption } from '@pulse/styleguide/types'
import { amplitudeService } from '@pulse/common'
import type { SearchMandateParams } from '@mandate/services/mandate/ServiceMandateTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const PFilterGroupNumber = PFilterGroup<number>

const emit = defineEmits<{
  'refresh-mandate-collection': [Partial<SearchMandateParams>]
}>()

const openDrawer = ref(false)
const drawerHandler = () => {
  openDrawer.value = true
  trackMandateFlowStart()
}

function trackMandateFlowStart() {
  amplitudeService.track('Bank Mandate Creation Started', {
    bank_mandate_creation_start: '',
  })
}

const activeFilters = ref<number[]>([])

function emitRefreshMandateCollection() {
  emit('refresh-mandate-collection', {
    currentPage: 1,
    statusCodes: activeFilters.value,
  })
}

function onClickFilter(activeFilterCodes: number[]) {
  /* We are waiting for the back end to change the way ids are handled
  Until then, we are explicitely pushing "-1" which also corresponds to
  the "incident" (10) state
  doing it the appropriate way would imply a refact of the Filter Group to allow array of values
  */

  const filterCode = activeFilterCodes.includes(10)
    ? [...activeFilterCodes, -1]
    : activeFilterCodes.filter((c) => c !== -1)
  activeFilters.value = filterCode
  emitRefreshMandateCollection()
}

const filters: FilterOption<number>[] = [
  {
    pContent: t('incident'),
    pCode: 10,
    pColor: 'danger',
    pIconName: 'exclamationTriangle',
  },
  {
    pContent: t('to-do'),
    pCode: 20,
    pColor: 'warning',
    pIcon: 'arrowUpCircle',
  },
  {
    pContent: t('in-progress'),
    pCode: 30,
    pColor: 'fuschia',
    pIconName: 'arrowRepeat',
  },
  {
    pContent: t('active'),
    pCode: 40,
    pColor: 'success',
    pIconName: 'checkCircle',
  },
  {
    pContent: t('inactive'),
    pCode: 50,
    pColor: 'gray-900',
    pIconName: 'xCircle',
  },
]
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  &__title {
    color: var(--el-color-neutral-gray-800);
    font-size: 1.2rem;
    flex-basis: 100%;
    margin-top: 9px;
  }

  &__create-mandate-button {
    font-style: normal;
    line-height: 120%;
  }
  .p-filter-group {
    height: 32px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    bank-mandates: 'Collection Status'
    new-mandate: 'New mandate'
    incident: 'Incident'
    to-do: 'To do'
    in-progress: 'In progress'
    active: 'Active'
    inactive: 'Inactive'
  fr-FR:
    bank-mandates: 'Statut des collectes'
    new-mandate: 'Nouveau mandat'
    incident: 'Incident'
    to-do: 'À déposer'
    in-progress: 'En cours'
    active: 'Actif'
    inactive: 'Résilié'
</i18n>
