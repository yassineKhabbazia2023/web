<template>
  <div
    class="
      key-moments-report-toolbar
      flex
      flex--wrap
      flex--align-items-center
      flex--justify-content-space-between
      flex-gap--4
    "
    data-testid="key-moments-report-toolbar"
  >
    <!-- Pinned over the report so that the filters and the publication stay at hand while reading -->
    <div class="key-moments-report-toolbar__filters">
      <slot />
    </div>

    <!-- Pushed to the right even once wrapped under the filters -->
    <div
      class="
        flex
        flex--wrap
        flex--align-items-center
        flex--justify-content-flex-end
        flex-gap--2
        margin-left--auto
      "
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.key-moments-report-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  // Bleeds over the gutter of the report, so the bar spans the canvas it is pinned over
  margin: 0 calc(-1 * var(--key-moments-gutter));
  padding: 12px var(--key-moments-gutter);
  row-gap: 12px;
  background-color: var(--p-surface-primary);
  box-shadow: var(--key-moments-shadow);

  &__filters {
    flex: 1 1 auto;
    min-width: 0;
  }

  // Not pinned on a phone, where its wrapped rows would hold a third of the screen
  @include breakpoints.media(xs) {
    position: static;
  }
}
</style>
