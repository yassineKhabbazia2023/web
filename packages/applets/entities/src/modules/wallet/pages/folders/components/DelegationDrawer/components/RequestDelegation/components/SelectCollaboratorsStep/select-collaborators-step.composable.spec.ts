import { flushPromises } from '@vue/test-utils'
import type { Ref } from 'vue'
import { useSelectCollaboratorsStep } from './select-collaborators-step.composable'
import { getCollaboratorsByIdEntity } from '@entities/services/collaborator'
import { AUTO_SELECT_COUNT, INITIAL_PAGE_SIZE, MAX_SELECTED_COLLABORATORS } from './select-collaborators-step.consts'
import { mockCollabsData, createMockCollab } from '@entities/__mocks__/collab-data.mocks'
import type { Collab } from '@entities/types'

vi.mock('@entities/services/collaborator')

const mockCollaborators = mockCollabsData

function mockApiResponse(items = mockCollaborators) {
  return {
    items,
    totalItems: items.length,
    currentPage: 1,
  }
}

function createManyCollabs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockCollaborators[0],
    contactId: i + 1,
    email: `user${i + 1}@example.com`,
  }))
}

function fillToMax(
  selectedCollaborators: Ref<Collab[]>,
  collabs: Collab[],
  handleToggle: (collab: Collab) => void,
) {
  while (selectedCollaborators.value.length < MAX_SELECTED_COLLABORATORS) {
    const next = collabs.find(c => selectedCollaborators.value.every(s => s.contactId !== c.contactId))
    if (next) {
      handleToggle(next)
    } else {
      break
    }
  }
}

