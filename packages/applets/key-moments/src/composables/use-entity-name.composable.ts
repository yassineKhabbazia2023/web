import { computed } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { useCurrentEntityStore } from '@pulse/common/stores'

/**
 * Whose key moment is read: the dossier the route names, which is known before
 * anything loads and stays true whether a closing was imported or not.
 *
 * The name a closing carries is data of that closing, never what a surface
 * displays — two names for the same account would otherwise disagree on screen.
 * `undefined` while no dossier is settled, which every surface reads as "no
 * name to put in the title" rather than as an empty one.
 */
export function useEntityName() {
  const currentEntityStore = useCurrentEntityStore()

  const entityName = computed(() => {
    const legalName = currentEntityStore.currentEntity?.legalName

    return isNotNullNorEmpty(legalName) ? legalName : undefined
  })

  return { entityName }
}
