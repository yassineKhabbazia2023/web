import { ref, computed } from 'vue'
import { logger, useDebounce } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type { Collab } from '@entities/types'
import { getCollaboratorsByIdEntity } from '@entities/services/collaborator'
import { AUTO_SELECT_COUNT, INITIAL_PAGE_SIZE, MAX_SELECTED_COLLABORATORS } from './select-collaborators-step.consts'

export function useSelectCollaboratorsStep(
  accountId: number,
  onSelectionChange: (collabs: Collab[]) => void,
  initialSelectedCollaborators?: Collab[],
) {
  const isLoading = ref(true)
  const isSearchLoading = ref(false)
  const selectedCollaborators = ref<Collab[]>(initialSelectedCollaborators ?? [])
  const displayedCollaborators = ref<Collab[]>([])
  const searchQuery = ref('')

  const isMaxSelected = computed(() => selectedCollaborators.value.length === MAX_SELECTED_COLLABORATORS)
  const hasNoCollaborators = computed(() => isLoading.value === false && displayedCollaborators.value.length === 0)

  const sortedDisplayedCollaborators = computed(() => {
    const checked = displayedCollaborators.value.filter(c => isSelected(c.contactId))
    const unchecked = displayedCollaborators.value.filter(c => !isSelected(c.contactId))
    return [...checked, ...unchecked]
  })

  function isSelected(contactId: number): boolean {
    return selectedCollaborators.value.some(c => c.contactId === contactId)
  }

  function isCheckboxDisabled(contactId: number): boolean {
    return isMaxSelected.value && !isSelected(contactId)
  }

  function handleToggle(collab: Collab) {
    const contactId = collab.contactId

    if (isSelected(contactId)) {
      selectedCollaborators.value = selectedCollaborators.value.filter(c => c.contactId !== contactId)
      onSelectionChange(selectedCollaborators.value)
      return
    }

    if (selectedCollaborators.value.length >= MAX_SELECTED_COLLABORATORS) {
      return
    }

    selectedCollaborators.value.push(collab)
    onSelectionChange(selectedCollaborators.value)
  }

  async function performSearch(query: string): Promise<Collab[]> {
    try {
      const params = new URLSearchParams({ Search: query })
      const response = await getCollaboratorsByIdEntity(accountId, params)

      return response.items.filter(c =>
        displayedCollaborators.value.every(d => d.contactId !== c.contactId),
      )
    } catch (error) {
      logger.error('Error fetching collaborators for dropdown', error)
      return []
    }
  }

  const debouncedSearch = useDebounce(performSearch)

  async function fetchCollaboratorSuggestions(query: string, callback: Function) {
    if (isNotNullNorEmpty(query) === false) {
      callback([])
      return
    }

    isSearchLoading.value = true
    try {
      const results = await debouncedSearch(query)
      callback(results)
    } finally {
      isSearchLoading.value = false
    }
  }

  function handleAddFromDropdown(collab: Collab) {
    // Skip if already in list
    if (displayedCollaborators.value.some(c => c.contactId === collab.contactId)) {
      return
    }

    // Add to displayed list at top
    displayedCollaborators.value.unshift(collab)

    // Auto-select if under limit
    if (selectedCollaborators.value.length < MAX_SELECTED_COLLABORATORS) {
      selectedCollaborators.value.push(collab)
      onSelectionChange(selectedCollaborators.value)
    }

    searchQuery.value = ''
  }

  async function loadInitialCollaborators() {
    isLoading.value = true

    try {
      const params = new URLSearchParams({ pageSize: String(INITIAL_PAGE_SIZE) })
      const response = await getCollaboratorsByIdEntity(accountId, params)

      displayedCollaborators.value = response.items

      // Auto-select only if no initial selection provided or empty
      if (initialSelectedCollaborators === undefined || initialSelectedCollaborators.length === 0) {
        const autoSelectCount = Math.min(AUTO_SELECT_COUNT, displayedCollaborators.value.length)
        selectedCollaborators.value = displayedCollaborators.value.slice(0, autoSelectCount)
      } else {
        // Add selected collabs not in displayed list (added via search)
        const missingCollabs = initialSelectedCollaborators.filter(
          selected => displayedCollaborators.value.every(displayed => displayed.contactId !== selected.contactId),
        )
        displayedCollaborators.value.unshift(...missingCollabs)
      }

      onSelectionChange(selectedCollaborators.value)
    } catch (error) {
      logger.error('Error loading initial collaborators', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isSearchLoading,
    hasNoCollaborators,
    selectedCollaborators,
    displayedCollaborators,
    sortedDisplayedCollaborators,
    searchQuery,
    isMaxSelected,
    isSelected,
    isCheckboxDisabled,
    handleToggle,
    fetchCollaboratorSuggestions,
    handleAddFromDropdown,
    loadInitialCollaborators,
  }
}
