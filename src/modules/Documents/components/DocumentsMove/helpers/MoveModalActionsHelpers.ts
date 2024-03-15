import type { ButtonAction } from '@/modules/common/Types/ButtonAction'
import { getButtonAction } from '@/modules/Documents/helpers/getButtonHelper'

interface ModalActionsWithOrder {
  modalButton: ButtonAction
  order: number
}

export const modalButtonsMove: Record<string, ModalActionsWithOrder> = {
  CAN_MOVE_DOCUMENT: {
    modalButton: getButtonAction(
      'Déplacer ici',
      'modal-move-document-action-click',
    ),
    order: 2,
  },
  CANCEL_MOVE_DOCUMENT: {
    modalButton: getButtonAction(
      'Annuler',
      'modal-cancel-document-action-click', {
        plain: true,
      },
    ),
    order: 1,
  },
  MOVE_IN_PROGRESS: {
    modalButton: getButtonAction(
      'Déplacement en cours',
      '',
    ),
    order: 1,
  },
}
