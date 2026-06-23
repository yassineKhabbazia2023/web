// Payment type chosen by the prospect, mirroring the onboarding payment-preferences API.
// A `null` value (handled where the type is consumed) means no method has been selected yet.
export enum ConformityPaymentType {
  MandateSepa = 'MANDATE_SEPA',
  Other = 'OTHER',
}
