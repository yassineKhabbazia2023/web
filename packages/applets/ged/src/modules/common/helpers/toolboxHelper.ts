import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { foldersMappingRecord, documentsMappingRecord } from '../data/toolboxPermissionsMapping'
export interface ToolboxLineWithOrder {
  toolboxLine: PToolboxItemProps
  order: number
}

export function generateToolboxBasicData(
  target: string,
  permissions: string[],
  isInSearchScope?: boolean,
): PToolboxItemProps[] {
  const toolboxBasicData: ToolboxLineWithOrder[] = []
  const mappingRecord =
    target === 'Documents' ? documentsMappingRecord : foldersMappingRecord
  if (target === 'Documents') {
    toolboxBasicData.push(mappingRecord.CAN_DOWNLOAD_DOCUMENT)
    if (isInSearchScope) {
      toolboxBasicData.push(mappingRecord.CAN_GO_TO_DOCUMENT)
    }
  } else {
    toolboxBasicData.push(mappingRecord.CAN_DOWNLOAD_FOLDER)
  }
  for (const permission of permissions) {
    if (mappingRecord[permission]) {
      toolboxBasicData.push(mappingRecord[permission])
    }
  }

  return toolboxBasicData
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    ?.map((e) => e?.toolboxLine)
}

