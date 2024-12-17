import type { Component } from 'vue'
import { type UploadFile, type UploadRawFile, type UploadStatus } from 'element-plus'
import type { IconName } from '../../types/IconName.types'

export interface PUploadFileLineProps {
  pIcon?: Component | string // @deprecated TODO remove this (use pIconName instead)
  pIconName?: IconName
  pHasButton?: boolean
  pButtonIcon?: Component | string // @deprecated TODO remove this (use pButtonIconName instead)
  pButtonIconName?: IconName
  pTitleButton?: string
  pFile: UploadFile | UploadRawFile
  pStatus: UploadStatus
  pColor?: 'persian' | 'white'
}
