import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useEntityName } from './use-entity-name.composable'
import type { EntitySummary } from '@pulse/common/types'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('useEntityName', () => {
  it('should name the dossier the route settled', () => {
    currentEntityStoreMock.currentEntity = { legalName: 'SAS TEST' } as EntitySummary

    const { entityName } = useEntityName()

    expect(entityName.value).toBe('SAS TEST')
  })

  /** Nothing to put in a title is an absence, never an empty name displayed as one. */
  it('should hand no name while no dossier is settled', () => {
    currentEntityStoreMock.currentEntity = undefined

    const { entityName } = useEntityName()

    expect(entityName.value).toBeUndefined()
  })

  it('should hand no name when the dossier carries an empty one', () => {
    currentEntityStoreMock.currentEntity = { legalName: '' } as EntitySummary

    const { entityName } = useEntityName()

    expect(entityName.value).toBeUndefined()
  })

  it('should follow the dossier the reader switches to', () => {
    currentEntityStoreMock.currentEntity = { legalName: 'SAS TEST' } as EntitySummary

    const { entityName } = useEntityName()
    currentEntityStoreMock.currentEntity = { legalName: 'SARL DEMO' } as EntitySummary

    expect(entityName.value).toBe('SARL DEMO')
  })
})
