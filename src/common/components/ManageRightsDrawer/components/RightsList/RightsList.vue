<template>
  <p data-testid="rights-list-note">
    {{ t('rightsNote') }}
  </p>
  <div
    v-if="isLoading"
    class="flex flex--justify-content-center margin-y--4"
    data-testid="rights-list-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <template v-else>
    <div
      v-for="{ category, actions } in authorizationsConfig"
      :key="category.code"
      class="rights-list padding-top--5"
    >
      <PSwitch
        v-model="internalAuthorizationState[category.code].isActive"
        :pActiveText="category.label"
        class="margin-bottom--3"
        data-testid="rights-list-category-switch"
        @update:model-value="
          (state) =>
            handleAuthorizationCategoryUpdate(state, { category, actions })
        "
      />
      <PCheckboxGroup
        v-model="internalAuthorizationState[category.code].actions"
        class="rights-list__authorizations"
        data-testid="rights-list-authorizations-checkbox-group"
        @update:model-value="
          (authorizationActions) =>
            handleAuthorizationActionUpdate(authorizationActions, {
              category,
              actions,
            })
        "
      >
        <ul class="list-style-none">
          <li
            v-for="authorizationAction in actions"
            :key="authorizationAction.code"
            class="rights-list__authorizations-item"
          >
            <PCheckbox :pLabel="authorizationAction.code">
              {{ authorizationAction.label }}
            </PCheckbox>
          </li>
        </ul>
      </PCheckboxGroup>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { PSwitch, PCheckbox, PCheckboxGroup, PLoader } from '@kpmg/styleguide'
import { fetchAuthorizationsConfig } from '@/services/authorization'
import { getAuthorizationsConfigMapped, getAuthorizationState } from './utils'
import type { AuthorizationState } from '../../ManageRightsTypes'
import type {
  AuthorizationConfigMapped,
  RightsListProps,
} from './RightsListTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<RightsListProps>()
const emit = defineEmits<{
  'update:modelValue': [Record<string, AuthorizationState>]
}>()

// Mapping with the code is required to obtain the translated label
const RIGHT_CATEGORIES = {
  COLADMIN: t('administration'),
  COLOFFRE: t('offer'),
  COLRAPPORT: t('reports'),
  COLGESTION: t('manage'),
  COLMIRROIR: t('mirrorView'),
  COLPROD: t('prod'),
  CLTGESTION: t('administration'),
  'CLTGED GS': t('socialGed'),
  'CLTGED ESC': t('accountingGed'),
  CLTESC: t('accountingManagement'),
  CLTGS: t('socialManagement'),
  CLTPILOTAGE: t('management'),
}

const route = useRoute()
const isLoading = ref(true)
const authorizationsConfig = ref<AuthorizationConfigMapped[]>([])

const internalAuthorizationState = computed({
  get() {
    return props.modelValue
  },
  set(authorizationState) {
    emit('update:modelValue', authorizationState)
  },
})

// To manage the status of actions when there is a change in the state of the category switch
const handleAuthorizationCategoryUpdate = (
  state: boolean,
  authorizationConfig: AuthorizationConfigMapped,
) => {
  const authorizationCategory = authorizationConfig.category.code
  if (state) {
    internalAuthorizationState.value[authorizationCategory].actions =
      authorizationConfig.actions.map(({ code }) => code)
  } else {
    internalAuthorizationState.value[authorizationCategory].actions = []
  }
}

// To manage the status of the category when there is a change in the state of the actions
const handleAuthorizationActionUpdate = (
  authorizationActions: string[],
  authorizationConfig: AuthorizationConfigMapped,
) => {
  const authorizationCategory = authorizationConfig.category.code
  if (authorizationActions.length > 0) {
    internalAuthorizationState.value[authorizationCategory].isActive = true
  } else {
    internalAuthorizationState.value[authorizationCategory].isActive = false
  }
}

onMounted(async () => {
  try {
    const data = await fetchAuthorizationsConfig(
      props.contactId,
      route.params.id ? +route.params.id : null,
    )
    // We need to map the data in order to obtain the category label
    authorizationsConfig.value = getAuthorizationsConfigMapped(
      data,
      RIGHT_CATEGORIES,
    )
    // To display the action checkboxes and the category switch with the correct values
    authorizationsConfig.value.forEach(
      (authConfig: AuthorizationConfigMapped) => {
        internalAuthorizationState.value[authConfig.category.code] =
          getAuthorizationState(authConfig.actions)
      },
    )
  } catch (error) {
    console.error('Unable to fetch authorizations config: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.rights-list {
  &__authorizations {
    margin-left: 56px;
    &-item {
      margin-bottom: 1.2rem;
      &:last-child {
        margin-bottom: 0;
      }
      label {
        height: auto;
      }
    }
  }
  & + & {
    margin-top: 1.2rem;
    border-top: 1px solid var(--el-color-neutral-gray-100);
  }
}
</style>

<i18n lang="yaml">
en-US:
  management: 'Pilotage'
  accountingManagement: 'Accounting management production'
  socialManagement: 'Social management production'
  accountingGed: 'Accounting GED'
  socialGed: 'Social GED'
  administration: 'Administration'
  offer: 'Offer and subscription'
  reports: 'Reports'
  mirrorView: 'Customer mirror view'
  manage: 'File management'
  prod: 'Business production'
  rightsNote: 'Activate or deactivate the features you want to give for this user.'
fr-FR:
  management: 'Pilotage'
  accountingManagement: 'Production gestion comptable'
  socialManagement: 'Production gestion sociale'
  accountingGed: 'GED comptable'
  socialGed: 'GED sociale'
  administration: 'Administration'
  offer: 'Offre et souscription'
  reports: 'Rapports'
  mirrorView: 'Vue mirroir client'
  manage: 'Gestion des dossiers'
  prod: 'Production métier'
  rightsNote: 'Activez ou désactivez les fonctionnalités que vous souhaitez donner pour cet utilisateur.'
</i18n>
