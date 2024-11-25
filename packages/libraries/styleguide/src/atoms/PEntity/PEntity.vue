<template>
  <div
    :type="pType"
    :class="['p-entity', typeModifierClass]"
    :selected="pSelected"
  >
    <div class="p-entity__avatar">
      <PAvatar
        :pShape="pIconShape"
        :pType="pIconType"
        :pColor="pIconColor">
        <PIcon v-if="pIcon">
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
import { computed } from 'vue'
import PAvatar from '../PAvatar'
import PIcon from '../PIcon'
import type { PEntityProps } from './PEntityTypes'

const props = withDefaults(defineProps<PEntityProps>(), {
  pType: 'primary',
  pIcon: '',
  pIconShape: 'circle',
  pIconColor: 'persian-gradient',
  pIconType: 'xsmall',
  pBold: false,
  pSelected: false,
})

const typeModifierClass = computed(() => `p-entity--type-${props.pType}`)

</script>

<style lang="scss" scoped>
.p-entity {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;
  color: var(--el-fill-color-regular);

  &--type-primary:not([selected="true"]) {
    background-color: transparent;
  }

  &--type-secondary:not([selected="true"]) {
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
    font-size: 1.4rem;
    font-weight: 400;
    letter-spacing: 0em;

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
