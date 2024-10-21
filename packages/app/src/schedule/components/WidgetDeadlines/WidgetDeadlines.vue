<template>
  <PScrollbar>
    <ul
      class="
        widget-deadlines
        list-style-none
        flex
        flex--direction-column
        flex-gap--1
        padding--1
        padding-bottom--4
      "
    >
      <li
        v-for="(item, index) in internalList"
        :key="index"
        data-testid="widget-deadlines-item"
        class="
          widget-deadlines__item
          flex
          radius--2
          padding--2
          cursor-pointer
          hover-bg--persian-100
        "
        @click="$emit('select-deadline', item.occurrenceId)"
      >
        <div class="widget-deadlines__item__icon margin-right--2">
          <Icon :status="item.globalStatus" />
        </div>
        <div>
          <p class="text-color--neutral-gray-900 font-semibold">
            {{ item.typeLabel }}
          </p>
          <p class="padding-top--1 text-color--neutral-gray-700">
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
import { PScrollbar } from '@pulse/styleguide'
import { getTypeLabel } from '@app/schedule/helpers/utils'
import { getScheduleModelsByKey } from '@app/schedule/services'
import { getProgressText } from '@app/schedule/helpers/deadlineHelper'
import type { WidgetDeadlinesProps } from './WidgetDeadlinesTypes'
import Icon from '@app/schedule/components/Common/Icon'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineEmits<{
  'select-deadline': [occurrenceId: number]
}>()

const scheduleModelsByKey = ref<Record<string, string>>()

const props = defineProps<WidgetDeadlinesProps>()

const internalList = computed(() => {
  return props.deadlines
    .map((deadline) => {
      const { globalStatus, occurrenceId } = deadline

      const typeLabel = getTypeLabel(scheduleModelsByKey.value, deadline.template)
      const progressText = getProgressText(deadline.accountList, t('files-done'))

      return {
        globalStatus,
        typeLabel,
        progressText,
        occurrenceId,
      }
    })
})
onMounted(() => {
  scheduleModelsByKey.value = getScheduleModelsByKey('both')
})
</script>

<style lang="scss" scoped>
.widget-deadlines {
  &__item {
    background-color: #fff;
    // see explainations here: https://blog.dudak.me/2014/css-shadows-under-adjacent-elements/
    position: relative;
    z-index: 10;
    &::before {
      content: "";
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: var(--el-border-radius-base);
      box-shadow: var(--el-box-shadow);
    }
    &:hover {
      background-color: var(--el-color-persian-100);
    }
    &__icon {
      padding-top: 2px;
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    files-done: 'files done'
  fr-FR:
    files-done: 'dossiers fait'
</i18n>
