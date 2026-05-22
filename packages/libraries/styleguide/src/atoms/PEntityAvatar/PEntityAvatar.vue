<template>
  <PAvatar
    :pShape="pShape"
    :pType="pType"
    :pColor="resolvedColor"
    :pRole="avatarRole"
    :pSelected="pSelected"
    data-testid="entity-avatar"
  >
    <PIcon
      v-if="isProspect === false"
      pName="pulse"
    />
  </PAvatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PAvatar from '../PAvatar'
import PIcon from '../PIcon'
import { AvatarRoles } from '../../utils/avatar.roles'
import type { PEntityAvatarProps } from './PEntityAvatarTypes'

const props = withDefaults(defineProps<PEntityAvatarProps>(), {
  pType: 'default',
  pShape: 'circle',
  pSelected: false,
})

const isProspect = computed(() => props.pAccountType === 'PROSPECT')
const avatarRole = computed(() => (isProspect.value === true ? AvatarRoles.PROSPECT : undefined))
const resolvedColor = computed(() => (isProspect.value === true ? undefined : props.pColor))
</script>
