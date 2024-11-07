<template>
  <ElDrawer
    v-model="drawerModel"
    :direction="pDirection"
    :showClose="pShowClose"
    class="p-drawer"
    :size="pSize"
    :modalClass="pModalClass"
    :withHeader="pWithHeader"
  >
    <template #header>
      <div
        class="p-drawer__header"
        :style="{
          flexDirection: !!slots['header-prefix'] ? 'column' : 'row-reverse'
        }"
      >
        <div class="p-drawer__header-prefix">
          <slot name="header-prefix"/>
          <PButton
            pType="generic"
            pPlain
            pIconOnly
            @click="$emit('close-drawer-button')"
            class="p-drawer__close-button"
          >
            <PIcon pName="x" />
          </PButton>
        </div>
        <div
          class="p-drawer__header-suffix"
          :class="{ 'p-drawer__header-suffix--column': pSuffixUnderTitle }"
        >
          <div class="flex flex--align-items-center flex--justify-content-flex-start">
            <PButton
              pType="generic"
              pPlain
              pIconOnly
              @click="$emit('drawer-previous-button-click')"
              v-if="pShowPreviousStep"
              class="p-drawer__step-back-button"
            >
              <PIcon pName="arrowLeft" />
            </PButton>
            <h3 class="p-drawer__title">
              {{ pTitle }}
            </h3>
          </div>

          <slot name="header-suffix"/>
        </div>
      </div>
      <PBreadcrumb
        v-if="pBreadcrumb && pBreadcrumb.length"
        :pElements="pBreadcrumb"
        pSize="S"
      />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { ElDrawer } from 'element-plus'
import PBreadcrumb from '@styleguide/molecules/PBreadcrumb'
import PButton from '@styleguide/atoms/PButton'
import PIcon from '@styleguide/atoms/PIcon'
import type { PDrawerProps } from './PDrawerTypes'

const emit = defineEmits([
  'drawer-previous-button-click',
  'update:modelValue',
  'close-drawer-button',
])

const slots = useSlots()

const props = withDefaults(defineProps<PDrawerProps>(), {
  pDirection: 'rtl',
  pShowPreviousStep: false,
  pSize: '33%',
  pShowClose: false,
  modalClass: '',
  pWithHeader: true,
  pSuffixUnderTitle: false,
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const pModalClass = computed(() => {
  if (props.pDirection === 'ttb') {
    return props.pType === 'mini'
      ? 'p-drawer--mini'
      : 'p-drawer--fullscreen'
  }
  return ''
})
</script>
