import { IndicatorsService } from '@key-moments/services/indicators.service'
import { IndicatorSign, ValueKind } from '@key-moments/enums/key-moments.enums'
import { useIndicatorDrawer } from './indicator-drawer.composable'

const CA = { id: 'ca', label: 'CA', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME }
const TOTAL = {
  id: 'total',
  label: 'Total',
  shortLabel: 'Tot.',
  kind: ValueKind.AMOUNT,
  sign: IndicatorSign.INCOME,
  components: [{ indicator: 'ca' }],
}

function setup() {
  const onSaved = vi.fn()

  return { ...useIndicatorDrawer({ onSaved }), onSaved }
}

beforeEach(() => {
  vi.spyOn(IndicatorsService, 'getUsages').mockResolvedValue([])
})

describe('useIndicatorDrawer', () => {

  it('should open empty in creation', () => {
    const { openCreate, mode, form, isOpen } = setup()

    openCreate()

    expect(isOpen.value).toBe(true)
    expect(mode.value).toBe('create')
    expect(form.code).toBe('')
    expect(form.label).toBe('')
  })

  it('should open on an existing indicator, its composition included', () => {
    const { openEdit, mode, form, componentCodes } = setup()

    openEdit(TOTAL)

    expect(mode.value).toBe('edit')
    expect(form).toMatchObject({ code: 'total', label: 'Total', shortLabel: 'Tot.' })
    expect(componentCodes.value).toEqual(['ca'])
    expect(vi.mocked(IndicatorsService.getUsages)).toHaveBeenCalledWith('total')
  })

  it('should create an indicator without touching the composition', async () => {
    vi.spyOn(IndicatorsService, 'createIndicator').mockResolvedValue()
    vi.spyOn(IndicatorsService, 'setComponents').mockResolvedValue()
    const { openCreate, form, save, onSaved } = setup()

    openCreate()
    form.code = 'Résultat net'
    form.label = 'Résultat net'
    await save()

    expect(vi.mocked(IndicatorsService.createIndicator)).toHaveBeenCalledWith({
      code: 'resultat-net',
      label: 'Résultat net',
      shortLabel: undefined,
      description: null,
      kind: ValueKind.AMOUNT,
      sign: IndicatorSign.INCOME,
    })
    expect(vi.mocked(IndicatorsService.setComponents)).not.toHaveBeenCalled()
    expect(onSaved).toHaveBeenCalledWith('resultat-net')
  })

  it('should update an indicator, its code staying out of the body', async () => {
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    const { openEdit, form, save } = setup()

    openEdit(CA)
    form.label = 'Chiffre d\'affaires'
    await save()

    expect(vi.mocked(IndicatorsService.updateIndicator)).toHaveBeenCalledWith('ca', {
      label: 'Chiffre d\'affaires',
      shortLabel: undefined,
      description: null,
      kind: ValueKind.AMOUNT,
      sign: IndicatorSign.INCOME,
    })
  })

  it('should open on the definition of an indicator', () => {
    const { openEdit, form } = setup()

    openEdit({ ...CA, description: 'Ventes de la période.' })

    expect(form.description).toBe('Ventes de la période.')
  })

  it('should send the definition trimmed', async () => {
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    const { openEdit, form, save } = setup()

    openEdit(CA)
    form.description = '  Ventes de la période.  '
    await save()

    expect(vi.mocked(IndicatorsService.updateIndicator))
      .toHaveBeenCalledWith('ca', expect.objectContaining({ description: 'Ventes de la période.' }))
  })

  it('should clear the definition with null once the field is emptied', async () => {
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    const { openEdit, form, save } = setup()

    openEdit({ ...CA, description: 'Ventes de la période.' })
    form.description = '   '
    await save()

    expect(vi.mocked(IndicatorsService.updateIndicator))
      .toHaveBeenCalledWith('ca', expect.objectContaining({ description: null }))
  })

  it('should write the composition only when it changed', async () => {
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    vi.spyOn(IndicatorsService, 'setComponents').mockResolvedValue()
    const { openEdit, addComponent, updateComponent, save } = setup()

    openEdit(TOTAL)
    await save()
    expect(vi.mocked(IndicatorsService.setComponents)).not.toHaveBeenCalled()

    addComponent()
    updateComponent(1, 'marge')
    await save()

    expect(vi.mocked(IndicatorsService.setComponents)).toHaveBeenCalledWith('total', ['ca', 'marge'])
  })

  it('should reorder and drop a component', () => {
    const { openEdit, addComponent, updateComponent, moveComponent, removeComponent, componentCodes } = setup()

    openEdit(TOTAL)
    addComponent()
    updateComponent(1, 'marge')
    moveComponent(0, 1)
    expect(componentCodes.value).toEqual(['marge', 'ca'])

    removeComponent(0)
    expect(componentCodes.value).toEqual(['ca'])
  })

  it('should put a code the slug empties on the field without asking the microservice', async () => {
    vi.spyOn(IndicatorsService, 'createIndicator').mockResolvedValue()
    const { openCreate, form, save, codeError, isOpen } = setup()

    openCreate()
    form.code = '!!!'
    form.label = 'CA'
    await save()

    expect(codeError.value).toBe('keyMoments.settings.indicatorDrawer.codeInvalid')
    expect(vi.mocked(IndicatorsService.createIndicator)).not.toHaveBeenCalled()
    expect(isOpen.value).toBe(true)
  })

  it('should put a refused code on the field and keep the drawer open', async () => {
    vi.spyOn(IndicatorsService, 'createIndicator')
      .mockRejectedValue({ response: { status: 409, data: { title: 'Code déjà utilisé' } } })
    const { openCreate, form, save, codeError, isOpen } = setup()

    openCreate()
    form.code = 'ca'
    form.label = 'CA'
    await save()

    expect(codeError.value).toBe('keyMoments.settings.indicatorDrawer.codeTaken')
    expect(isOpen.value).toBe(true)
  })

  it('should put a refused composition under the list, in its own words', async () => {
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    vi.spyOn(IndicatorsService, 'setComponents').mockRejectedValue({
      response: { status: 422, data: { errors: [{ pointer: '/components/0', detail: 'cycle' }] } },
    })
    const { openEdit, addComponent, updateComponent, save, componentsError, isOpen } = setup()

    openEdit(TOTAL)
    addComponent()
    updateComponent(1, 'total')
    await save()

    expect(componentsError.value).toBe('keyMoments.settings.indicatorDrawer.componentsError')
    expect(isOpen.value).toBe(true)
  })

  it('should edit the term it just created when its composition is refused', async () => {
    vi.spyOn(IndicatorsService, 'createIndicator').mockResolvedValue()
    vi.spyOn(IndicatorsService, 'updateIndicator').mockResolvedValue()
    vi.spyOn(IndicatorsService, 'setComponents')
      .mockRejectedValueOnce({
        response: { status: 422, data: { errors: [{ pointer: '/components/0', detail: 'unknown' }] } },
      })
      .mockResolvedValueOnce()
    const { openCreate, form, addComponent, updateComponent, save, mode, componentsError, onSaved } = setup()

    openCreate()
    form.code = 'Total'
    form.label = 'Total'
    addComponent()
    updateComponent(0, 'ca')
    await save()

    expect(mode.value).toBe('edit')
    expect(form.code).toBe('total')
    expect(componentsError.value).toBe('keyMoments.settings.indicatorDrawer.componentsError')
    expect(onSaved).not.toHaveBeenCalled()

    await save()

    expect(vi.mocked(IndicatorsService.createIndicator)).toHaveBeenCalledOnce()
    expect(vi.mocked(IndicatorsService.updateIndicator)).toHaveBeenCalledWith('total', expect.any(Object))
    expect(vi.mocked(IndicatorsService.setComponents)).toHaveBeenLastCalledWith('total', ['ca'])
    expect(onSaved).toHaveBeenCalledWith('total')
  })

  it('should send nothing without a code and a label', async () => {
    vi.spyOn(IndicatorsService, 'createIndicator').mockResolvedValue()
    const { openCreate, save } = setup()

    openCreate()
    await save()

    expect(vi.mocked(IndicatorsService.createIndicator)).not.toHaveBeenCalled()
  })
})
