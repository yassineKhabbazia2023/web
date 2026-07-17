import { getMainIconName } from './PUploadFileLineUtils'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import type { IconName } from '../../types/IconName.types'

describe('test PUploadFileLineUtils', () => {
  const tests: {
    pStatus: PUploadFileLineProps['pStatus'],
    pIconName: PUploadFileLineProps['pIconName'],
    expectedIconName?: IconName
  }[] = [{
    pStatus: 'ready',
    pIconName: 'x',
    expectedIconName: 'x',
  }, {
    pStatus: 'uploading',
    pIconName: 'x',
    expectedIconName: 'x',
  }, {
    pStatus: 'success',
    pIconName: 'x',
    expectedIconName: 'x',
  }, {
    pStatus: 'fail',
    pIconName: 'x',
    expectedIconName: 'exclamationTriangle',
  }, {
    pStatus: 'uploading',
    pIconName: undefined,
    expectedIconName: undefined,
  }]
  it.each(tests)(
    'main icon should be $expectedIconName when pStatus is $pStatus and pIconName is $pIconName', ({
      pStatus,
      pIconName,
      expectedIconName,
    }) => {
      const iconName = getMainIconName(pStatus, pIconName)
      expect(iconName).toBe(expectedIconName)
    })
})
