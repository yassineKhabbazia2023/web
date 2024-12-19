import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'
import { getButtonAction } from '@ged/modules/Documents/helpers/getButtonHelper'

interface ModalActionsWithOrder {
  modalButton: ButtonAction
  order: number
}

export const modalButtonsMove: Record<string, ModalActionsWithOrder> = {
  CAN_MOVE_FOLDER: {
    modalButton: getButtonAction(
      'Déplacer ici',
      'modal-move-folder-action-click',
    ),
    order: 2,
  },
  CANCEL_MOVE_FOLDER: {
    modalButton: getButtonAction(
      'Annuler',
      'modal-cancel-folder-action-click',
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
