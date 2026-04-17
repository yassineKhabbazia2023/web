<template>
  <div class="p-form-line flex flex--wrap flex-gap--4">
    <slot />
  </div>
</template>

<style lang="scss">
.p-form-line {
  .el-form-item, .el-form-inline .el-form-item  {
    margin-right: 0;
  }
}
</style>
