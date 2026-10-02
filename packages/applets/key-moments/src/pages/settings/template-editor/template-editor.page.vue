<template>
  <div
    class="
      key-moments
      key-moments-editor
      flex
      flex--direction-column
    "
    data-testid="key-moments-settings-template-editor-page"
  >
    <section class="key-moments__content padding--6">
      <div
        class="
          flex
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <PTitle>{{ template.label === '' ? t('keyMoments.settings.templateEditor.title') : template.label }}</PTitle>

        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
          "
        >
          <PDropdown
            v-if="versionOptions.length > 0"
            class="key-moments-editor__version-select"
            :modelValue="currentVersion"
            :pOptions="versionOptions"
            :pAriaLabel="t('keyMoments.settings.editor.versionSelect')"
            :pDisabled="isLoading"
            pSize="small"
            pTestId="key-moments-settings-editor-version-select"
            @update:model-value="version => switchVersion(version as string)"
          />

          <!-- Beside the selector rather than in it: a deletion is not decided from a list -->
          <PButton
            v-if="canDeleteCurrentVersion"
            pSize="small"
            pIconOnly
            pType="tertiary"
            :aria-label="t('keyMoments.settings.editor.deleteVersion.title')"
            pTestId="key-moments-settings-editor-delete-version-button"
            @click="askDeleteVersion(currentVersion as string)"
          >
            <PIcon pName="trash" />
          </PButton>

          <PButton
            pSize="small"
            pType="tertiary"
            pTestId="key-moments-settings-editor-properties-button"
            @click="openTemplateDrawer"
          >
            {{ t('keyMoments.settings.editor.properties') }}
          </PButton>

          <PButton
            pSize="small"
            pType="secondary"
            pTestId="key-moments-settings-editor-duplicate-button"
            @click="createDrawer?.openDuplicate(duplicationSource())"
          >
            {{ t('keyMoments.settings.editor.duplicate') }}
          </PButton>

          <!-- Disabled once refused: a published version never changes, the next button makes a new one -->
          <PButton
            pSize="small"
            pType="secondary"
            :pDisabled="isDirty === false || hasBlockingWarnings || isCurrentVersionLocked"
            :pLoading="isSaving"
            pTestId="key-moments-settings-editor-save-button"
            @click="save"
          >
            {{ t('keyMoments.settings.editor.save') }}
          </PButton>

          <PButton
            pSize="small"
            pType="secondary"
            :pDisabled="hasBlockingWarnings"
            pTestId="key-moments-settings-editor-new-version-button"
            @click="askNewVersion"
          >
            {{ t('keyMoments.settings.editor.newVersion') }}
          </PButton>

          <PButton
            pSize="small"
            :pDisabled="isDirty || isCurrentVersionVisible"
            pTestId="key-moments-settings-editor-visible-button"
            @click="askVisible"
          >
            {{ isCurrentVersionVisible
              ? t('keyMoments.settings.editor.visible')
              : t('keyMoments.settings.editor.makeVisible') }}
          </PButton>
        </div>
      </div>

      <ServerErrorBanner
        v-if="serverError !== undefined"
        class="margin-top--4"
        :error="serverError"
        :isVersionLocked="isCurrentVersionLocked"
        @new-version="askNewVersion"
      />

      <WarningsBanner
        v-if="warnings.length > 0"
        class="margin-top--4"
        :warnings="warnings"
      />

      <div
        class="
          key-moments__body
          flex
          flex-gap--6
          margin-top--4
        "
      >
        <Nav
          v-if="report !== undefined"
          ref="nav"
          :screens="report.screens"
          :hasRecommendations="false"
          alwaysExpanded
          @register-widgets-list="registerWidgetsList"
        >
          <template #screen-tools="{ screen }">
            <EditorToolbar
              :isHidden="screen.isHidden"
              :canHide="false"
              :testIdPrefix="`key-moments-settings-screen-${screen.id}`"
              @edit="openScreenDrawer(screen.id)"
              @remove="confirmRemoveScreen(screen.id)"
            />
          </template>

          <!-- Sub-sections are reordered here too, across sections -->
          <template #widget-tools="{ widget }">
            <span
              class="key-moments-editor-handle"
              :title="t('keyMoments.settings.editor.toolbar.move')"
              :data-testid="`key-moments-settings-nav-widget-${widget.id}-handle`"
            >
              <PIcon pName="gripVertical" />
            </span>
          </template>

          <template #after-screens>
            <PButton
              class="margin-top--4"
              pSize="small"
              pType="tertiary"
              pTestId="key-moments-settings-add-screen-button"
              @click="addScreen"
            >
              {{ t('keyMoments.settings.editor.addScreen') }}
            </PButton>
          </template>
        </Nav>

        <div class="key-moments__report">
          <div
            v-if="isLoading"
            class="
              flex
              flex--justify-content-center
              margin-top--8
            "
            data-testid="key-moments-settings-editor-loader"
          >
            <PLoader
              pType="primary"
              pSize="50"
            />
          </div>

          <div
            v-else-if="report !== undefined"
            class="key-moments__screens"
          >
            <section
              v-for="(screen, index) in report.screens"
              :id="screenAnchorId(screen.id)"
              :key="screen.id"
              class="key-moments__screen"
              :class="{ 'key-moments__screen--hidden': screen.isHidden }"
              :data-testid="`key-moments-${screen.id}-screen`"
            >
              <SectionHead
                :rank="formatScreenRank(index)"
                :title="screen.title"
                :subtitle="screen.subtitle"
                :badge="screen.isHidden ? t('keyMoments.visibility.hiddenBadge') : undefined"
                :badgeTestId="`key-moments-${screen.id}-hidden-badge`"
              />

              <div class="key-moments__grid">
                <Widget
                  v-for="widget in screen.widgets"
                  :id="widgetAnchorId(widget.id)"
                  :key="widget.id"
                  :widget="widget"
                  :style="{ gridColumn: `span ${widget.span}` }"
                  isReadOnly
                  hasHiddenBadge
                >
                  <template #toolbar>
                    <EditorToolbar
                      :isHidden="widget.isHidden"
                      :canMove="false"
                      :testIdPrefix="`key-moments-settings-widget-${widget.id}`"
                      @edit="openWidgetDrawer(widget.id)"
                      @toggle-hidden="toggleWidgetHidden(widget.id)"
                      @remove="confirmRemoveWidget(widget.id)"
                    />
                  </template>
                </Widget>

                <!-- What the build could not draw stays on the canvas, tools and all -->
                <WidgetPlaceholder
                  v-for="widget in unrenderedWidgets[screen.id] ?? []"
                  :key="widget.id"
                  :widgetId="widget.id"
                  :title="widget.title"
                  :style="{ gridColumn: `span ${widget.span ?? DEFAULT_WIDGET_SPAN}` }"
                >
                  <template #toolbar>
                    <EditorToolbar
                      :isHidden="false"
                      :canMove="false"
                      :canHide="false"
                      :testIdPrefix="`key-moments-settings-widget-${widget.id}`"
                      @edit="openWidgetDrawer(widget.id)"
                      @remove="confirmRemoveWidget(widget.id)"
                    />
                  </template>
                </WidgetPlaceholder>
              </div>

              <PButton
                class="margin-top--2"
                pSize="small"
                pType="tertiary"
                :pTestId="`key-moments-settings-${screen.id}-add-widget-button`"
                @click="addWidget(screen.id, screen.widgets.length)"
              >
                {{ t('keyMoments.settings.editor.addWidget') }}
              </PButton>
            </section>

            <!-- An unreadable section stays on the canvas so it can be fixed or removed; it blocks the save -->
            <section
              v-for="(screen, index) in unrenderedScreens"
              :id="screenAnchorId(screen.id)"
              :key="screen.id"
              class="key-moments__screen"
              :data-testid="`key-moments-${screen.id}-screen`"
            >
              <div
                class="
                  flex
                  flex--align-items-flex-start
                  flex--justify-content-space-between
                  flex-gap--2
                "
              >
                <SectionHead
                  :rank="formatScreenRank(report.screens.length + index)"
                  :title="screen.title"
                  :subtitle="t('keyMoments.settings.editor.screenUnrendered')"
                />
                <EditorToolbar
                  :isHidden="false"
                  :canMove="false"
                  :canHide="false"
                  :testIdPrefix="`key-moments-settings-screen-${screen.id}`"
                  @edit="openScreenDrawer(screen.id)"
                  @remove="confirmRemoveScreen(screen.id)"
                />
              </div>

              <div class="key-moments__grid">
                <WidgetPlaceholder
                  v-for="widget in unrenderedWidgets[screen.id] ?? []"
                  :key="widget.id"
                  :widgetId="widget.id"
                  :title="widget.title"
                  :style="{ gridColumn: `span ${widget.span ?? DEFAULT_WIDGET_SPAN}` }"
                >
                  <template #toolbar>
                    <EditorToolbar
                      :isHidden="false"
                      :canMove="false"
                      :canHide="false"
                      :testIdPrefix="`key-moments-settings-widget-${widget.id}`"
                      @edit="openWidgetDrawer(widget.id)"
                      @remove="confirmRemoveWidget(widget.id)"
                    />
                  </template>
                </WidgetPlaceholder>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <PConfirmationPopup
      v-model:pIsVisible="isNewVersionDialogOpen"
      pAppendToBody
      :pTitle="t('keyMoments.settings.editor.newVersionDialog.title')"
      :pConfirmButtonContent="t('keyMoments.settings.editor.newVersionDialog.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.saveDialog.cancel')"
      :pConfirmButtonIsLoading="isSaving"
      pTestId="key-moments-settings-editor-new-version-popup"
      @on-confirm-button-click="confirmNewVersion"
      @on-cancel-button-click="isNewVersionDialogOpen = false"
    >
      <p class="margin-bottom--3">
        {{ t('keyMoments.settings.editor.newVersionDialog.text') }}
      </p>
      <PForm>
        <PFormItem :pLabel="t('keyMoments.settings.editor.saveDialog.versionLabel')">
          <PInput
            v-model="proposedVersion"
            pTestId="key-moments-settings-editor-version-input"
          />
        </PFormItem>
      </PForm>
    </PConfirmationPopup>

    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="pendingVersionDeletion !== undefined"
      :pTitle="t('keyMoments.settings.editor.deleteVersion.title')"
      :pConfirmButtonContent="t('keyMoments.settings.editor.remove.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.saveDialog.cancel')"
      :pConfirmButtonIsLoading="isSaving"
      pTestId="key-moments-settings-editor-delete-version-popup"
      @on-confirm-button-click="confirmDeleteVersion"
      @on-cancel-button-click="cancelDeleteVersion"
    >
      <p>{{ t('keyMoments.settings.editor.deleteVersion.text', { version: pendingVersionDeletion }) }}</p>
    </PConfirmationPopup>

    <PConfirmationPopup
      v-model:pIsVisible="isVisibleDialogOpen"
      pAppendToBody
      :pTitle="t('keyMoments.settings.editor.visibleDialog.title')"
      :pConfirmButtonContent="t('keyMoments.settings.editor.visibleDialog.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.saveDialog.cancel')"
      :pConfirmButtonIsLoading="isSaving"
      pTestId="key-moments-settings-editor-visible-popup"
      @on-confirm-button-click="confirmVisible"
      @on-cancel-button-click="isVisibleDialogOpen = false"
    >
      <p>{{ t('keyMoments.settings.editor.visibleDialog.text', { version: currentVersion }) }}</p>
    </PConfirmationPopup>

    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="pendingRemoval !== undefined"
      :pTitle="removalTitle"
      :pConfirmButtonContent="t('keyMoments.settings.editor.remove.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.saveDialog.cancel')"
      pTestId="key-moments-settings-editor-remove-popup"
      @on-confirm-button-click="applyRemoval"
      @on-cancel-button-click="cancelRemoval"
    >
      <p>{{ t('keyMoments.settings.editor.remove.text') }}</p>
    </PConfirmationPopup>

    <PConfirmationPopup
      v-model:pIsVisible="isSwitchDialogOpen"
      pAppendToBody
      :pTitle="t('keyMoments.settings.editor.leave.title')"
      :pConfirmButtonContent="t('keyMoments.settings.editor.leave.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.leave.cancel')"
      pTestId="key-moments-settings-editor-switch-popup"
      @on-confirm-button-click="confirmSwitch"
      @on-cancel-button-click="cancelSwitch"
    >
      <p>{{ t('keyMoments.settings.editor.leave.text') }}</p>
    </PConfirmationPopup>

    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="isLeaveDialogOpen"
      :pTitle="t('keyMoments.settings.editor.leave.title')"
      :pConfirmButtonContent="t('keyMoments.settings.editor.leave.confirm')"
      :pCancelButtonContent="t('keyMoments.settings.editor.leave.cancel')"
      pTestId="key-moments-settings-editor-leave-popup"
      @on-confirm-button-click="confirmLeave"
      @on-cancel-button-click="cancelLeave"
    >
      <p>{{ t('keyMoments.settings.editor.leave.text') }}</p>
    </PConfirmationPopup>

    <WidgetDrawer />
    <ScreenDrawer />
    <TemplatePropertiesDrawer />

    <!-- One creation drawer for the whole editor: the callback held below returns the code to its line -->
    <IndicatorDrawer
      ref="indicatorDrawer"
      :vocabulary="vocabulary"
      @saved="onIndicatorCreated"
    />

    <TemplateCreateDrawer
      ref="createDrawer"
      @created="openCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { RouteName } from '@pulse/common/enums'
