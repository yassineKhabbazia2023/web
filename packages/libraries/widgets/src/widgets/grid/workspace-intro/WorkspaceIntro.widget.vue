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
        flex-gap--3
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
        @click="$emit('workspace-intro-cta')"
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
import { useResponsive } from '@pulse/styleguide'

interface WorkspaceIntroProps {
  tagText?: string
  title?: string
  description?: string
  primaryLabel?: string
}

const props = defineProps<WorkspaceIntroProps>()

defineEmits<{
  'workspace-intro-cta': []
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const { isMobile } = useResponsive()

const resolvedTagText = computed(() =>
  props.tagText === undefined ? t('widgets.workspaceIntro.tag') : props.tagText,
)
const resolvedTitle = computed(() =>
  props.title === undefined ? t('widgets.workspaceIntro.title') : props.title,
)
const resolvedDescription = computed(() =>
  props.description === undefined ? t('widgets.workspaceIntro.description') : props.description,
)
const resolvedPrimaryLabel = computed(() => {
  if (props.primaryLabel !== undefined) {
    return props.primaryLabel
  }

  // Use a shorter label on mobile so the button fits within the widget width
  return isMobile.value === true
    ? t('widgets.workspaceIntro.primaryActionMobile')
    : t('widgets.workspaceIntro.primaryAction')
})
</script>
