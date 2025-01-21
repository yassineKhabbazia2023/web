import { it, expect, describe } from 'vitest'
import * as dragAndDropHelper from './drag-and-drop.helper'

describe('hasDragType', () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  const createMockDragEvent = (dataTransfer: Partial<DataTransfer> | null): DragEvent => {
    let mockDataTransfer: DataTransfer | null = null

    if (dataTransfer) {
      mockDataTransfer = {
        ...dataTransfer,
        types: dataTransfer.types || [],
      } as DataTransfer
    }

    return {
      dataTransfer: mockDataTransfer,
    } as DragEvent
  }

  it.each([
    {
      description: 'should return true when the drag event includes the specified type',
      event: createMockDragEvent({ types: ['Files', 'Images'] }),
      type: 'Files',
      expected: true,
    },
    {
      description: 'should return false when the drag event does not include the specified type',
      event: createMockDragEvent({ types: ['Images'] }),
      type: 'Files',
      expected: false,
    },
    {
      description: 'should return false when dataTransfer is null',
      event: createMockDragEvent(null),
      type: 'Files',
      expected: false,
    },
    {
      description: 'should return false when types is undefined',
      event: createMockDragEvent({ types: undefined }),
      type: 'Files',
      expected: false,
    },
  ])('$description', ({ event, type, expected }) => {
    const result = dragAndDropHelper.hasDragType(event, type)
    expect(result).toBe(expected)
  })
})
