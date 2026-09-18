import { toValue } from 'vue'
import { movedInList, patchRecord } from '../utils/patch.utils'
import type { MaybeRefOrGetter } from 'vue'
import type { RawMeasure } from '../components/editor/widget-drawer/widget-drawer.types'

export function useMeasuresList(
  measures: MaybeRefOrGetter<RawMeasure[]>,
  setMeasures: (next: RawMeasure[]) => void,
) {
  function addMeasure(kind: 'named' | 'role'): void {
    setMeasures([...toValue(measures), kind === 'named' ? { measure: 'N' } : { role: 'variation' }])
  }

  function updateMeasure(index: number, patch: Record<string, unknown>): void {
    setMeasures(toValue(measures).map((measure, position) => (
      position === index ? patchRecord({ ...measure }, patch) : measure
    )))
  }

  function removeMeasure(index: number): void {
    setMeasures(toValue(measures).filter((_measure, position) => position !== index))
  }

  function moveMeasure(from: number, to: number): void {
    setMeasures(movedInList(toValue(measures), from, to))
  }

  return { addMeasure, updateMeasure, removeMeasure, moveMeasure }
}
