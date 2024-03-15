<template>
  <Story
    title="2. Atoms/TaskItem"
    icon="fluent:task-list-20-regular"
    :layout="{ type: 'grid', width: '150px' }"
  >
    <Variant title="TaskItem">
      <ul class="padding--1 task-list-doc">
        <li class="margin-bottom--1">
          <PTaskItem
            pStatus="todo"
            pTitle="Lorem Ipsum sit amet"
            pCompletedTasks="3"
            pTotalTasks="10"
          />
        </li>
        <li class="margin-bottom--1">
          <PTaskItem
            pStatus="done"
            pTitle="My task number 2"
            pCompletedTasks="20"
            pTotalTasks="20"
          />
        </li>
        <li>
          <PTaskItem
            pStatus="disabled"
            pTitle="My task number 2"
            pCompletedTasks="0"
            pTotalTasks="30"
          />
        </li>
      </ul>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PTaskItem from '.'
</script>

<style lang="scss" scoped>
.task-list-doc {
  list-style: none;
}
</style>

<docs lang="md">
  ## PTaskItem

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D9911%253A1882%26mode%3Ddev"></iframe>
  </div>
</docs>