import {
  PButton,
  PConfirmationPopup,
  PDropdown,
  PForm,
  PFormItem,
  PIcon,
  PInput,
  PLoader,
  PTitle,
} from '@pulse/styleguide/components'
import EditorToolbar from '@key-moments/components/editor/editor-toolbar.vue'
import ServerErrorBanner from '@key-moments/components/editor/server-error-banner.vue'
import WarningsBanner from '@key-moments/components/editor/warnings-banner.vue'
import TemplateCreateDrawer from '@key-moments/components/editor/template-create-drawer/template-create-drawer.vue'
import IndicatorDrawer from '@key-moments/components/indicators/indicator-drawer/indicator-drawer.vue'
import ScreenDrawer from '@key-moments/components/editor/screen-drawer/screen-drawer.vue'
import TemplatePropertiesDrawer from '@key-moments/components/editor/template-properties-drawer.vue'
import WidgetDrawer from '@key-moments/components/editor/widget-drawer/widget-drawer.vue'
import WidgetPlaceholder from '@key-moments/components/editor/widget-placeholder.vue'
import Nav from '@key-moments/components/nav/nav.vue'
import SectionHead from '@key-moments/components/section-head/section-head.vue'
import Widget from '@key-moments/components/widget/widget.vue'
import { DEFAULT_WIDGET_SPAN } from '@key-moments/const/key-moments.consts'
import { screenAnchorId, widgetAnchorId } from '@key-moments/utils/anchor.utils'
import { formatScreenRank } from '@key-moments/utils/rank.utils'
import { INDICATOR_CREATION_KEY } from '@key-moments/components/indicators/indicator-creation.consts'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useTemplateEditor } from './template-editor.composable'
import type { TemplateCatalogueItem } from '@key-moments/services/template-editor.service.types'

