import type { AgentLockEnvironmentItem } from '@backoffice/types/agents-dashboard.type'

export interface CreateAgentLockDialogProps {
  environments: AgentLockEnvironmentItem[]
}

export interface CreateAgentLockFormData {
  environmentId: number | null
  reason: string
}

export interface UseCreateAgentLockDialogOptions {
  onSuccess: () => void
  onClose: () => void
}

export interface CreateAgentLockValidationErrors {
  environmentId?: string
  reason?: string
}
