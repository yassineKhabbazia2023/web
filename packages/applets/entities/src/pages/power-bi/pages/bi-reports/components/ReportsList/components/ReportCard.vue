<template>
  <button
    class="
      report-card
      flex
      flex--direction-column
      flex--justify-content-flex-start
      flex-gap--2
      padding-x--3
      padding-y--2
    "
    :class="{ 'report-card--selected': internalIsSelected }"
    @click="handleReportSelection"
  >
    <PTag
      pColor="persian"
      pSize="default"
      :pContent="type"
      pEffect="plain"
      data-testid="report-card-type"
    />
    <div class="report-card__details flex flex--direction-column">
      <p class="report-card__name" data-testid="report-card-name">
        {{ name }}
      </p>
      <p
        class="font-small text-color--neutral-gray-500 margin-top--1"
        data-testid="report-card-updated-on"
      >
        {{ updatedOn }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTag } from '@pulse/styleguide/components'
import { DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import type { ReportCardProps } from './ReportCardTypes'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = withDefaults(defineProps<ReportCardProps>(), {
  isSelected: false,
})
const emit = defineEmits<{
  'select-report': []
  'update:is-selected': [boolean]
}>()

const internalIsSelected = computed({
  get() {
    return props.isSelected
  },
  set(isSelected) {
    emit('update:is-selected', isSelected)
  },
})
const updatedOn = computed(
  () => `${t('updatedOn')} ${d(new Date(props.updatedDate), 'short')}`,
)

const handleReportSelection = () => {
  internalIsSelected.value = !internalIsSelected.value
  emit('select-report')
}
</script>

<style lang="scss" scoped>
.report-card {
  $self: &;
  width: 100%;
  border: 1px solid var(--el-color-neutral-gray-100);
  appearance: none;
  background: none;
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;

  &__details {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease;
  }

  &:hover {
    #{$self}__name {
      color: var(--el-color-persian-500);
    }
  }

  &--selected {
    background: var(--el-color-persian-50);
    border: 1px solid var(--el-color-persian-500);
    #{$self}__name {
      font-weight: 600;
    }
    #{$self}__name,
    #{$self}__icon {
      color: var(--el-color-persian-500);
    }
  }
}
</style>

<i18n lang="yaml">
en-US:
  updatedOn: 'Updated on'
fr-FR:
  updatedOn: 'Actualisé le'
</i18n>
