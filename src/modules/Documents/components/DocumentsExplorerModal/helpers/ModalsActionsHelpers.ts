import { ButtonAction } from '@/modules/common/Types/ButtonAction'

interface ModalActionsWithOrder {
    modalButton: ButtonAction
    order: number
}

export function generateActionsForModal(
  permissions: string[],
  actionbuttons: Record<string, ModalActionsWithOrder>
): ButtonAction[] {
  const actionbuttonsData: ModalActionsWithOrder[] = []
  for (const permission of permissions) {
    if (actionbuttons[permission]) {
      actionbuttonsData.push(actionbuttons[permission])
    }
  }
  return (actionbuttonsData
    .sort((a, b) => (a.order > b.order) ? 1 : -1)?.map(e => e?.modalButton))
}
