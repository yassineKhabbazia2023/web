<template>
  <PUserCard
    :pTitle="fullname"
    :pSubtitle="newContact.email"
    pImageName="user-duotone"
    class="margin-bottom--2"
    pColor="gray"
  />
  <RightsList
    v-if="authorizationsState !== undefined"
    v-model="authorizationsState"
    v-model:additionalOptionByActionCode="additionalOptionByActionCode"
    :contactId="contactId"
    :contactType="ContactType.CUSTOMER"
    :accountNumber="accountNumber"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { logger } from '@pulse/toolbox'
import type { AddCustomerStepManageRightsProps } from './add-customer-step-manage-rights.types'
import RightsList from '@entities/common/components/ManageRightsDrawer/components/RightsList'
import { AuthorizationState } from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'
import { getFullName } from '@entities/common/utils'
import { ContactType } from '@pulse/common/enums'
import { PUserCard } from '@pulse/styleguide/components'
import { getAdditionalOptionByActionCode } from '@entities/common/components/ManageRightsDrawer/utils'

const props = defineProps<AddCustomerStepManageRightsProps>()
const authorizationsState = defineModel<Record<string, AuthorizationState>>('authorizationsState')
const additionalOptionByActionCode = defineModel<Record<string, string>>('additionalOptionByActionCode')
const additionalOptionByActionCodeOrigin = defineModel<Record<string, string>>('additionalOptionByActionCodeOrigin')

const fullname = computed(() => getFullName(
  props.newContact.firstname,
  props.newContact.lastname,
))

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
