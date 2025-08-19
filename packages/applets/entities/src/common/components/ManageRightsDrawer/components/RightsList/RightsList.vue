<template>
  <p data-testid="rights-list-note">
    {{ t('rightsNote', { rightsType : isAccountRights ? t('thisAccount') : t('thisUser')}) }}
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
            class="rights-list__authorizations__item"
          >
            <PCheckbox :pLabel="authorizationAction.code">
              {{ authorizationAction.label }}
              <PTooltip
                v-if="authorizationAction.tooltip !== ''"
                :pContent="authorizationAction.tooltip"
                pPlacement="top"
              >
                <PIcon
                  class="additional-infos-icon"
                  pName="infoCircle"
                  @click="handleInfoIconClick"
                />
              </PTooltip>
            </PCheckbox>
            <PDropdown
              v-if="dropdownsByActionCode?.[authorizationAction.code]?.isVisible === true"
              :modelValue="additionalOptionByActionCode?.[authorizationAction.code]"
              :pPlaceholder="dropdownsByActionCode[authorizationAction.code].placeholder"
              :pOptions="dropdownsByActionCode[authorizationAction.code].options"
              pHasRadioButton
              fitInputWidth
              popper-class="max-width-600"
              @update:model-value="$event => onUpdateAdditionalOptionByActionCode(authorizationAction.code, $event)"
            />
          </li>
        </ul>
      </PCheckboxGroup>
    </div>
  </template>
</template>

<script setup lang="ts">
import { logger, FeatureFlagManager } from '@pulse/core'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { PSwitch, PCheckbox, PCheckboxGroup, PLoader, PIcon, PTooltip, PDropdown } from '@pulse/styleguide/components'
import { fetchAuthorizationsConfig, fetchAccountAuthorizationsConfig } from '@entities/services/authorization'
import {
  getHasAction,
  getPennylaneDropdownOptions,
  getDropdownsByActionCode,
  getAuthorizationsConfigMapped,
  getAuthorizationState,
} from './utils'
import { RouteParam } from '@pulse/common/enums'
import type { AuthorizationState } from '../../ManageRightsTypes'
import type {
  AuthorizationConfig,
  AuthorizationConfigMapped,
  RightsListProps,
} from './RightsListTypes'
import { RouterHelpers } from '@pulse/common/helpers'
import { PERMISSION_ACTION } from '@pulse/common/constants'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { PennylaneAvailableRole } from '@pulse/common/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<RightsListProps>()
const emit = defineEmits<{
  'update:modelValue': [Record<string, AuthorizationState>]
  'update:additionalOptionByActionCode': [Record<string, string>]
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
  CLTGEDGS: t('socialGed'),
  CLTGEDESC: t('accountingGed'),
  CLTESC: t('accountingManagement'),
  CLTGS: t('socialManagement'),
  CLTPILOTAGE: t('management'),
}

const route = useRoute()
const isLoading = ref(true)
const authorizationsConfig = ref<AuthorizationConfigMapped[]>([])
const pennylaneAvailableRoles = ref<PennylaneAvailableRole[]>([])

const internalAuthorizationState = computed({
  get() {
    return props.modelValue
  },
  set(authorizationState) {
    emit('update:modelValue', authorizationState)
  },
})

function onUpdateAdditionalOptionByActionCode(actionCode: string, role: string) {
  const updatedAdditionalOptionByActionCode = {
    ...props.additionalOptionByActionCode,
    [actionCode]: role,
  }

  emit('update:additionalOptionByActionCode', updatedAdditionalOptionByActionCode)
}

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

const dropdownsByActionCode = computed(() => {
  const hasPennylane = getHasAction(props.modelValue, PERMISSION_ACTION.ACCESS_PENNYLANE)
  const pennylanedropdownOptions = getPennylaneDropdownOptions(pennylaneAvailableRoles.value ?? [])

  return getDropdownsByActionCode(
    hasPennylane,
    pennylanedropdownOptions,
    t('PennylaneDropdownPlaceholder'),
  )
})

