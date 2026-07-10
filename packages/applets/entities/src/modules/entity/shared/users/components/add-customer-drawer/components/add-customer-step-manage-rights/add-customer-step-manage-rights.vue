<template>
  <PUserCard
    :pTitle="fullname"
    :pSubtitle="newContact.email"
    pImageName="user-duotone"
    class="margin-bottom--6"
    pColor="gray"
    data-testid="add-customer-rights-user-card"
    :pTag="prospectTag"
  />
  <RightsList
    v-if="authorizationsState !== undefined"
    v-model="authorizationsState"
    v-model:additionalOptionByActionCode="additionalOptionByActionCode"
    v-model:pennylaneAvailableRoles="pennylaneAvailableRoles"
    :contactId="contactId"
    :contactType="ContactType.CUSTOMER"
    :accountNumber="accountNumber"
    :defaultCheckedRights="defaultCheckedRights"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import type { AddCustomerStepManageRightsProps } from './add-customer-step-manage-rights.types'
import RightsList from '@entities/components/ManageRightsDrawer/components/RightsList'
import { AuthorizationState } from '@entities/components/ManageRightsDrawer/ManageRightsTypes'
import { getFullName } from '@pulse/common/utils'
import { ContactType } from '@pulse/common/enums'
import { PUserCard } from '@pulse/styleguide/components'
import type { PTagProps } from '@pulse/styleguide/types'
import { getAdditionalOptionByActionCode } from '@entities/components/ManageRightsDrawer/utils'
import type { PennylaneAvailableRole } from '@pulse/common/types'
import { DEFAULT_PROSPECT_USER_RIGHTS } from '@entities/constants/prospect-rights.const'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      prospect: 'Prospect',
    },
    'fr-FR': {
      prospect: 'Prospect',
    },
  },
})

const props = defineProps<AddCustomerStepManageRightsProps>()
const authorizationsState = defineModel<Record<string, AuthorizationState>>('authorizationsState')
const additionalOptionByActionCode = defineModel<Record<string, string>>('additionalOptionByActionCode')
const additionalOptionByActionCodeOrigin = defineModel<Record<string, string>>('additionalOptionByActionCodeOrigin')
const pennylaneAvailableRoles = defineModel<PennylaneAvailableRole[]>('pennylaneAvailableRoles')

const isProspect = computed(() => props.isProspect)

const prospectTag = computed<PTagProps | undefined>(() => {
  if (isProspect.value === false) {
    return undefined
  }
  return {
    pSize: 'default',
    pColor: 'gray',
    pIconLeftName: 'person',
    pContent: t('prospect'),
  }
})

const fullname = computed(() => getFullName(
  props.newContact.firstname,
  props.newContact.lastname,
))

const defaultCheckedRights = computed(() =>
  isProspect.value ? DEFAULT_PROSPECT_USER_RIGHTS : [],
)

async function initAdditionalOptionByActionCodeOrigin() {
  additionalOptionByActionCodeOrigin.value = {}
  const entityId = props.entityId
  const contactId = props.contactId
  if (entityId !== null) {
    try {
      additionalOptionByActionCodeOrigin.value = await getAdditionalOptionByActionCode({
        entityId,
        contactId,
      })
    } catch (e) {
      logger.error(e)
    }
  }
  additionalOptionByActionCode.value = {
    ...additionalOptionByActionCodeOrigin.value,
  }
}

onMounted(async () => {
  initAdditionalOptionByActionCodeOrigin()
})
</script>
