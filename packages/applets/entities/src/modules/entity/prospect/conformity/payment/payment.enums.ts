// Shape of the card body for the current state — the template renders one block per kind.
export enum PaymentBodyKind {
  None = 'none',
  Benefits = 'benefits',
  Alert = 'alert',
  Bullets = 'bullets',
}

// Every action a footer button can trigger. Some are handled internally (service calls),
// the others are delegated to the parent through PaymentEmits. The string values double as
// the Vue emit event names for the delegated actions.
export enum PaymentFooterAction {
  SelectOtherMethod = 'select-other-method',
  StartConfiguration = 'start-configuration',
  DownloadMandate = 'download-mandate',
  ReturnToSepa = 'return-to-sepa',
}
