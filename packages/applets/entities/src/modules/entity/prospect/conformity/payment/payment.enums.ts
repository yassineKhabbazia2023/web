// Shape of the card body for the current state — the template renders one block per kind.
export enum PaymentBodyKind {
  None = 'none',
  Benefits = 'benefits',
  Alert = 'alert',
  Bullets = 'bullets',
}

// Every action a footer button can trigger, all handled internally by the card (a service call,
// opening the configuration drawer, or downloading the signed mandate).
export enum PaymentFooterAction {
  SelectOtherMethod = 'select-other-method',
  StartConfiguration = 'start-configuration',
  DownloadMandate = 'download-mandate',
  ReturnToSepa = 'return-to-sepa',
}
