<template>
  <el-menu
    :class="[{'hidden-lg-and-up': hideOnDesktop}, 'el-menu--bottom']"
    :router="useRouter"
    mode="horizontal"
  >
    <el-menu-item
      v-for="item in itemsMapped"
      :key="item.index"
      :index="item.index"
    >
      <div class="el-menu-item-content">
        <PIcon size="16px">
          <component :is="createIcon(item.icon)" />
        </PIcon>
        <p>{{ item.text }}</p>
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

interface Item {
  icon: string
  text: string
  path: string
}

interface Props {
  hideOnDesktop?: boolean
  useRouter?: boolean
  items: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  hideOnDesktop: true,
  useRouter: true
})

const itemsMapped = props.items.map(({ icon, text, path }) => ({
  icon,
  text,
  index: path
}))

const createIcon = (name: string) =>
  defineAsyncComponent(() => import(`../PIcon/components/${name}.vue`))
</script>

<style lang="scss" scoped>
.el-menu--bottom {
  &.el-menu--horizontal {
    border-bottom: inherit;
    box-shadow:
      0px -12px 15px 0px rgba(112, 144, 176, 0.04),
      0px -8px 8px 0px rgba(112, 144, 176, 0.05),
      0px -4px 4px 0px rgba(112, 144, 176, 0.08),
      0px -2px 2px 0px rgba(112, 144, 176, 0.05),
      0px -1px 2px 0px rgba(112, 144, 176, 0.1);
    overflow-x: hidden;

    & > .el-menu-item {
      border-bottom: inherit;
      line-height: 14px;

      &.is-active {
        border-top: 2px solid var(--el-menu-active-color);
        font-weight: 600;

        &:focus {
          background-color: inherit;
        }

        .el-menu-item-content {
          padding-top: 7px;
        }
      }

      [class^=el-icon] {
        margin-right: 0;
      }

      .el-menu-item-content {
        align-items: center;
        display: flex;
        flex-direction: column;
        padding: 9px 8px;
      }
    }
  }
}
</style>
