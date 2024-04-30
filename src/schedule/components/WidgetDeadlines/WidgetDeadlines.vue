<template>
  <PScrollbar>
    <ul
      class="
        list-style-none
        flex
        flex--direction-column
        flex-gap--5
      "
    >
      <li
        v-for="(item, index) in internalList"
        :key="index"
        data-testid="widget-deadlines-item"
        class="flex"
      >
        <div class="padding-top--1 margin-right--2">
          <Icon :status="item.globalStatus" />
        </div>
        <div>
          <p class="text-color--neutral-gray-900 font-semibold">
            {{ item.typeLabel }}
          </p>
          <p class="text-color--neutral-gray-700">
            {{ item.progressText }}
          </p>
        </div>
      </li>
    </ul>
  </PScrollbar>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PScrollbar } from '@kpmg/styleguide'
import { getTypeLabel } from '@/schedule/helpers/utils'
import { getScheduleModelsByKey } from '@/schedule/services'
import { getProgressText } from '@/schedule/helpers/deadlineHelper'
import type { WidgetDeadlinesProps } from './WidgetDeadlinesTypes'
import Icon from '@/schedule/components/Common/Icon'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const scheduleModelsByKey = ref<Record<string, string>>()

const props = defineProps<WidgetDeadlinesProps>()

const internalList = computed(() => {
  return props.deadlines
    .map((deadline) => {
      const { globalStatus } = deadline

      const typeLabel = getTypeLabel(scheduleModelsByKey.value, deadline.template)
      const progressText = getProgressText(deadline.accountList, t('files-done'))

      return {
        globalStatus,
        typeLabel,
        progressText,
      }
    })
})
onMounted(() => {
  scheduleModelsByKey.value = getScheduleModelsByKey('both')
})
</script>

<i18n lang="yaml">
  en-US:
    files-done: 'files done'
  fr-FR:
    files-done: 'dossiers fait'
</i18n>
