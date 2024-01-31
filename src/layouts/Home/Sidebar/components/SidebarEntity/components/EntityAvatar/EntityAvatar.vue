<template>
  <div class="entity-wrapper flex flex--align-items-center">
    <SidebarEntityItem
      :tooltipContent="entityTooltipContent"
      :tooltipDisabled="hideTooltip"
      :class="{ 'entity-wrapper--selected': selected }"
      :route="{ name: 'folder', params: { id: entity.idAccount } }"
      @item-clicked="$emit('entity-selected', entity)"
    >
      <PAvatar
        pShape="circle"
        pType="small"
        :pColor="entity.color"
        :pSelected="selected"
        class="entity-wrapper__avatar margin-right--2"
      >
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <template #suffix-content>
        <div
          class="entity-wrapper__details text-left"
          :class="{ 'margin-left--1': !hideTooltip }"
        >
          <p class="entity-wrapper__details-name">
            {{ entity.name }}
          </p>
          <p class="entity-wrapper__details-ibs">
            {{ entity.ibs }}
          </p>
        </div>
      </template>
    </SidebarEntityItem>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAvatar, PIPulse, PIcon } from '@kpmg/styleguide'
import type { Entity, EntityAvatarProps } from './EntityAvatarTypes'
import SidebarEntityItem from '../SidebarEntityItem'

const { entity, hideTooltip, selected } = defineProps<EntityAvatarProps>()
defineEmits<{
  'entity-selected': [Entity]
}>()

const entityTooltipContent = computed(() => {
  return `${entity.name} \n ${entity.ibs}`
})
</script>

<style scoped lang="scss">
.entity-wrapper {
  --smooth-transition: 0.4s ease 0s;

  &:hover {
    .entity-wrapper__avatar {
      &:before {
        opacity: 1;
      }
    }
  }

  &--selected {
    cursor: initial;

    .entity-wrapper__details {
      opacity: 0.6;
    }
  }

  &__avatar {
    position: relative;
    overflow: visible;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      display: block;
      width: 32px;
      height: 32px;
      background: rgba(#000, 0.16);
      border-radius: 50%;
      opacity: 0;
      transition: all var(--smooth-transition);
    }
  }

  &__details {
    color: var(--el-color-base-white);
    display: block;
    font-size: 1.2rem;
    line-height: 1.2;
    transition: all var(--smooth-transition);

    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 170px;
    }

    &-name {
      font-weight: 600;
    }

    &-ibs {
      font-weight: 400;
    }
  }
}

.sidenav__selected-item {
  p {
    color: var(--el-color-base-persian);
  }
  .entity-wrapper__details-name {
    font-weight: 700;
  }
  .entity-wrapper__avatar {
    pointer-events: none;
  }
}
</style>
