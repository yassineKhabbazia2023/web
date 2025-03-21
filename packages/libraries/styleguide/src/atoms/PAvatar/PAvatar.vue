<template>
  <div class="p-avatar-wrapper">
    <PIcon
      v-if="pSelected && pType=== 'small'"
      :color="AppColors.PRIMARY"
      size="12px"
      data-testid="avatar-check-icon"
      class="p-avatar-wrapper__check-icon"
      pName="checkCircle"
    />
    <ElAvatar
      :fit="pFit"
      size="default"
      :class="pClassMapper"
      class="p-avatar"
      :src="pSrc"
      :shape="pShape"
      data-testid="avatar"
    >
      <slot />
    </ElAvatar>
  </div>
</template>

<script setup lang="ts">
import PIcon from '../PIcon'
import { ElAvatar } from 'element-plus'
import { computed } from 'vue'
import type { PAvatarProps } from './PAvatarTypes'
import { AvatarRoles } from '../../utils/avatar.roles'
import { AppColors } from '../../utils/AppColorsEnum'

const DEFAULT_AVATAR_COLOR = 'persian-gradient'

const props = withDefaults(defineProps<PAvatarProps>(), {
  pType: 'default',
  pFit: 'cover',
  pShape: 'circle',
  pSelected: false,
})

const pClassMapper = computed(() => {
  const avatarColor = getAvatarColor()

  return {
    [`p-avatar--color-${avatarColor}`]: true,
    [`p-avatar--type-${props.pType}`]: true,
    'p-avatar--selected': props.pSelected && props.pType === 'small',
  }
})


const AVATAR_ROLES_COLORS: Record<AvatarRoles, PAvatarProps['pColor']> = {
  [AvatarRoles.COLLAB]: 'fuschia',
  [AvatarRoles.CLIENT]: 'persian-600',
}

const getAvatarColor = () => {
  // we allow to force the color
  if(props.pColor) {
    return props.pColor
  }
  // if we have a role, we use the role color
  // otherwise we use the default color
  return props.pRole ? AVATAR_ROLES_COLORS[props.pRole] : DEFAULT_AVATAR_COLOR
}

</script>
<style lang="scss" scoped>
.p-avatar-wrapper {
  position: relative;

  &__check-icon {
    z-index: 10;
    position: absolute;
    right: -3px;
    background: radial-gradient(
      circle,
      var(--el-color-base-white) 50%,
      var(--el-color-base-persian) 0%
    );
    border-radius: 50%;
  }
}
</style>
