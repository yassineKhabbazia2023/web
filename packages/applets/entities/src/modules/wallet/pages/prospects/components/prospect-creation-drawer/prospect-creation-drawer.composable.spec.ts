import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useProspectCreationDrawer } from './prospect-creation-drawer.composable'
import {
  getCollaboratorTargetRolesMock,
  getDropdownsContentMock,
  getEmptyDropdownsContentMock,
} from './__mocks__'

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('@pulse/toolbox', () => ({
  logger: { error: vi.fn() },
}))

const steps = [
  ProspectCreationDrawerStep.INFORMATION,
  ProspectCreationDrawerStep.COMPANY,
  ProspectCreationDrawerStep.CONTACT,
]

describe('useProspectCreationDrawer', () => {
  beforeEach(() => {
    vi.mocked(ProspectsService.fetchProspectCreationDropdownContent).mockResolvedValue(getDropdownsContentMock())
    vi.mocked(ProspectsService.fetchCollaboratorTargetRoles).mockResolvedValue(getCollaboratorTargetRolesMock())
  })

  it('should initialize with first step', () => {
    const [{ stepIndex, currentStep, isFirstStep, isLastStep }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(stepIndex.value).toBe(0)
    expect(currentStep.value).toBe(ProspectCreationDrawerStep.INFORMATION)
    expect(isFirstStep.value).toBe(true)
    expect(isLastStep.value).toBe(false)
  })

  it('should initialize formData with empty values', () => {
    const [{ formData }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(formData.value.legalName).toBe('')
    expect(formData.value.siret).toBe('')
    expect(formData.value.legalForm).toBe('')
    expect(formData.value.legalStructure).toBe('')
    expect(formData.value.interlocutors).toEqual([])
    expect(formData.value.interlocutorRoles).toEqual({})
    expect(formData.value.signatory.lastName).toBe('')
    expect(formData.value.signatory.firstName).toBe('')
  })

  it('should pre-select the mandatory signatory contact type by default', () => {
    const [{ formData }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(formData.value.signatory.contactTypes).toEqual(['isMandateSignatory'])
  })

  it('should go to next step', () => {
    const [{ stepIndex, currentStep, goNextStep }] = withSetup(() => useProspectCreationDrawer(steps))

    goNextStep()

    expect(stepIndex.value).toBe(1)
    expect(currentStep.value).toBe(ProspectCreationDrawerStep.COMPANY)
  })

  it('should not go past last step', () => {
    const [{ stepIndex, goNextStep }] = withSetup(() => useProspectCreationDrawer(steps))

    goNextStep()
    goNextStep()
    goNextStep()

    expect(stepIndex.value).toBe(2)
  })

  it('should go to previous step', () => {
    const [{ stepIndex, goNextStep, goPreviousStep }] = withSetup(() => useProspectCreationDrawer(steps))

    goNextStep()
    goPreviousStep()

    expect(stepIndex.value).toBe(0)
  })

  it('should not go before first step', () => {
    const [{ stepIndex, goPreviousStep }] = withSetup(() => useProspectCreationDrawer(steps))

    goPreviousStep()

    expect(stepIndex.value).toBe(0)
  })

  it('should report isLastStep on last step', () => {
    const [{ isLastStep, goNextStep }] = withSetup(() => useProspectCreationDrawer(steps))

    goNextStep()
    goNextStep()

    expect(isLastStep.value).toBe(true)
  })

  it('should fetch dropdown content on mount and expose it', async () => {
    const [{ dropdownsContent }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(dropdownsContent.value).toEqual(getEmptyDropdownsContentMock())
    expect(vi.mocked(ProspectsService.fetchProspectCreationDropdownContent)).toHaveBeenCalled()

    await flushPromises()

    expect(dropdownsContent.value).toEqual(getDropdownsContentMock())
  })

  it('should keep dropdown content empty and log error when fetch fails', async () => {
    const fetchError = new Error('Network error')
    vi.mocked(ProspectsService.fetchProspectCreationDropdownContent).mockRejectedValueOnce(fetchError)

    const { logger } = await import('@pulse/toolbox')

    const [{ dropdownsContent }] = withSetup(() => useProspectCreationDrawer(steps))

    await flushPromises()

    expect(dropdownsContent.value).toEqual(getEmptyDropdownsContentMock())
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'Failed to fetch prospect creation dropdown content',
      fetchError,
    )
  })

  it('should fetch collaborator target roles on mount and expose them', async () => {
    const [{ collaboratorTargetRoles }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(collaboratorTargetRoles.value).toEqual([])
    expect(vi.mocked(ProspectsService.fetchCollaboratorTargetRoles)).toHaveBeenCalled()

    await flushPromises()

    expect(collaboratorTargetRoles.value).toEqual(getCollaboratorTargetRolesMock())
  })

  it('should start as not dirty', () => {
    const [{ isDirty }] = withSetup(() => useProspectCreationDrawer(steps))

    expect(isDirty.value).toBe(false)
  })

  it('should become dirty when a top-level form field is mutated', async () => {
    const [{ isDirty, formData }] = withSetup(() => useProspectCreationDrawer(steps))

    formData.value.legalName = 'Acme'
    await nextTick()

    expect(isDirty.value).toBe(true)
  })

  it('should become dirty when a nested form field is mutated', async () => {
    const [{ isDirty, formData }] = withSetup(() => useProspectCreationDrawer(steps))

    formData.value.signatory.email = 'john@acme.com'
    await nextTick()

    expect(isDirty.value).toBe(true)
  })

  it('should become dirty when an array field is mutated', async () => {
    const [{ isDirty, formData }] = withSetup(() => useProspectCreationDrawer(steps))

    formData.value.signatory.contactTypes.push('PRIMARY')
    await nextTick()

    expect(isDirty.value).toBe(true)
  })

  it('should not become dirty when only dropdown content arrives from the server', async () => {
    const [{ isDirty }] = withSetup(() => useProspectCreationDrawer(steps))

    await flushPromises()

    expect(isDirty.value).toBe(false)
  })

  it('should keep collaborator target roles empty and log error when fetch fails', async () => {
    const fetchError = new Error('Network error')
    vi.mocked(ProspectsService.fetchCollaboratorTargetRoles).mockRejectedValueOnce(fetchError)

    const { logger } = await import('@pulse/toolbox')

    const [{ collaboratorTargetRoles }] = withSetup(() => useProspectCreationDrawer(steps))

    await flushPromises()

    expect(collaboratorTargetRoles.value).toEqual([])
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      'Failed to fetch collaborator target roles',
      fetchError,
    )
  })
})
