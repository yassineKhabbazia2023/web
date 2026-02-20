export enum InvoicesFormStep {
  EMAIL_AND_TERMS = 1,
  SELECT_CONTACT = 2,
  VAULT_BEING_CREATED = 3,
  ACCESS_VAULT = 4,
}

export enum InvoicesAssistanceFormParam {
  FIRSTNAME = 'firstname',
  LASTNAME = '0-1/lastname',
  EMAIL = '0-1/email',
  PHONE = '0-1/phone',
  COMPANY = '0-1/company',
  CUSTOMER_CODE = '0-1/code_client',
}
