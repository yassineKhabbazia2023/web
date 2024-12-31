import type { Component } from 'vue'

export interface PStepProps {
  pTitle?: string
  pDescription?: string
  pStatus?: '' | 'wait' | 'process' | 'finish' | 'error' | 'success'
}
