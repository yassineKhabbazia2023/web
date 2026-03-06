import type { AiMonitoringSummary } from '@backoffice/types/ai-monitoring.type'

export interface AiMonitoringStatsProps {
  summary: AiMonitoringSummary | null
  isLoading: boolean
}
