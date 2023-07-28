<template>
  <div
    :type="type"
    :class="{ 'p-cell__entity': true, 'padding--4': true, selected }"
    :selected="selected"
  >
    <div class="p-cell__entity-avatar">
      <PAvatar
        :shape="iconShape"
        :size="iconSize"
        :color="iconColor">
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
    </div>
    <div :class="{ 'p-cell__entity-content': true, 'text-left': true }">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface PCellTextProps {
  content: string
  type: 'primary' | 'secondary'
  iconShape: string
  iconColor: string
  iconSize: string
  selected: boolean
}

withDefaults(defineProps<PCellTextProps>(), {
  type: 'primary',
  iconShape: 'circle',
  iconColor: 'persian-gradient',
  iconSize: 'xsmall',
  selected: false
})
</script>

<style lang="scss" scoped>
.p-cell__entity {
  display: flex;
  align-items: center;
  max-height: 40px;
  gap: 8px;
  color: var(--el-fill-color-regular);
}

.p-cell__entity[type="primary"]:not([selected="true"]) {
  background-color: var(--el-fill-color-blank);
}

.p-cell__entity[type="primary"]:hover {
  background-color: var(--el-color-persian-100);
}

.p-cell__entity[type="secondary"]:not([selected="true"]) {
  background-color: var(--el-fill-color-lighter);
}

.p-cell__entity[type="secondary"]:hover {
  background-color: var(--el-color-persian-100);
}

.p-cell__entity[selected="true"] {
  background-color: var(--el-color-persian-200);
}

.p-cell__entity-avatar {
  top: 2px;
}

.p-cell__entity-content {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 300px;
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0em;
}
</style>
