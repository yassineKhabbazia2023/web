<template>
  <div>
    <CatalogStatusError
      v-if="apiCallStatus === APICallStatus.ERROR"
      class="margin-y--12"
    />

    <POverlay
      v-if="apiCallStatus === APICallStatus.LOADING"
      class="position--absolute"
    >
      <div
        class="margin-y--12"
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>
    </POverlay>

    <CatalogStatusMessage
      v-if="showNoResult"
      :message="t('noResult')"
      iconName="person"
      class="margin-y--12"
    />

    <PTable
      v-if="showTable"
      :pData="formattedReferents"
      pFit
    >
      <PTableColumn
        :pWidth="48"
      >
        <template #default="{ row }">
          <PAvatar
            pShape="circle"
            pType="small"
            :pRole="AvatarRoles.COLLAB"
          >
            {{ row.initials }}
          </PAvatar>
        </template>
      </PTableColumn>
      <PTableColumn
        v-for="({ columnProp, columnLabel }, index) in tableReferentsColumns"
        :key="index"
        :pProp="columnProp"
        :pLabel="columnLabel"
        pSortable
      >
        <template #default="{ row, column }">
          <div
            class="
              white-space--wrap
              word-break--normal
            "
          >
            {{ row[column.property] }}
          </div>
        </template>
      </PTableColumn>
      <PTableColumn
        :pWidth="48"
      >
        <template #default="{ row }">
          <PTooltip
            :pContent="t('copy.tooltip')"
            pPlacement="top"
            :pShowAfter="500"
            :pHideAfter="0"
          >
            <PButton
              data-testid="copy-content"
              @click="onClickCopy(row.email)"
            >
              <PIcon
                pName="files"
              />
            </PButton>
          </PTooltip>
        </template>
      </PTableColumn>
    </PTable>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { PTable, PTableColumn, PAvatar, POverlay, PLoader, PButton, PIcon, PTooltip } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { CatalogDrawerContentReferentsProps } from './catalog-drawer-content-referents.types'
import { getTableReferentsColumns, getFormattedReferents, copyColumnContent } from './catalog-drawer-content-referents.utils'
import { APICallStatus } from '@pulse/common/enums'
import CatalogStatusError from '../catalog-status-error/catalog-status-error.vue'
import CatalogStatusMessage from '../catalog-status-message/catalog-status-message.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CatalogDrawerContentReferentsProps>()

const columnLabels: Record<string, string> = {
  name: t('name'),
  hub: t('hub'),
  email: t('email'),
}
const formattedReferents = computed(() => getFormattedReferents(props.offerReferents))
const showTable = computed(() => props.apiCallStatus === APICallStatus.SUCCESS &&
  (props.offerReferents ?? []).length > 0)
const showNoResult = computed(() => props.apiCallStatus === APICallStatus.SUCCESS &&
  (props.offerReferents ?? []).length === 0)
const tableReferentsColumns = getTableReferentsColumns(columnLabels)

function onClickCopy(value: string) {
  copyColumnContent(
    value,
    t('copy.success'),
    t('copy.error'),
  )
}
</script>

<i18n lang="yaml">
  en-US:
    name: 'First Name Last Name'
    hub: 'Hub'
    email: 'Email Address'
    noResult: 'The referents are not specified for this offer, we apologize.'
    copy:
      tooltip: "Copy the referent's email address"
      success: 'The email address has been successfully copied.'
      error: 'Failed to copy the email address.'
  fr-FR:
    name: 'Prénom Nom'
    hub: 'Hub'
    email: 'Adresse e-mail'
    noResult: 'Les référents ne sont pas spécifiés pour cette offre, nous vous prions de nous excuser.'
    copy:
      tooltip: "Copier l'adresse email du référent"
      success: 'L’adresse e-mail a bien été copiée.'
      error: 'Échec lors de la copie de l’adresse e-mail.'
</i18n>
