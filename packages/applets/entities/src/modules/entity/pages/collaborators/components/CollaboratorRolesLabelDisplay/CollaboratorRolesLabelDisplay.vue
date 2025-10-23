<template>
  <PTag
    v-for="{ labelId, description, business } in roleLabels.main"
    :key="labelId"
    :pContent="description"
    :pColor="getBusinessRoleColor(business)"
    class="margin-x--1 margin-y--2"
  />
  <PPopover
    v-if="roleLabels.others.length > 0"
    pTitle=""
    pTrigger="hover"
    pShowArrow
    popperClass="roles-other-popover"
  >
    <template #content>
      <template
        v-for="({ description, business }, index) in
          roleLabels.others"
        :key="index"
      >
        <PTag
          :pContent="description"
          :pColor="getBusinessRoleColor(business)"
          class="margin-x--1 margin-bottom--2"
        />
        <br v-if="index % 2 === 1">
      </template>
    </template>
    <PTag
      :pContent="roleLabelsOthersCount"
      :pColor="getOverflowIndicatorColor(roleLabels.others)"
      class="margin-x--1 margin-y--2"
    />
  </PPopover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PPopover,
  PTag,
} from '@pulse/styleguide/components'
import type { CollaboratorRolesLabelDisplayProps } from './collaborator-roles-label-display.types'
import { getBusinessRoleColor, getOverflowIndicatorColor } from '../../utils/collaborators.utils'

const props = defineProps<CollaboratorRolesLabelDisplayProps>()

const roleLabelsOthersCount = computed(() => `+${props.roleLabels.others.length}`)
</script>

<style lang="scss">
.roles-other-popover {
  /* Width was fixed — set to auto to fit content */
  width: auto !important;
}
</style>
