<template>
  <section
    class="
      widget-workspace-intro
      bg--surface-client
      padding--6
      flex
      flex--direction-column
      flex-gap--3
    "
    data-testid="widget-workspace-intro"
  >
    <PTag
      class="flex--align-self-flex-start"
      :pContent="resolvedTagText"
      pColor="light-green"
      pIconLeftName="stars"
    />

    <div
      class="
        flex
        flex--direction-column
        flex-gap--1
      "
    >
      <h1 class="h1 text-color--base-white">
        {{ resolvedTitle }}
      </h1>
      <p class="font-base text-color--base-white">
        {{ resolvedDescription }}
      </p>
    </div>

    <div
      class="
        flex
        flex--wrap
        flex-gap--3
      "
    >
      <PButton
        pType="primary"
        data-testid="widget-workspace-intro-primary-action"
        @click="$emit('complete-info')"
      >
        {{ resolvedPrimaryLabel }}
        <PIcon
          class="el-button__icon--right"
          pName="arrowRight"
        />
      </PButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PTag } from '@pulse/styleguide/components'

interface WorkspaceIntroProps {
  tagText?: string
  title?: string
  description?: string
  primaryLabel?: string
}

const props = defineProps<WorkspaceIntroProps>()

defineEmits<{
  'complete-info': []
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const resolvedTagText = computed(() =>
  props.tagText === undefined ? t('widgets.workspaceIntro.tag') : props.tagText,
)
const resolvedTitle = computed(() =>
  props.title === undefined ? t('widgets.workspaceIntro.title') : props.title,
)
const resolvedDescription = computed(() =>
  props.description === undefined ? t('widgets.workspaceIntro.description') : props.description,
)
const resolvedPrimaryLabel = computed(() =>
  props.primaryLabel === undefined ? t('widgets.workspaceIntro.primaryAction') : props.primaryLabel,
)
</script>
