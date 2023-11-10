<template>
  <ElDrawer
    v-model="drawerModel"
    :direction="pDirection"
    :showClose="pShowClose"
    class="p-drawer"
    :size="pSize"
  >
    <template #header>
      <div class="p-drawer__header">
        <div>
          <PButton
            pType="generic"
            pPlain
            @click="$emit('drawer-previous-button-click')"
            v-if="pShowPreviousStep"
            class="el-button--icon p-drawer__step-back-button"
          >
            <PIcon>
              <PIArrowLeft />
            </PIcon>
          </PButton>
          <h3 class="p-drawer__title">
            {{ pTitle }}
          </h3>
        </div>
        <PButton
          pType="generic"
          pPlain
          @click="$emit('close-drawer-button')"
          class="el-button--icon p-drawer__close-button"
        >
          <PIcon>
            <PIX />
          </PIcon>
        </PButton>
      </div>
    </template>
    <slot />
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </ElDrawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElDrawer } from 'element-plus'
import PButton from '@/atoms/PButton'
import PIcon from '@/atoms/PIcon'
import type { PDrawerProps } from './PDrawerTypes'

const emit = defineEmits([
  'drawer-previous-button-click',
  'update:modelValue',
  'close-drawer-button'
])

const props = withDefaults(defineProps<PDrawerProps>(), {
  pDirection: 'rtl',
  pShowPreviousStep: false,
  pSize: '33%',
  pShowClose: false
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
