<template>
  <div class="entity-wrapper flex flex--align-items-center">
    <EntityItem
      :tooltipContent="entityTooltipContent"
      :tooltipDisabled="hideTooltip"
      :class="{ 'entity-wrapper--selected': selected }"
      :route="{ name: RouteName.ENTITY_REDIRECT, params: { [RouteParam.ENTITY_ID]: entity.accountId } }"
      @item-clicked="onEntitySelected(entity)"
    >
      <PAvatar
        pShape="circle"
        pType="small"
        :pColor="entityAvatarColor"
        :pSelected="selected"
        class="entity-wrapper__avatar margin-right--2"
      >
        <PIcon pName="pulse" />
      </PAvatar>
      <template #suffix-content>
        <div
          class="entity-wrapper__details text-left"
          :class="{ 'margin-left--1': !hideTooltip }"
        >
          <p class="entity-wrapper__details-name">
            {{ entity.legalName }}
          </p>
          <p class="entity-wrapper__details-ibs">
            {{ entity.accountNumber }}
          </p>
        </div>
      </template>
    </EntityItem>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import type { EntityAvatarProps } from './entity-avatar.type'
import type { Entity } from '@pulse/common/types'
import { RouteName, RouteParam, AmplitudeFeatureLocalisation } from '@pulse/common/enums'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import EntityItem from '../entity-item'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const props = defineProps<EntityAvatarProps>()
const emit = defineEmits<{
  'entity-selected': [Entity]
}>()

const onEntitySelected = (entity: Entity) => {
  TrackingCenter.trackHomepageConsulted(AmplitudeFeatureLocalisation.NAVIGATION)
  emit('entity-selected', entity)
}

const entityTooltipContent = computed(() => {
  return `${props.entity.legalName} \n ${props.entity.accountNumber}`
})
const entityAvatarColor = computed(() => getAvatarColorFromKey(props.entity?.accountNumber))
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
    color: var(--p-white);
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
    color: var(--p-white);
  }
  .entity-wrapper__details-name {
    font-weight: 700;
  }
  .entity-wrapper__avatar {
    pointer-events: none;
  }
}
</style>
