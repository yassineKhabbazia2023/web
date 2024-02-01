<template>
  <div class="flex flex--direction-column sticky-wrapper">
    <div class="flex--grow-1 padding--2">
      <div class="margin-bottom--6">
        <PForm
          @submit.prevent="handleSearchSubmit(formRef)"
          ref="formRef"
          :pRules="rules"
          :pModel="formValues"
        >
          <PFormItem prop="search">
            <PInput
              @keyup="handleSearchSubmit(formRef)"
              v-model="formValues.search"
              :pPlaceholder="t('search')"
              :pPrefixIcon="PISearch"
              pName="search"
              pSize="small"
              pType="search"
              pAutofocus
            />
          </PFormItem>
        </PForm>
      </div>

      <PLoader v-if="state.isLoading" />

      <TableData
        v-if="!state.isLoading && state.data.length"
        :data="state.data"
      />
    </div>

    <PPagination
      v-if="shouldShowPagination && !!state.totalItems"
      @on-page-range-changed="handlePageRangeChanged"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      :pPageSizeSelectorGroupLabel="t('numberOfCollaboratorsPerPage')"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      pBackground
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  PForm,
  PFormItem,
  PInput,
  PISearch,
  PLoader,
  PPagination
} from '@kpmg/styleguide'
import { getInitials } from '@/helper'
import type { IExtendedCollab, IState } from './types'
import TableData from './components/TableData'
import mock from './mock.json'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const PAGE_SIZES = [15, 30, 45, 60]

// search part
const formRef = ref<FormInstance>()
const formValues = reactive({
  search: undefined
})
const rules = reactive<FormRules<typeof formValues>>({
  search: [{
    trigger: 'change',
    min: 3,
    message: t('errorSearchInvalid')
  }]
})
const handleSearchSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch (error) {
      return false
    }
  }
  state.search = formValues.search
}

// table part
const state: IState = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  isLoading: undefined
})

const handlePageRangeChanged = (newValue: number) => {
  state.limit = newValue
}

const paginationLabel = computed(() =>
  `${1 + ((state.currentPage - 1) * state.limit)}
    - ${((state.currentPage - 1) * state.limit) +
    state.data.length} 
    ${t('on')} ${state.totalItems}`
)

const shouldShowPagination = computed(() =>
  !state.isLoading && !!state.totalItems && state.totalItems > state.limit
)

const fetch = async () => {
  state.isLoading = true

  try {
    const {
      data: {
        items,
        currentPage,
        totalPages,
        totalItems
      }
    } = await Promise.resolve(mock)
    // TODO: remove mock when endpoint is done
    // await commonApi().wallet.get(`collabs?${searchParams}`)

    state.data = items.map<IExtendedCollab>(({
      firstName,
      lastName,
      ...rest
    }) => ({
      initials: getInitials(
        firstName,
        lastName
      ),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      ...rest
    }))
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
}

onMounted(async () => {
  await fetch()

  watch(() => [
    state.currentPage,
    state.limit,
    state.search
  ], async () => {
    await fetch()
  })
})
</script>

<style lang="scss" scoped>
.sticky-wrapper {
  // due to the bottom bar on small screens
  @media (min-width: 993px) {
    min-height: 100%;
  }
}
</style>

<i18n lang="yaml">
en-US:
  search: 'Search'
  errorSearchInvalid: 'Minimum three characters required'
  numberOfCollaboratorsPerPage: 'Number of collaborators per page'
  on: 'on'
fr-FR:
  search: 'Rechercher'
  errorSearchInvalid: 'Trois caractères minimum requis'
  numberOfCollaboratorsPerPage: 'Nombre de collaborateurs par page'
  on: 'sur'
</i18n>
