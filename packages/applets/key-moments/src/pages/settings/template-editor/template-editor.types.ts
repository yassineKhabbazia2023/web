/** What a confirmation popup of the editor is waiting on. */
export interface PendingRemoval {
  kind: 'screen' | 'widget'
  id: string
}