const { t } = useI18n()
const router = useRouter()

// declared before the editor is built: the navigation is the list that
// reorders the screens, and the sortable watches it as it appears
const nav = useTemplateRef<InstanceType<typeof Nav>>('nav')

const {
  report,
  unrenderedWidgets,
  unrenderedScreens,
  warnings,
  currentVersion,
  template,
  isDirty,
  isLoading,
  isSaving,
  hasBlockingWarnings,
  isCurrentVersionVisible,
  versionOptions,
  isCurrentVersionLocked,
  serverError,
  save,
  isNewVersionDialogOpen,
  proposedVersion,
  askNewVersion,
  confirmNewVersion,
  pendingVersionDeletion,
  canDeleteCurrentVersion,
  askDeleteVersion,
  confirmDeleteVersion,
  cancelDeleteVersion,
  isVisibleDialogOpen,
  askVisible,
  confirmVisible,
  isSwitchDialogOpen,
  switchVersion,
  confirmSwitch,
  cancelSwitch,
  pendingRemoval,
  confirmRemoveScreen,
  confirmRemoveWidget,
  applyRemoval,
  cancelRemoval,
  openScreenDrawer,
  openWidgetDrawer,
  openTemplateDrawer,
  addScreen,
  addWidget,
  duplicationSource,
  isLeaveDialogOpen,
  confirmLeave,
  cancelLeave,
  toggleWidgetHidden,
  registerWidgetsList,
} = useTemplateEditor({ screensListElement: () => nav.value?.screensListElement })

