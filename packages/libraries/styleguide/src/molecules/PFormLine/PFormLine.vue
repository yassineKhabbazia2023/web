<template>
  <div class="p-form-line flex flex--wrap flex-gap--4">
    <slot />
  </div>
</template>

<style lang="scss">
.p-form-line {
  .el-form-item, .el-form-inline .el-form-item  {
    margin-right: 0;
    flex-grow: 1;

    &--fixed-width {
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
}
</style>
