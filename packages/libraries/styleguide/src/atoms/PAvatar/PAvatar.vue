<template>
  <div class="p-avatar-wrapper">
    <PIcon
      v-if="pSelected && pType=== 'small'"
      :color="AppColors.PRIMARY"
      size="12px"
      data-testid="avatar-check-icon"
      class="p-avatar-wrapper__check-icon"
     pName="checkCircle" />
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
import { AppColors } from '../../utils/AppColorsEnum'

const props = withDefaults(defineProps<PAvatarProps>(), {
  pType: 'default',
  pFit: 'cover',
  pColor: 'persian-gradient',
  pSrc: '',
  pShape: 'circle',
  pSelected: false,
})

const pClassMapper = computed(() => ({
  [`p-avatar--color-${props.pColor}`]: true,
  [`p-avatar--type-${props.pType}`]: true,
  'p-avatar--selected': props.pSelected && props.pType === 'small',
}))

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
      var(--el-color-base-white) 68%,
      var(--el-color-base-persian) 0%
    );
    border-radius: 50%;
  }
}
</style>
