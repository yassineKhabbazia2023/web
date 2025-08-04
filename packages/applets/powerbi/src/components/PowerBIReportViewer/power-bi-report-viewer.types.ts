import type { IEmbedConfigurationBase } from 'powerbi-models'

export interface PowerBIReportViewerProps {
  modelValue: boolean
  reportLabel: string
  powerBIConfig: IEmbedConfigurationBase
}
