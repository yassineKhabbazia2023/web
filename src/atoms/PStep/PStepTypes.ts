import type { Component } from 'vue'

export interface PStepProps {
  pTitle?: string,
  pDescription?: string,
  pIcon?: string | Component,
  pStatus?: '' | 'wait' | 'process' | 'finish' | 'error' | 'success'
}
