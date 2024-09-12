import { describe, it, expect } from 'vitest'
import { getBreadcrumbItems }
  from '@ged/modules/common/helpers/folderHelper'
import type { Folder } from '@ged/models/Folder'
import mock from './folderHelper.mock.json'

const folders = mock.folders as unknown as Folder[]

describe('folderHelper', () => {
  it('should return the breadcrumb items', () => {
    const res = getBreadcrumbItems(folders, 135393649)

    const resExpectd = [{
      pId: 135393636,
      pText: 'Comptabilité',
    },
    {
      pId: 135393637,
      pText: 'Dépôt',
    },
    {
      pId: 135393649,
      pText: 'A classer',
    }]

    expect(res).toStrictEqual(resExpectd)
  })
  it('should return empty when empty param', () => {
    const res = getBreadcrumbItems([], 135393649)

    expect(res).toStrictEqual([])
  })
})
