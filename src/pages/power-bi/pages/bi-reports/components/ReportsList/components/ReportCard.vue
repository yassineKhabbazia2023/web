<template>
  <button
    class="
      report-card
      flex
      flex--align-items-center
      flex--justify-content-flex-start
      flex-gap--2
      radius--1
      padding-x--3
      padding-y--2
    "
    :class="{ 'report-card--selected': internalIsSelected }"
    @click="handleReportSelection"
  >
    <PIcon
      size="16"
      class="report-card__icon"
      data-testid="report-card-icon"
    >
      <PIFiletypeNone />
    </PIcon>
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
import { PIcon, PIFiletypeNone } from '@kpmg/styleguide'
import { DATE_TIME_FORMATS as datetimeFormats } from '@/constants'
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
    white-space: nowrap;
    overflow: hidden;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name,
  &__icon {
    transition: all 0.3s ease;
  }

  &:hover {
    #{$self}__name,
    #{$self}__icon {
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
