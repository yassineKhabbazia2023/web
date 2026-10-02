<template>
  <div data-testid="key-moments-settings-recommendations-page">
    <div
      class="
        flex
        flex--align-items-center
        flex-gap--4
        margin-bottom--4
      "
    >
      <span class="text-color--text-neutral">
        {{ t('keyMoments.settings.recommendations.categories.count', { count: categories.length }, categories.length) }}
      </span>

      <PButton
        class="margin-left--auto"
        pSize="small"
        pType="primary"
        pTestId="key-moments-settings-recommendations-categories-create-button"
        @click="drawer?.openCreate()"
      >
        {{ t('keyMoments.settings.recommendations.categories.create') }}
      </PButton>
    </div>

    <p
      class="
        font-small
        text-color--text-neutral
        margin-bottom--2
      "
    >
      {{ t('keyMoments.settings.recommendations.categories.hint') }}
    </p>

    <div
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        margin-top--8
      "
      data-testid="key-moments-settings-recommendations-categories-loader"
    >
      <PLoader
        pType="primary"
        pSize="50"
      />
    </div>

    <p
      v-else-if="categories.length === 0"
      class="text-color--text-neutral"
      data-testid="key-moments-settings-recommendations-categories-empty"
    >
      {{ t('keyMoments.settings.recommendations.categories.empty') }}
    </p>

    <ul
      v-else
      class="key-moments-editor-list list-style-none"
      data-testid="key-moments-settings-recommendations-categories-list"
    >
      <li
        v-for="category in categories"
        :key="category.id"
        class="
          key-moments-editor-list__row
          flex
          flex--align-items-center
          flex-gap--2
        "
        :data-testid="`key-moments-settings-recommendations-category-${category.id}`"
      >
        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--grow">
          <span class="font-semibold">{{ category.label }}</span>
          <span
            class="
              key-moments-categories__pitch
              font-small
              text-color--text-neutral
              overflow-hidden
              text-overflow--ellipsis
              no-wrap
            "
          >
            {{ category.pitch }}
          </span>
        </span>

        <span class="flex flex-gap--1">
          <PButton
            pSize="small"
            pType="secondary"
            :pTestId="`key-moments-settings-recommendations-category-${category.id}-edit-button`"
            @click="drawer?.openEdit(category)"
          >
            {{ t('keyMoments.settings.recommendations.categories.edit') }}
          </PButton>
          <PButton
            pSize="small"
            pIconOnly
            pType="tertiary"
            :aria-label="t('keyMoments.settings.recommendations.categories.remove')"
            :pTestId="`key-moments-settings-recommendations-category-${category.id}-remove-button`"
            @click="pendingRemoval = category"
          >
            <PIcon pName="trash" />
          </PButton>
        </span>
      </li>
    </ul>

    <!-- The exercices already copied from it keep their copy: only the referential loses it -->
    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="pendingRemoval !== undefined"
      :pTitle="t('keyMoments.settings.recommendations.categories.remove')"
      :pConfirmButtonContent="t('keyMoments.settings.recommendations.categories.confirmRemove')"
      :pCancelButtonContent="t('keyMoments.settings.recommendations.categories.cancel')"
      pTestId="key-moments-settings-recommendations-categories-remove-popup"
      @on-confirm-button-click="confirmRemoval"
      @on-cancel-button-click="pendingRemoval = undefined"
    >
      <p>
        {{ t('keyMoments.settings.recommendations.categories.removeText', { label: pendingRemoval?.label ?? '' }) }}
      </p>
    </PConfirmationPopup>

    <CategoryDrawer
      ref="drawer"
      @saved="load"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PButton,
  PConfirmationPopup,
  PIcon,
  PLoader,
} from '@pulse/styleguide/components'
import CategoryDrawer from '@key-moments/components/recommendations-settings/category-drawer/category-drawer.vue'
import { useRecommendationsSettings } from './recommendations-settings.composable'
import type { CategoryPayload } from '@key-moments/services/recommendations.service.types'

const { t } = useI18n()

const { categories, isLoading, load, remove } = useRecommendationsSettings()

const drawer = useTemplateRef<InstanceType<typeof CategoryDrawer>>('drawer')
const pendingRemoval = ref<CategoryPayload>()

async function confirmRemoval(): Promise<void> {
  const category = pendingRemoval.value

  pendingRemoval.value = undefined

  if (category !== undefined) {
    await remove(category.id)
  }
}
</script>

<style scoped lang="scss">
@use '@key-moments/styles/editor';

.key-moments-editor-list {
  @include editor.list;
}

.key-moments-categories {
  &__pitch {
    display: block;
  }
}
</style>
