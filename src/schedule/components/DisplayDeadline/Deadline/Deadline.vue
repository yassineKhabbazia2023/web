<template>
  <div
    class="
      p-schedule-deadline
      flex
      flex--justify-content-space-between
      flex--align-items-center
    "
    v-for="(item, index) in deadlineData"
    :key="index">
    <div
      class="
        p-schedule-deadline__content
        flex flex--align-items-center
        flex--align-self-stretch
        padding-y--1
        padding-x--2
        flex--grow-1
      "
      @click="pushEventToListItem"
    >
      <Icon :status="item.globalStatus" />
      <span class="p-schedule-deadline__content-label font-semibold">{{
        `${isCollab
          ? item.template.typeShortCollaborator
          : item.template.typeShortCustomer} (${item.template?.typeLong})` }}</span>
      <PIcon color="#666666">
        <PIArrowRight />
      </PIcon>
      <span class="p-schedule-deadline__content-progress">
        {{ progressText(item.accountList) }}</span>
    </div>
    <Tag class="p-schedule-deadline__tag" :status="item.globalStatus" />
    <PToolbox
      trigger="click"
      :pElements="actionsBuilder(item.globalStatus)"
    >
      <PButton
        pType="generic"
        pIconOnly
        pSize="small"
      >
        <PIcon>
          <PIThreeDots />
        </PIcon>
      </PButton>
    </PToolbox>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tag from '@/schedule/components/Common/Tag'
import Icon from '@/schedule/components/Common/Icon'
import {
  PIcon, PIArrowRight, PToolbox, PIThreeDots, PButton,
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import type { Deadline, Status } from '@/schedule/models/Deadline'
import { getDeadlineCompletionSummary } from '@/schedule/helpers/deadlineHelper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isCollab = true

defineProps({
  deadlineData: { type: Array as () => Deadline[], required: true },
})

const emit = defineEmits<{
  'update-drawer-visibility': [value: string]
}>()

const progressText = (accountList: any) => {
  const completion = getDeadlineCompletionSummary(accountList)
  if (completion.accountsAmount === 1) {
    return accountList[0]?.name
  }
  return `${completion.accountsWithCompletedDeadline}/${completion.accountsAmount} ${t('files-done')}`
}

const actionsBuilder = (status: Status): PToolboxItemProps[] => {
  return [
    {
      pIconName: 'PIEye',
      pValue: t('reminder-details'),
      disabled: !status,
      pActionName: 'view-reminder-details',
      pState: 'default',
    },
    {
      pIconName: 'PITrash',
      pValue: t('delete-reminder'),
      disabled: !status,
      pActionName: 'delete-reminder',
      pState: 'danger',
    },
  ]
}

const pushEventToListItem = () => {
  emit('update-drawer-visibility', '')
}
</script>

<style lang="scss" scoped>
.p-schedule-deadline{
  height: 30px;
  margin-bottom: 2px;

  &:hover {
    border-radius: 8px;
    background-color: var(--el-color-neutral-gray-50)
  }

  &__content {
    gap: 8px;

    &-label {
      color: var(--el-color-neutral-gray-900);
    }

    &-progress {
      color: var(--el-color-neutral-gray-500);
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    files-done: 'files done'
    reminder-details: 'View the reminder detail'
    delete-reminder: 'Delete the reminder'
  fr-FR:
    files-done: 'dossiers fait'
    reminder-details: 'Voir le détail du rappel'
    delete-reminder: 'Supprimer le rappel'
</i18n>