const createDrawer = useTemplateRef<InstanceType<typeof TemplateCreateDrawer>>('createDrawer')
const indicatorDrawer = useTemplateRef<InstanceType<typeof IndicatorDrawer>>('indicatorDrawer')

const store = useTemplateEditorStore()
const { vocabulary } = storeToRefs(store)

/** What the selector that asked for a term does with the one just created. */
let onIndicatorSelected: ((code: string) => void) | undefined

provide(INDICATOR_CREATION_KEY, (onCreated) => {
  onIndicatorSelected = onCreated
  indicatorDrawer.value?.openCreate()
})

// The vocabulary is reloaded so the new term resolves before it is cited
async function onIndicatorCreated(code: string): Promise<void> {
  await store.loadVocabulary()
  onIndicatorSelected?.(code)
  onIndicatorSelected = undefined
}

const removalTitle = computed(() => (pendingRemoval.value?.kind === 'screen'
  ? t('keyMoments.settings.editor.remove.screenTitle')
  : t('keyMoments.settings.editor.remove.widgetTitle')))

/** A duplicate is a template of its own: it is opened on its own editor. */
function openCreated(item: TemplateCatalogueItem): void {
  router.push({ name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR, params: { templateId: item.templateId } })
}
</script>

<style lang="scss">
@use '../../../styles/editor';

// Sortable moves the nodes itself, and a fallback drag re-parents them to the
// body: the placeholder styles cannot be scoped to this component.
@include editor.ghost;
</style>

<style scoped lang="scss">
@use '../../../styles/editor';
@use '../../../styles/report';
@use '../../../styles/screen';

.key-moments-editor-handle {
  @include editor.handle;
}

.key-moments-editor {
  // Wider than on the dossier surface: each navigation entry carries its editing tools
  --key-moments-nav-width: 360px;

  &__version-select {
    width: 190px;
  }

  .key-moments__screen--hidden {
    opacity: 0.45;
  }

  .key-moments__screen:first-child {
    padding-top: 0;
  }
}
</style>
