import { computed, effectScope, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { RouterHelpers } from '@pulse/common/helpers'
import { RouteParam } from '@pulse/common/enums'
import { Renderer } from '@key-moments/enums/key-moments.enums'
import { TemplateEditorManager } from '@key-moments/managers/template-editor.manager'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useSortableList } from '@key-moments/composables/use-sortable-list.composable'
import type { ComponentPublicInstance, MaybeRefOrGetter, Ref } from 'vue'
import type { PendingRemoval } from './template-editor.types'

/**
 * The gestures of the editor page: which version is on screen, what is being
 * asked for confirmation, and what the drawers are editing. Everything that
 * writes the document goes through the store — this holds only what the page
 * needs to ask before it does.
 */
export function useTemplateEditor(options: {
  /** The list of sections of the navigation, which reorders the screens */
  screensListElement?: MaybeRefOrGetter<HTMLElement | null | undefined>
} = {}) {
  const { t } = useI18n()
  const route = useRoute()
  const store = useTemplateEditorStore()

  const {
    report,
    unrenderedWidgets,
    unrenderedScreens,
    warnings,
    versions,
    currentVersion,
    rawTemplate,
    template,
    selection,
    isDirty,
    isLoading,
    isSaving,
    hasBlockingWarnings,
    isCurrentVersionVisible,
    isCurrentVersionLocked,
    serverError,
  } = storeToRefs(store)

  const templateId = computed(() => RouterHelpers.getRouteParamAsInt(route, RouteParam.TEMPLATE_ID))

  onMounted(() => {
    if (templateId.value !== null) {
      store.load(templateId.value)
    }
  })

  /**
   * Duplicating opens another template on the same route: the page is not
   * unmounted then, so the document is read again from the parameter rather
   * than from the mount. Everything the last one left behind goes with it.
   */
  watch(templateId, (id) => {
    if (id === null) {
      return
    }

    store.reset()
    store.load(id)
    // Resets so leaving the newly opened document asks for confirmation again
    isLeaveAccepted.value = false
  })

  // the editor holds a whole document: leaving it is leaving the document
  onBeforeUnmount(() => store.reset())

  const versionOptions = computed(() => versions.value.map(version => ({
    pValue: version.version,
    pLabel: version.isVisible
      ? t('keyMoments.settings.editor.versionVisible', { version: version.version })
      : version.version,
  })))

  /* --- saving --- */

  /**
   * The one save: the version on screen is rewritten in place. Refused as soon
   * as a publication pins it, and the editor then offers a new version instead.
   */
  async function save(): Promise<void> {
    await store.saveContent()
  }

  const isNewVersionDialogOpen = ref(false)
  const proposedVersion = ref('')

  /** Carrying the changes to a version of their own, published by nobody yet. */
  function askNewVersion(): void {
    proposedVersion.value = TemplateEditorManager
      .nextPatchVersion(versions.value.map(version => version.version))
    isNewVersionDialogOpen.value = true
  }

  async function confirmNewVersion(): Promise<void> {
    const saved = await store.saveVersion(proposedVersion.value)

    if (saved) {
      isNewVersionDialogOpen.value = false
    }
  }

  /* --- deleting a version --- */

  const pendingVersionDeletion = ref<string>()

  function askDeleteVersion(version: string): void {
    pendingVersionDeletion.value = version
  }

  async function confirmDeleteVersion(): Promise<void> {
    const version = pendingVersionDeletion.value

    if (version === undefined) {
      return
    }

    await store.deleteVersion(version)
    pendingVersionDeletion.value = undefined
  }

  function cancelDeleteVersion(): void {
    pendingVersionDeletion.value = undefined
  }

  /** A template always keeps a version: the last one is never offered for deletion. */
  const canDeleteCurrentVersion = computed(() => versions.value.length > 1
    && isCurrentVersionVisible.value === false)

  /* --- making the version visible --- */

  const isVisibleDialogOpen = ref(false)

  function askVisible(): void {
    // a document with unsaved changes would publish something else than what
    // is on screen: the guard is here as well as on the button
    if (isDirty.value) {
      return
    }

    isVisibleDialogOpen.value = true
  }

  async function confirmVisible(): Promise<void> {
    await store.setVisible()
    isVisibleDialogOpen.value = false
  }

  /* --- switching version --- */

  const pendingVersion = ref<string>()
  const isSwitchDialogOpen = ref(false)

  function switchVersion(version: string): void {
    if (templateId.value === null || version === currentVersion.value) {
      return
    }

    if (isDirty.value) {
      pendingVersion.value = version
      isSwitchDialogOpen.value = true

      return
    }

    store.load(templateId.value, version)
  }

  function confirmSwitch(): void {
    if (templateId.value !== null && pendingVersion.value !== undefined) {
      store.load(templateId.value, pendingVersion.value)
    }

    isSwitchDialogOpen.value = false
    pendingVersion.value = undefined
  }

  function cancelSwitch(): void {
    isSwitchDialogOpen.value = false
    pendingVersion.value = undefined
  }

  /* --- removing an element --- */

  const pendingRemoval = ref<PendingRemoval>()

  function confirmRemoveScreen(id: string): void {
    pendingRemoval.value = { kind: 'screen', id }
  }

  function confirmRemoveWidget(id: string): void {
    pendingRemoval.value = { kind: 'widget', id }
  }

  function applyRemoval(): void {
    const removal = pendingRemoval.value

    if (removal === undefined) {
      return
    }

    if (removal.kind === 'screen') {
      store.removeScreen(removal.id)
    } else {
      store.removeWidget(removal.id)
    }

    pendingRemoval.value = undefined
  }

  function cancelRemoval(): void {
    pendingRemoval.value = undefined
  }

  /* --- what the drawers edit --- */

  function openScreenDrawer(id: string): void {
    store.select({ kind: 'screen', id })
  }

  function openWidgetDrawer(id: string): void {
    store.select({ kind: 'widget', id })
  }

  function openTemplateDrawer(): void {
    store.select({ kind: 'template' })
  }

  /* --- adding --- */

  /** Opens the drawer on a screen that enters the document only once saved. */
  function addScreen(): string {
    return store.startScreen(t('keyMoments.settings.editor.newScreenTitle'))
  }

  /** A new widget starts on a table: the drawer is where it becomes anything else. */
  function addWidget(screenId: string, index: number): string {
    return store.startWidget(screenId, index, Renderer.TABLE, t('keyMoments.settings.editor.newWidgetTitle'))
  }

  /** What « duplicate » copies: the document on screen, unsaved changes included. */
  function duplicationSource() {
    return { label: template.value.label, content: rawTemplate.value ?? {} }
  }

  /* --- drag and drop --- */

  const HANDLE_SELECTOR = '.key-moments-editor-handle'
  /** One group for every grid: a widget crosses from one screen to another */
  const WIDGETS_GROUP = 'key-moments-widgets'

  /**
   * The sortables outlive a render but not the page. Held in a scope of their
   * own because a grid is registered from a template ref callback, which runs
   * outside the setup of the component.
   */
  const sortableScope = effectScope(true)
  const widgetsListElements = new Map<string, Ref<HTMLElement | undefined>>()

  sortableScope.run(() => useSortableList(() => toValue(options.screensListElement), {
    handle: HANDLE_SELECTOR,
    onMove: move => store.moveScreen(move.itemId, move.newIndex),
  }))

  /**
   * Binds the sub-section list of a screen in the navigation, once. Called on
   * every render: the element is written on the ref the sortable already
   * watches, rather than a second sortable being built on it.
   */
  function registerWidgetsList(screenId: string, element: Element | ComponentPublicInstance | null): void {
    const html = (element as HTMLElement | null) ?? undefined
    const known = widgetsListElements.get(screenId)

    if (known !== undefined) {
      known.value = html

      return
    }

    const elementRef = ref<HTMLElement | undefined>(html)
    widgetsListElements.set(screenId, elementRef)

    sortableScope.run(() => useSortableList(elementRef, {
      group: WIDGETS_GROUP,
      handle: HANDLE_SELECTOR,
      // a drop names the list it landed in, which is the screen it belongs to
      onMove: move => store.moveWidget(move.itemId, move.toListId ?? screenId, move.newIndex),
    }))
  }

  onBeforeUnmount(() => sortableScope.stop())

  /* --- leaving with unsaved changes --- */

  const isLeaveDialogOpen = ref(false)
  const answerPendingNavigation = ref<(isLeaveConfirmed: boolean) => void>()
  /**
   * The answer already given, which holds for the whole leaving. One navigation
   * passes here more than once — another guard redirecting is enough — and
   * asking again would be asking the same question twice.
   */
  const isLeaveAccepted = ref(false)

  function guardUnsavedChanges(): boolean | Promise<boolean> {
    if (isDirty.value === false || isLeaveAccepted.value) {
      return true
    }

    isLeaveDialogOpen.value = true

    // the navigation is held until the reader answers: it is resumed by
    // confirmLeave, and refused by cancelLeave
    return new Promise<boolean>(resolve => {
      answerPendingNavigation.value = resolve
    })
  }

  onBeforeRouteLeave(guardUnsavedChanges)
  // Duplicating stays on this route but still drops the document on screen, so guard it too
  onBeforeRouteUpdate(guardUnsavedChanges)

  function confirmLeave(): void {
    isLeaveAccepted.value = true
    isLeaveDialogOpen.value = false
    answerPendingNavigation.value?.(true)
    answerPendingNavigation.value = undefined
  }

  function cancelLeave(): void {
    isLeaveDialogOpen.value = false
    answerPendingNavigation.value?.(false)
    answerPendingNavigation.value = undefined
  }

  return {
    report,
    unrenderedWidgets,
    unrenderedScreens,
    warnings,
    versions,
    currentVersion,
    template,
    selection,
    isDirty,
    isLoading,
    isSaving,
    hasBlockingWarnings,
    isCurrentVersionVisible,
    isCurrentVersionLocked,
    serverError,
    versionOptions,
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
    registerWidgetsList,
    toggleWidgetHidden: store.toggleWidgetHidden,
  }
}
