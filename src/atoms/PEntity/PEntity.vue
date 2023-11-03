<template>
  <div
    :type="pType"
    :class="['p-entity', { selected: pSelected }]"
    :selected="pSelected"
  >
    <div class="p-entity__avatar">
      <PAvatar
        :pShape="pIconShape"
        :pType="pIconType"
        :pColor="pIconColor">
        <PIcon>
          <component :is="pIcon" />
        </PIcon>
      </PAvatar>
    </div>
    <div :class="['p-entity__content', 'text-left', { 'p-entity__content--bold': pBold }]">
      {{ pContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
// NOTE: la classe et props "selected" est redondante, faut cleaner sauf erreur.
import type { PEntityProps } from './PEntityTypes'

withDefaults(defineProps<PEntityProps>(), {
  pType: 'primary',
  pIcon: '',
  pIconShape: 'circle',
  pIconColor: 'persian-gradient',
  pIconType: 'xsmall',
  pBold: false,
  pSelected: false
})
</script>

<style lang="scss" scoped>
.p-entity {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;
  color: var(--el-fill-color-regular);

  &[type="primary"]:not([selected="true"]) {
    background-color: transparent;
  }

  &[type="secondary"]:not([selected="true"]) {
    background-color: var(--el-fill-color-lighter);
  }

  &[selected="true"] {
    background-color: var(--el-color-persian-200);
  }

  &__avatar {
    top: 2px;
  }

  &__content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 300px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0em;

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
