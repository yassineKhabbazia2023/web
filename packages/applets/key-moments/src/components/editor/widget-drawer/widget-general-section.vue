<template>
  <div>
    <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.title')">
      <PInput
        :modelValue="widget?.display.title"
        pSize="small"
        :pPlaceholder="t('keyMoments.settings.widgetDrawer.titleHint')"
        pTestId="key-moments-settings-widget-title-input"
        @update:model-value="(title: string | number) => setDisplay({ title: String(title) })"
      />
    </PFormItem>

    <PFormItem
      :pLabel="t('keyMoments.settings.widgetDrawer.id')"
      :pError="draftIdError"
    >
      <PInput
        :modelValue="widget?.id"
        pSize="small"
        :pReadonly="areIdsEditable === false"
        pTestId="key-moments-settings-widget-id-input"
        @update:model-value="(id: string | number) => setId(String(id))"
        @change="() => normalizeId()"
      />
    </PFormItem>

    <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.renderer')">
      <PDropdown
        :modelValue="widget?.display.renderer"
        :pOptions="rendererOptions"
        pSize="small"
        pTestId="key-moments-settings-widget-renderer-select"
        @update:model-value="value => setDisplay({ renderer: String(value) })"
      />
    </PFormItem>

    <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.span')">
      <PDropdown
        :modelValue="widget?.display.span ?? 12"
        :pOptions="spanOptions"
        pSize="small"
        pTestId="key-moments-settings-widget-span-select"
        @update:model-value="value => setDisplay({ span: Number(value) })"
      />
    </PFormItem>

    <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.comment')">
      <PInput
        :modelValue="(widget?.comment as string | undefined) ?? ''"
        pSize="small"
        :pPlaceholder="t('keyMoments.settings.widgetDrawer.commentHint')"
        pTestId="key-moments-settings-widget-comment-input"
        @update:model-value="(slot: string | number) => setComment(String(slot))"
      />
    </PFormItem>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDropdown, PFormItem, PInput } from '@pulse/styleguide/components'
import { Renderer } from '@key-moments/enums/key-moments.enums'
import { SPAN_OPTIONS } from './widget-drawer.consts'
import { useWidgetDrawer } from './widget-drawer.composable'

const { t } = useI18n()

const {
  widget,
  draftIdError,
  areIdsEditable,
  setDisplay,
  setId,
  normalizeId,
  setComment,
} = useWidgetDrawer()

const rendererOptions = computed(() => Object.values(Renderer).map(renderer => ({
  pValue: renderer,
  pLabel: t(`keyMoments.settings.renderers.${renderer}`),
})))

const spanOptions = computed(() => SPAN_OPTIONS.map(span => ({
  pValue: span,
  pLabel: t(`keyMoments.settings.widgetDrawer.spans.${span}`),
})))
</script>