describe('useSelectCollaboratorsStep', () => {
  const accountId = 123
  const mockOnSelectionChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadInitialCollaborators', () => {
    it('should load collaborators and auto-select 2 by default', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, selectedCollaborators, displayedCollaborators, isLoading } =
        useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      expect(isLoading.value).toBe(true)

      await loadInitialCollaborators()
      await flushPromises()

      expect(isLoading.value).toBe(false)
      expect(displayedCollaborators.value).toEqual(mockCollaborators)
      expect(selectedCollaborators.value).toHaveLength(AUTO_SELECT_COUNT)
      expect(selectedCollaborators.value).toEqual(mockCollaborators.slice(0, AUTO_SELECT_COUNT))
      expect(mockOnSelectionChange).toHaveBeenCalledWith(mockCollaborators.slice(0, AUTO_SELECT_COUNT))
      expect(getCollaboratorsByIdEntity).toHaveBeenCalledWith(
        accountId,
        new URLSearchParams({ pageSize: String(INITIAL_PAGE_SIZE) }),
      )
    })

    it('should not auto-select if initial selection provided', async () => {
      const initialSelected = [mockCollaborators[1]]

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, selectedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
        initialSelected,
      )

      await loadInitialCollaborators()
      await flushPromises()

      expect(selectedCollaborators.value).toEqual(initialSelected)
      expect(mockOnSelectionChange).toHaveBeenCalledWith(initialSelected)
    })

    it('should merge missing collaborators from initial selection', async () => {
      const missingCollab = {
        ...mockCollabsData[0],
        contactId: 99,
        globalContactId: 'global-99',
        email: 'missing@example.com',
      }

      const initialSelected = [missingCollab, mockCollaborators[0]]

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, displayedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
        initialSelected,
      )

      await loadInitialCollaborators()
      await flushPromises()

      expect(displayedCollaborators.value[0]).toEqual(missingCollab)
      expect(displayedCollaborators.value).toContainEqual(missingCollab)
    })

    it('should handle API error gracefully', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockRejectedValue(new Error('API Error'))

      const { loadInitialCollaborators, isLoading } = useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      expect(isLoading.value).toBe(false)
    })
  })

  describe('handleToggle', () => {
    it('should add collaborator to selection', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, handleToggle, selectedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      const initialLength = selectedCollaborators.value.length
      const collabToAdd = mockCollaborators[2]

      handleToggle(collabToAdd)

      expect(selectedCollaborators.value).toHaveLength(initialLength + 1)
      expect(selectedCollaborators.value).toContainEqual(collabToAdd)
      expect(mockOnSelectionChange).toHaveBeenCalledWith(selectedCollaborators.value)
    })

    it('should remove collaborator from selection', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, handleToggle, selectedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      const collabToRemove = selectedCollaborators.value[0]
      const initialLength = selectedCollaborators.value.length

      handleToggle(collabToRemove)

      expect(selectedCollaborators.value).toHaveLength(initialLength - 1)
      expect(selectedCollaborators.value).not.toContain(collabToRemove)
      expect(mockOnSelectionChange).toHaveBeenCalledWith(selectedCollaborators.value)
    })

    it('should not add collaborator if max limit reached', async () => {
      const manyCollabs = createManyCollabs(10)

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse(manyCollabs))

      const { loadInitialCollaborators, handleToggle, selectedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      fillToMax(selectedCollaborators, manyCollabs, handleToggle)

      const currentLength = selectedCollaborators.value.length
      const oneMore = manyCollabs.find(c => selectedCollaborators.value.every(s => s.contactId !== c.contactId))

      if (oneMore) {
        handleToggle(oneMore)
      }

      expect(selectedCollaborators.value).toHaveLength(currentLength)
    })
  })

  describe('isSelected', () => {
    it('should return true if collaborator is selected', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, isSelected, selectedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      const selectedId = selectedCollaborators.value[0].contactId
      expect(isSelected(selectedId)).toBe(true)
    })

    it('should return false if collaborator is not selected', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, isSelected } = useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      expect(isSelected(999)).toBe(false)
    })
  })

  describe('isCheckboxDisabled', () => {
    it('should return true if max selected and not currently selected', async () => {
      const manyCollabs = createManyCollabs(5)

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse(manyCollabs))

      const { loadInitialCollaborators, handleToggle, isCheckboxDisabled, selectedCollaborators } =
        useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      fillToMax(selectedCollaborators, manyCollabs, handleToggle)

      const unselectedCollab = manyCollabs.find(c =>
        selectedCollaborators.value.every(s => s.contactId !== c.contactId),
      )

      if (unselectedCollab) {
        expect(isCheckboxDisabled(unselectedCollab.contactId)).toBe(true)
      }
    })

    it('should return false if not max selected', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, isCheckboxDisabled } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      expect(isCheckboxDisabled(mockCollaborators[2].contactId)).toBe(false)
    })
  })

  describe('handleAddFromDropdown', () => {
    it('should add collaborator to displayed list and auto-select if under limit', async () => {
      const newCollab = createMockCollab()

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse(mockCollaborators.slice(0, 1)))

      const { loadInitialCollaborators, handleAddFromDropdown, displayedCollaborators, selectedCollaborators } =
        useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      // Remove one to be under limit
      selectedCollaborators.value = []

      handleAddFromDropdown(newCollab)

      expect(displayedCollaborators.value[0]).toEqual(newCollab)
      expect(selectedCollaborators.value).toContainEqual(newCollab)
    })

    it('should not add if already in displayed list', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, handleAddFromDropdown, displayedCollaborators } = useSelectCollaboratorsStep(
        accountId,
        mockOnSelectionChange,
      )

      await loadInitialCollaborators()
      await flushPromises()

      const initialLength = displayedCollaborators.value.length

      handleAddFromDropdown(mockCollaborators[0])

      expect(displayedCollaborators.value).toHaveLength(initialLength)
    })

    it('should not auto-select if at max limit', async () => {
      const manyCollabs = createManyCollabs(5)

      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse(manyCollabs.slice(0, 3)))

      const { loadInitialCollaborators, handleAddFromDropdown, handleToggle, selectedCollaborators } =
        useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      fillToMax(selectedCollaborators, manyCollabs, handleToggle)

      const newCollab = createMockCollab()

      handleAddFromDropdown(newCollab)

      expect(selectedCollaborators.value).not.toContain(newCollab)
    })
  })

  describe('sortedDisplayedCollaborators', () => {
    it('should sort collaborators with selected first', async () => {
      vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue(mockApiResponse())

      const { loadInitialCollaborators, sortedDisplayedCollaborators, selectedCollaborators } =
        useSelectCollaboratorsStep(accountId, mockOnSelectionChange)

      await loadInitialCollaborators()
      await flushPromises()

      const sortedList = sortedDisplayedCollaborators.value

      // First items should be selected
      for (let i = 0; i < selectedCollaborators.value.length; i++) {
        expect(selectedCollaborators.value.some(s => s.contactId === sortedList[i].contactId)).toBe(true)
      }

      // Remaining items should be unselected
      for (let i = selectedCollaborators.value.length; i < sortedList.length; i++) {
        expect(selectedCollaborators.value.some(s => s.contactId === sortedList[i].contactId)).toBe(false)
      }
    })
  })
})
