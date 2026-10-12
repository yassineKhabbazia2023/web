<template>
  <!--
    The hero of the key moments report, brought back to the width of a homepage
    cell. It carries no figure: the widget says that there is something to read,
    the report says what.
  -->
  <section
    class="
      widget-key-moments
      flex
      flex--justify-content-space-between
      flex-gap--6
    "
    data-testid="widget-key-moments"
  >
    <div
      class="
        widget-key-moments__text
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <span class="widget-key-moments__label">{{ t('widgets.keyMoments.label') }}</span>

      <h3 class="widget-key-moments__title">
        {{ t('widgets.keyMoments.title') }}
      </h3>

      <p class="widget-key-moments__description">
        {{ t('widgets.keyMoments.description') }}
      </p>
    </div>

    <PButton
      class="widget-key-moments__action flex--align-self-flex-end"
      pType="white"
      pSize="small"
      pTestId="widget-key-moments-consult-button"
      @click="goToKeyMoments"
    >
      {{ t('widgets.keyMoments.consult') }}
    </PButton>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { PButton } from '@pulse/styleguide/components'
import { AmplitudeEvent, AmplitudeFeatureName, RouteName, RouteParam } from '@pulse/common/enums'
import { widgetClick } from '@pulse/widgets/utils'
import { WidgetName } from '@pulse/widgets/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const router = useRouter()
const route = useRoute()

function goToKeyMoments() {
  widgetClick({
    event: AmplitudeEvent.WIDGET_INTERACTED,
    widgetName: WidgetName.KEY_MOMENTS,
    featureName: AmplitudeFeatureName.HOMEPAGE,
  })

  router.push({
    name: RouteName.KEY_MOMENTS,
    params: { [RouteParam.ENTITY_ID]: route.params[RouteParam.ENTITY_ID] },
  })
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.widget-key-moments {
  position: relative;
  overflow: hidden;

  // Alone on its row, but stopping halfway: the card announces, it does not
  // fill. The row it is given spans the whole grid, the card does not.
  width: 50%;
  height: 100%;
  padding: 22px 26px;
  background: linear-gradient(
    135deg,
    var(--p-black-rock-900) 0%,
    var(--p-tranquil-800) 55%,
    var(--p-jungle-400) 100%
  );

  // Keeps the content above the decorative bars below. The z-index is what does
  // the work: `::after` is the last child, so a merely positioned sibling would
  // still be painted under it.
  > * {
    position: relative;
    z-index: 1;
  }

  // The two skewed bars of the RYDGE signature. The angle is the one the
  // styleguide skews its buttons with, inlined because the report that owns the
  // variable lives in an applet this library cannot depend on.
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -30px;
    bottom: -30px;
    width: 16px;
    transform: skewX(-30deg);
  }

  // Anchored in proportion rather than in pixels, so they land in the band
  // between the text and the CTA whatever the card is wide — right-anchored in
  // pixels as the report does, they would end up entirely behind the button.
  // The 34px keeps the two bars the distance apart the report gives them.
  &::before {
    right: calc(28% + 34px);
    background-color: rgba(var(--p-jungle-400-rgb), 0.5);
  }

  &::after {
    right: 28%;
    background-color: rgba(var(--p-mint-tulip-500-rgb), 0.35);
  }

  &__label {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--p-mint-tulip-500);
  }

  &__title {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: var(--p-text-basic-white);
  }

  &__description {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--p-text-basic-white);
  }

  // Kept at its label width, at the foot of the card: the text beside it takes
  // what is left and stays at the top
  &__action {
    flex-shrink: 0;
  }

  // Half a single-column grid would leave a card too narrow to read
  @include breakpoints.media(xs) {
    width: 100%;
  }
}
</style>
