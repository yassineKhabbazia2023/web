<template>
  <header
    class="
      key-moments-section-head
      flex
      flex--align-items-flex-end
      flex-gap--5
    "
  >
    <span
      class="key-moments-section-head__rank"
      aria-hidden="true"
    >
      {{ rank }}
    </span>
    <div>
      <p
        v-if="subtitle !== undefined"
        class="key-moments-section-head__crumb"
      >
        {{ subtitle }}
      </p>
      <h2
        class="
          key-moments-section-head__title
          margin--0
          font-size--30
        "
      >
        {{ title }}
        <!-- Inside the title: what is withheld is the section, not the page -->
        <span
          v-if="badge !== undefined"
          class="key-moments-section-head__badge margin-left--3"
          :data-testid="badgeTestId"
        >
          {{ badge }}
        </span>
      </h2>
    </div>
    <span
      class="
        key-moments-section-head__obliques
        flex
        flex--align-self-center
        flex-gap--2
        margin-left--auto
      "
      aria-hidden="true"
    />
  </header>
</template>

<script setup lang="ts">
// The single heading of a report section, shared by every surface so it never drifts
defineProps<{
  /** Ordinal of the section in the report, already written as `01`, `02`… */
  rank: string
  title: string
  /** Overline announcing what the section is about; absent when unauthored */
  subtitle?: string
  /** States that the section is kept from the client; absent when it is not */
  badge?: string
  badgeTestId?: string
}>()
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-section-head {
  margin-bottom: 26px;

  // Oversized outlined ordinal, purely decorative
  &__rank {
    font-size: 76px;
    font-weight: 800;
    line-height: 0.8;
    letter-spacing: -0.02em;
    color: transparent;
    user-select: none;
    -webkit-text-stroke: 1.5px var(--key-moments-ghost-stroke);
  }

  &__crumb {
    @include screen.overline;

    margin-bottom: 5px;
  }

  &__title {
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--p-text-basic-heading);
  }

  &__badge {
    @include screen.badge;

    vertical-align: middle;
    border: 1px solid var(--key-moments-line);
  }

  // The two skewed bars of the RYDGE signature
  &__obliques {
    &::before,
    &::after {
      content: '';
      width: 9px;
      height: 34px;
      transform: screen.$oblique-skew;
    }

    &::before {
      background-color: var(--p-jungle-400);
    }

    &::after {
      background-color: var(--p-mint-tulip-500);
    }
  }

  // On a phone the title wins the line: the ordinal shrinks and the signature goes
  @include breakpoints.media(xs) {
    margin-bottom: 18px;
    gap: 12px;
    // Centred so a two-line title does not leave the ordinal at its foot
    align-items: center;

    &__rank {
      font-size: 44px;
    }

    &__title {
      font-size: 22px;
    }

    &__obliques {
      display: none;
    }

  }
}
</style>
