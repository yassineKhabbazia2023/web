<template>
  <el-drawer
    v-model="drawerModel"
    :direction="direction"
    :showClose="false"
    class="p-drawer"
    :size="size"
    :appendToBody="appendToBody"
    :lockScroll="lockScroll"
    :closeOnClickModal="closeOnClickModal"
    :closeOnPressEscape="closeOnPressEscape"
    :openDelay="openDelay"
    :closeDelay="closeDelay"
    :destroyOnClose="destroyOnClose"
    :modal="modal"
    :withHeader="withHeader"
    :trapFocus="trapFocus"
    :draggable="draggable"
    :center="center"
    :alignCenter="alignCenter"
    :fullscreen="fullscreen"
    :customClass="customClass"
    :modalFade="modalFade"
  >
    <template #header>
      <div class="p-drawer__header">
        <div>
          <PButton
            type="generic"
            plain
            @click="$emit('drawer-previous-button-click')"
            v-if="showPreviousStep"
            class="el-button--icon p-drawer__step-back-button"
          >
            <PIcon>
              <PIArrowLeft />
            </PIcon>
          </PButton>
          <h3 class="p-drawer__title">
            {{ title }}
          </h3>
        </div>
        <PButton
          type="generic"
          plain
          @click="drawerModel = false"
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
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PButton from '@/atoms/PButton'
import PIcon from '@/atoms/PIcon'
import { type PDrawerProps } from './PDrawer'
import { ElDrawer } from 'element-plus'

const emit = defineEmits(['drawer-previous-button-click', 'update:modelValue'])

const props = withDefaults(defineProps<PDrawerProps>(), {
  direction: 'rtl',
  showPreviousStep: false,
  size: '33%',
  appendToBody: false,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  openDelay: 0,
  closeDelay: 0,
  destroyOnClose: false,
  modal: true,
  showClose: false,
  withHeader: true,
  trapFocus: false,
  draggable: false,
  center: false,
  alignCenter: false,
  fullscreen: false,
  customClass: '',
  modalFade: true
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

