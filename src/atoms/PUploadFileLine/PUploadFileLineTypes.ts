import type { Component } from 'vue'
import { type UploadFile, type UploadRawFile, type UploadStatus } from 'element-plus'

export interface PUploadFileLineProps {
  pIcon?: Component | string
  pHasButton?: boolean
  pButtonIcon?: Component | string
  pTitleButton?: string
  pFile: UploadFile | UploadRawFile
  pStatus: UploadStatus
}
