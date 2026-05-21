<template>
  <div
    class="prospect-home-page"
    data-testid="prospect-home-page"
  >
    <PEntityHeader
      v-if="currentEntity && isMobile === false"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      :pAccountType="currentEntity.accountType"
      class="margin-bottom--4"
    />
    <div
      class="
        prospect-home-page__main-section
        grid
        grid-gap--10
        margin-y--4
      "
    >
      <div
        v-for="widget in widgets"
        :key="widget.name"
        :class="['prospect-home-page__grid-item', widget.spanClass]"
      >
        <component
          :is="widget.name"
          v-bind="widget.props"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PEntityHeader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { WidgetName, WidgetSize } from '@pulse/widgets/enums'
import type { WidgetGridDefinition } from '@pulse/widgets/types'
import { useProspectContacts } from './use-prospect-contacts.composable'

const { isMobile } = useResponsive()
const { currentEntity } = storeToRefs(useCurrentEntityStore())
const { contacts, isContactsLoading } = useProspectContacts()

const widgets = computed<(WidgetGridDefinition & { spanClass: string })[]>(() => {
  const definitions: WidgetGridDefinition[] = [
    { name: WidgetName.WORKSPACE_INTRO, size: WidgetSize.TWO_SPANS },
    {
      name: WidgetName.CONTACTS,
      size: WidgetSize.ONE_CELL,
      props: {
        contacts: contacts.value,
        loading: isContactsLoading.value,
      },
    },
    { name: WidgetName.RSS_NEWS, size: WidgetSize.THREE_SPANS },
  ]

  return definitions.map((widget) => ({
    ...widget,
    spanClass: `prospect-home-page__grid-item--span-${widget.size}`,
  }))
})
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.prospect-home-page {
  &__main-section {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    min-height: 340px;
  }

  &__grid-item {
    overflow: hidden;
    min-width: 0;

    &--span-1 {
      grid-column: span 1;
    }

    &--span-2 {
      grid-column: span 2;
    }

    &--span-3 {
      grid-column: span 3;
    }
  }

  @include breakpoints.media(md) {
    &__main-section {
      grid-template-columns: repeat(2, minmax(250px, 1fr));

      .prospect-home-page__grid-item {
        &--span-2 {
          grid-column: 1 / -1;
        }
      }
    }
  }

  @include breakpoints.media(xs) {
    &__main-section {
      grid-template-columns: 1fr;

      .prospect-home-page__grid-item {
        &--span-1,
        &--span-2,
        &--span-3 {
          grid-column: 1 / -1;
        }
      }
    }
  }
}
</style>