onMounted(async () => {
  internalAuthorizationState.value = {}
  try {
    let rightsConfigList: AuthorizationConfig[] = []
    if (props.isAccountRights && props.accountId && props.contactType) {
      rightsConfigList = await fetchAccountAuthorizationsConfig(
        props.accountId,
        props.contactType,
      )
    } else if (props.contactId) {
      const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      rightsConfigList = await fetchAuthorizationsConfig(
        props.contactId,
        entityId,
      )
    }

    const isSubscribedToPennylaneOffer = rightsConfigList
      .some((right) => right.actions
        .some((action) => action.code === PERMISSION_ACTION.ACCESS_PENNYLANE),
      )
    if (isSubscribedToPennylaneOffer === true) {
      const availableRoles = props.accountNumber === undefined
        ? undefined
        : await PennylaneService.getAvailableRoles(props.accountNumber)
      pennylaneAvailableRoles.value = availableRoles ?? []
    }


    const tooltipByActionCode = FeatureFlagManager.isPennylaneActionAdditionalInfoActivated()
      ? {
        [PERMISSION_ACTION.ACCESS_PENNYLANE]: t('PennylaneAdditionalInfos'),
      } : {}
    // We need to map the data in order to obtain the category label
    authorizationsConfig.value = getAuthorizationsConfigMapped(
      rightsConfigList,
      RIGHT_CATEGORIES,
      tooltipByActionCode,
    )

    // To display the action checkboxes and the category switch with the correct values
    authorizationsConfig.value.forEach(
      (authConfig: AuthorizationConfigMapped) => {
        internalAuthorizationState.value[authConfig.category.code] =
          getAuthorizationState(authConfig.actions)
      },
    )
  } catch (error) {
    logger.error('Unable to fetch authorizations config: ', error)
  } finally {
    isLoading.value = false
  }
})

const handleInfoIconClick = (event: MouseEvent) => {
  event.preventDefault()
}
</script>

<style lang="scss" scoped>
.rights-list {
  &__authorizations {
    margin-left: 56px;
    &__item {
      margin-bottom: 1rem;
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
  .additional-infos-icon {
    vertical-align: bottom;
  }
  ::v-deep .el-switch__label {
    height: inherit;
  }
  ::v-deep .el-checkbox__label {
    line-height: 1.2;
    white-space: normal;
  }
}
</style>


<!-- Note : désactivation uniquement dans la section YAML afin de permettre un contenu formaté -->
<!-- avec des retours à la ligne -->
<!-- eslint-disable no-trailing-spaces -->
<i18n lang="yaml">
en-US:
  PennylaneAdditionalInfos: |
    ● By checking this box and confirming, a Pennylane account will be created for the user,
      who will be able to access it via the "Applications" tab on the RYDGE Conseil platform.

    ● By unchecking, access to Pennylane will be blocked for the user on this company.
  management: 'Management tools'
  accountingManagement: 'Accounting management tools'
  socialManagement: 'Social management tools'
  accountingGed: 'Document space – Accounting'
  socialGed: 'Document space – Social management'
  administration: 'Administration'
  offer: 'Offer and subscription'
  reports: 'Reports'
  mirrorView: 'Customer mirror view'
  manage: 'File management'
  prod: 'Business production'
  thisAccount: 'this folder'
  thisUser: 'this user'
  rightsNote: 'Select the rights you want to grant to {rightsType}:'
  PennylaneDropdownPlaceholder: 'Choose a role'
fr-FR:
  PennylaneAdditionalInfos: |
    ● En cochant cette case et en validant, un compte
      Pennylane sera créé pour l’utilisateur, qui pourra y
      accéder via l'onglet "Applications" sur la plateforme
      RYDGE Conseil.

    ● En décochant, l’accès à Pennylane sera bloqué sur cette
      entreprise pour l'utilisateur.
  management: 'Outil de pilotage'
  accountingManagement: 'Outil de gestion Comptable'
  socialManagement: 'Outil de gestion Sociale'
  accountingGed: 'Espace documentaire – Comptabilité'
  socialGed: 'Espace documentaire – Gestion Sociale'
  administration: 'Administration'
  offer: 'Offre et souscription'
  reports: 'Rapports'
  mirrorView: 'Vue miroir client'
  manage: 'Gestion des dossiers'
  prod: 'Production métier'
  thisAccount: 'ce dossier'
  thisUser: 'cet utilisateur'
  rightsNote: 'Sélectionnez les droits que vous souhaitez accorder à {rightsType} :'
  PennylaneDropdownPlaceholder: 'Choisir un rôle'
</i18n>
