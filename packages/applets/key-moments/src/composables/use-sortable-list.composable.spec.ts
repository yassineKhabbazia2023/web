import { readMoveEvent } from './use-sortable-list.composable'

function buildEvent(itemId: string, fromListId: string, toListId: string, newIndex: number) {
  const item = document.createElement('div')
  item.dataset.itemId = itemId

  const from = document.createElement('div')
  from.dataset.listId = fromListId

  const to = document.createElement('div')
  to.dataset.listId = toListId

  return { item, from, to, newIndex }
}

describe('readMoveEvent', () => {

  it('should read the move off the data attributes of the nodes', () => {
    expect(readMoveEvent(buildEvent('tba', 'tableau-de-bord', 'activite', 2))).toEqual({
      itemId: 'tba',
      toListId: 'activite',
      newIndex: 2,
    })
  })

  it('should read an unnamed node as an empty move rather than raising', () => {
    const event = { ...buildEvent('tba', 'a', 'b', 0), newIndex: undefined }
    delete event.item.dataset.itemId
    delete event.to.dataset.listId

    expect(readMoveEvent(event)).toEqual({
      itemId: '',
      toListId: undefined,
      newIndex: 0,
    })
  })
})
