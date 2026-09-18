import { ref } from 'vue'
import { useMeasuresList } from './use-measures-list.composable'
import type { RawMeasure } from '../components/editor/widget-drawer/widget-drawer.types'

const INITIAL_MEASURES: RawMeasure[] = [
  { measure: 'N', label: 'Exercice' },
  { measure: 'N-1' },
  { role: 'variation' },
]

function setupMeasures() {
  const measures = ref<RawMeasure[]>([...INITIAL_MEASURES])
  const list = useMeasuresList(measures, (next) => {
    measures.value = next
  })

  return { measures, ...list }
}

describe('useMeasuresList', () => {
  it('should append a named measure', () => {
    const { measures, addMeasure } = setupMeasures()

    addMeasure('named')

    expect(measures.value).toEqual([...INITIAL_MEASURES, { measure: 'N' }])
  })

  it('should append a role', () => {
    const { measures, addMeasure } = setupMeasures()

    addMeasure('role')

    expect(measures.value).toEqual([...INITIAL_MEASURES, { role: 'variation' }])
  })

  it('should patch only the measure at the given index', () => {
    const { measures, updateMeasure } = setupMeasures()

    updateMeasure(1, { label: 'Précédent' })

    expect(measures.value).toEqual([
      INITIAL_MEASURES[0],
      { measure: 'N-1', label: 'Précédent' },
      INITIAL_MEASURES[2],
    ])
  })

  it('should drop a key patched to undefined rather than store it', () => {
    const { measures, updateMeasure } = setupMeasures()

    updateMeasure(0, { label: undefined })

    expect(measures.value[0]).toStrictEqual({ measure: 'N' })
  })

  it('should remove the measure at the given index', () => {
    const { measures, removeMeasure } = setupMeasures()

    removeMeasure(1)

    expect(measures.value).toEqual([INITIAL_MEASURES[0], INITIAL_MEASURES[2]])
  })

  it('should move a measure to another position', () => {
    const { measures, moveMeasure } = setupMeasures()

    moveMeasure(2, 0)

    expect(measures.value).toEqual([INITIAL_MEASURES[2], INITIAL_MEASURES[0], INITIAL_MEASURES[1]])
  })

  it('should read the measures at call time from a getter', () => {
    const source = ref<RawMeasure[]>([])
    const setMeasures = vi.fn<(next: RawMeasure[]) => void>()
    const { addMeasure } = useMeasuresList(() => source.value, setMeasures)

    source.value = [{ measure: 'N' }]
    addMeasure('role')

    expect(setMeasures).toHaveBeenCalledExactlyOnceWith([{ measure: 'N' }, { role: 'variation' }])
  })
})
