<template>
  <div class="margin-top--6 margin-bottom--4">
    <FormSearch
      style="max-width: 500px;"
      :placeholder="t('searchByName')"
      @search-value-submitted="handleSearchValueSubmitted"
    />

    <div
      v-if="isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <div v-if="!isLoading">
      <!-- 270px is the height above the timeline-->
      <PScrollbar
        v-if="delegations.length"
        pHeight="calc(100vh - 270px)"
        pViewStyle="margin-right: 8px; height: 100%;"
      >
        <PTimeline>
          <PTimelineItem
            v-for="({ accountLegalName, creationDate, delegatee, delegator, id, isEnabled }) in delegations"
            :key="id"
          >
            <PHistoryCard
              :pDate="d(new Date(creationDate), 'short')"
              :pEntity="accountLegalName"
              :pType="t('delegation')"
              pEntityIconName="shop"
            >
              <template #text>
                <i18n-t
                  keypath="description"
                  tag="p"
                >
                  <template #delegator>
                    <span v-if="delegator.isCurrentUser">
                      <span class="text-capitalize font-semibold">{{ t('you') }}</span>
                      {{ t('have') }}
                    </span>
                    <span v-else>
                      <span class="font-semibold">
                        {{ delegator.firstName }} <span class="text-uppercase">{{ delegator.lastName }}</span>
                      </span>
                      <span v-if="delegatee.isCurrentUser">&nbsp;{{ t('you') }}</span>
                      {{ t('has') }}
                    </span>
                  </template>

                  <template #delegatee>
                    <span v-if="!delegatee.isCurrentUser">
                      {{ t('to') }}
                      <span class="font-semibold">
                        {{ delegatee.firstName }} <span class="text-uppercase">{{ delegatee.lastName }}</span>
                      </span>
                    </span>
                  </template>
                </i18n-t>
              </template>
              <template #action>
                <PTooltip
                  :pContent="tooltipContentForDeleting(isEnabled, delegator)"
                >
                  <PButton
                    pIconOnly
                    pType="generic"
                    :pDisabled="!isEnabled || !delegator.isCurrentUser"
                    @click="deleteDelegation(id, delegatee)"
                  >
                    <PIcon pName="trash" />
                  </PButton>
                </PTooltip>
              </template>
            </PHistoryCard>
          </PTimelineItem>
        </PTimeline>
      </PScrollbar>

      <NoResult v-if="!delegations.length" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  PButton,
  PHistoryCard,
  PIcon,
  PLoader,
  PScrollbar,
  PTimeline,
  PTimelineItem,
  PTooltip,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import type { Entity } from '@pulse/common/types'
import { commonStore } from '@pulse/common'
import { deleteAccountDelegation, fetchAccountDelegationsHistory } from '@entities/services/account/accountServices'
import { DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import { removeFalsyValues } from '@entities/helper'
import FormSearch from '@entities/common/components/FormSearch'
import NoResult from '@entities/common/components/NoResult'
import type { Delegation } from './DelegationsHistoryTypes'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const { user } = storeToRefs(commonStore())
const userId = computed(() => user.value?.id)

const isLoading = ref<boolean>(false)
const search = ref<undefined|string>()
const delegations = ref<Delegation[]>([])

const tooltipContentForDeleting = (isEnabled: Delegation['isEnabled'], delegator: Delegation['delegator']) => {
  if (delegator.isCurrentUser) {
    return isEnabled
      ? t('deleteTheDelegation')
      : t('alreadyDeleted')
  }

  return t('notYourDelegation')
}

// fetch & format delegations part
const handleSearchValueSubmitted = (newSearchValue: string) => {
  search.value = newSearchValue
}

const route = useRoute()
const currentAccountId: Entity['accountId'] = Number(route.params.id)

const formatDelegations = (delegations: any) =>
  delegations.map(({
    accounts,
    creationDate,
    delegationId,
    delegatee: {
      firstName: delegateeFirstName,
      lastName: delegateeLastName,
      contactId: delegateeContactId,
    },
    delegator: {
      firstName: delegatorFirstName,
      lastName: delegatorLastName,
      contactId: delegatorContactId,
    },
    status,
  }: any) => ({
    id: delegationId,
    isEnabled: status === 'enabled',
    creationDate,
    accountLegalName: accounts.find((account: any) => account.accountId === currentAccountId).legalName,
    delegatee: {
      id: delegateeContactId,
      firstName: delegateeFirstName,
      lastName: delegateeLastName,
      isCurrentUser: delegateeContactId === userId.value,
    },
    delegator: {
      id: delegatorContactId,
      firstName: delegatorFirstName,
      lastName: delegatorLastName,
      isCurrentUser: delegatorContactId === userId.value,
    },
  }))

const getQueryParams = () => ({
  search: search.value,
})

const fetchDelegationsHistory = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  isLoading.value = true

  try {
    const { items }: any = await fetchAccountDelegationsHistory(currentAccountId, searchParams)
    const formattedDelegations = formatDelegations(items)
    delegations.value = formattedDelegations
  } catch (error) {
    logger.error(error)
  }

  isLoading.value = false
}

// delete delegation part
const displaySuccessNotification = (delegatee: Delegation['delegatee']) => {
  PNotification({
    message: t('successNotification', { delegateeFullName: `${delegatee.firstName} ${delegatee.lastName}` }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayErrorNotification = (delegatee: Delegation['delegatee']) => {
  PNotification({
    message: t('errorNotification', { delegateeFullName: `${delegatee.firstName} ${delegatee.lastName}` }),
    iconName: 'x',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const deleteDelegation = async (delegationId: Delegation['id'], delegatee: Delegation['delegatee']) => {
  try {
    await deleteAccountDelegation(delegationId)
    displaySuccessNotification(delegatee)
    await fetchDelegationsHistory()
  } catch (error) {
    displayErrorNotification(delegatee)
    logger.error(error)
  }
}

// init part
onMounted(async () => {
  await fetchDelegationsHistory()
})

watch(search, async () => {
  await fetchDelegationsHistory()
})
</script>

<i18n lang="yaml">
en-US:
  searchByName: 'Search by name'
  description: '{delegator} delegated the folder{delegatee}.'
  you: 'you'
  have: ''
  has: ''
  to: ' to '
  delegation: 'Delegation'
  successNotification: 'The delegation made to {delegatee} has been deleted.'
  errorNotification: 'The delegation made to {delegatee} has not been deleted.'
  deleteTheDelegation: 'Remove delegation'
  alreadyDeleted: 'You have already deleted the delegation'
  notYourDelegation: 'This is not your delegation'
fr-FR:
  searchByName: 'Rechercher par nom'
  description: '{delegator} délégué le dossier{delegatee}.'
  you: 'vous'
  have: 'avez'
  has: 'a'
  to: ' à '
  delegation: 'Délégation'
  successNotification: 'La délégation faite à {delegatee} a bien été supprimée.'
  errorNotification: "La délégation faite à {delegatee} n'a pas été supprimée."
  deleteTheDelegation: 'Supprimer la délégation'
  alreadyDeleted: 'Vous avez déja supprimé la délégation'
  notYourDelegation: "Ce n'est pas votre délégation"
</i18n>
