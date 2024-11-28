<template>
  <div
    v-for="(item, index) in internalList"
    :key="index"
    class="
      p-schedule-deadline
      flex
      flex--justify-content-space-between
      flex--align-items-center
    "
  >
    <div
      class="
        p-schedule-deadline__content
        flex flex--align-items-center
        flex--align-self-stretch
        padding-y--1
        padding-x--2
        flex--grow-1
      "
      @click="emit('select-deadline', item.occurrenceId)"
    >
      <Icon :status="item.globalStatus" />
      <span class="p-schedule-deadline__content-label font-semibold">
        {{ item.typeLabel }}
      </span>
      <PIcon :color="AppColors.GRAY_500" pName="arrowRight" />
      <span class="p-schedule-deadline__content-progress">
        {{ item.progressText }}</span>
    </div>
    <Tag class="p-schedule-deadline__tag" :status="item.globalStatus" />
    <PToolbox
      trigger="click"
      :pElements="item.toolboxElements"
      @p-toolbox-item-clicked="actionClicked($event, item.occurrenceId)"
    >
      <PButton
        pIconOnly
        pSize="small"
      >
        <PIcon pName="threeDots" />
      </PButton>
    </PToolbox>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tag from '@app/schedule/components/Common/Tag'
import Icon from '@app/schedule/components/Common/Icon'
import {
  PIcon, PToolbox, PButton,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { Status } from '@app/schedule/models/Deadline'
import { getProgressText } from '@app/schedule/helpers/deadlineHelper'
import { getScheduleModelsByKey } from '@app/schedule/services'
import { getTypeLabel } from '@app/schedule/helpers/utils'
import type { DeadlinesProps, DeadlineEvent } from './DeadlinesTypes'
import { amplitudeService } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const scheduleModelsByKey = ref<Record<string, string>>()

const props = defineProps<DeadlinesProps>()

const emit = defineEmits<{
  'select-deadline': [occurrenceId: number]
}>()

const getToolboxElements = (status: Status): PToolboxItemProps[] => {
  return [
    {
      pIconName: 'eye',
      pValue: t('reminder-details'),
      disabled: !status,
      pActionName: 'view-reminder-details',
      pState: 'default',
    },
    {
      pIconName: 'trash',
      pValue: t('delete-reminder'),
      disabled: true,
      pActionName: 'delete-reminder',
      pState: 'danger',
    },
  ]
}

const internalList = computed(() => {
  return props.deadlines
    .map((deadline) => {
      const { globalStatus, occurrenceId } = deadline

      const typeLabel = getTypeLabel(scheduleModelsByKey.value, deadline.template)
      const progressText = getProgressText(deadline.accountList, t('files-done'))
      const toolboxElements = getToolboxElements(deadline.globalStatus)

      return {
        occurrenceId,
        globalStatus,
        typeLabel,
        progressText,
        toolboxElements,
      }
    })
})

onMounted(() => {
  scheduleModelsByKey.value = getScheduleModelsByKey('both')
})

const actionClicked = (event: DeadlineEvent, occurrenceId: number) => {
  const actions: Record<DeadlineEvent, () => void> = {
    'view-reminder-details': () => {
      amplitudeService.track('Reminder Consulted', {
        reminder_consultation_localisation: 'list',
      })
      emit('select-deadline', occurrenceId)
    },
  }
  try {
    actions[event]()
  } catch (error) {
    logger.error(error)
  }
}
</script>

<style lang="scss" scoped>
.p-schedule-deadline{
  height: 30px;
  margin-bottom: 2px;

  &:hover {
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-color-persian-100);
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
