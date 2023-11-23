import { ButtonAction } from '@/modules/common/Types/ButtonAction'

interface ModalActionsWithOrder {
  modalButton: ButtonAction
  order: number
}

export const modalButtonsMove: Record<string, ModalActionsWithOrder> = {
  CAN_MOVE_DOCUMENT: {
    modalButton: {
      buttonName: 'Déplacer ici',
      buttonType: 'primary',
      buttonIcon: '',
      buttonActionName: 'modal-move-document-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 2
  },
  CANCEL_MOVE_DOCUMENT: {
    modalButton: {
      buttonName: 'Annuler',
      buttonType: 'primary',
      buttonIcon: '',
      buttonActionName: 'modal-cancel-document-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 1
  },
  MOVE_IN_PROGRESS: {
    modalButton: {
      buttonName: 'Déplacement en cours',
      buttonType: 'primary',
      buttonIcon: '',
      buttonActionName: '',
      plain: false,
      round: false,
      circle: false,
      loading: true,
      disabled: false,
      size: 'small'
    },
    order: 1
  }
}
