<template>
  <ElDrawer
    ref="drawerRef"
    v-model="drawerModel"
    :direction="pDirection"
    :showClose="pShowClose"
    class="p-drawer"
    :class="componentUniqueId"
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
          <slot name="header-prefix" />
          <PButton
            v-if="!pHeaderToolbox"
            pPlain
            pIconOnly
            class="p-drawer__close-button"
            @click="$emit('close-drawer-button')"
          >
            <PIcon pName="x" />
          </PButton>
          <PToolbox
            v-if="pHeaderToolbox"
            v-bind="pHeaderToolboxProps"
            @p-toolbox-item-clicked="handleToolboxItemClicked"
          >
            <div
              class="
              p-drawer__toolbox-gear
              flex
              flex--justify-content-center
              flex--align-items-center
              cursor-pointer
            "
            >
              <PIcon
                pName="gear"
                pSize="14"
              />
            </div>
          </PToolbox>
        </div>
        <div
          class="p-drawer__header-suffix"
          :class="{ 'p-drawer__header-suffix--column': pSuffixUnderTitle }"
        >
          <div class="flex flex--align-items-center flex--justify-content-flex-start">
            <PButton
              v-if="pShowPreviousStep"
              pPlain
              pIconOnly
              class="p-drawer__step-back-button"
              @click="$emit('drawer-previous-button-click')"
            >
              <PIcon pName="arrowLeft" />
            </PButton>
            <h3 v-if="pTitle && pTitle.length > 0" class="p-drawer__title white-space--wrap">
              <PIcon
                pName="pulse"
                :pColor="AppColors.PRIMARY"
                pSize="30"
              />
              <span class="margin-left--1 font-semibold">
                {{ pTitle }}
              </span>
            </h3>
          </div>

          <slot name="header-suffix" />
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
import { computed, ref, useSlots } from 'vue'
import { ElDrawer } from 'element-plus'
import PBreadcrumb from '../../molecules/PBreadcrumb'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PToolbox from '../PToolbox/PToolbox.vue'
import type { PDrawerProps, ElDrawerInstanceType } from './PDrawerTypes'
import { AppColors } from '../../utils/AppColorsEnum'
import { usePDrawer } from './p-drawer.composable'
import type { PToolboxProps } from '@styleguide/molecules/PToolbox/PToolboxTypes'


const emit = defineEmits([
  'drawer-previous-button-click',
  'update:modelValue',
  'close-drawer-button',
  'p-toolbox-item-clicked',
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


const drawerRef = ref<ElDrawerInstanceType | null>(null)

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

function handleToolboxItemClicked(itemName: string) {
  emit('p-toolbox-item-clicked', itemName)
}

const { componentUniqueId } = usePDrawer(drawerRef, drawerModel, props.pType)

const pHeaderToolboxProps = {
  ...props.pHeaderToolbox,
  pPopperClass: componentUniqueId,
} as PToolboxProps

const pModalClass = computed(() => {
  if (props.pDirection === 'ttb') {
    return props.pType === 'mini'
      ? 'p-drawer--mini'
      : 'p-drawer--fullscreen'
  }
  return ''
})
</script>

<style scoped lang="scss">
.p-drawer {
  &__toolbox-gear {
    width: 32px;
    height: 32px;

    &:hover {
      animation: gearRotate 200ms ease-in-out;
    }
  }
}

@keyframes gearRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(45deg);
  }
}
</style>
