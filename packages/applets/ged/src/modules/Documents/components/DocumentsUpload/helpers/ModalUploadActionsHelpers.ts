import type { ButtonAction } from '@/modules/common/Types/ButtonAction'

interface ModalActionsWithOrder {
  modalButton: ButtonAction
  order: number
}

export const modalButtonsUpload: Record<string, ModalActionsWithOrder> = {
  CAN_ADD_DOCUMENT: {
    modalButton: {
      buttonName: 'Déposer',
      buttonType: 'primary',
      buttonIcon: '',
      buttonActionName: 'modal-add-document-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small',
    },
    order: 2,
  },
  CANCEL_ADD_DOCUMENT: {
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
      size: 'small',
    },
    order: 1,
  },
  DEPOT_IN_PROGRESS: {
    modalButton: {
      buttonName: 'Dépôt en cours',
      buttonType: 'primary',
      buttonIcon: '',
      buttonActionName: '',
      plain: false,
      round: false,
      circle: false,
      loading: true,
      disabled: false,
      size: 'small',
    },
    order: 1,
  },
}
