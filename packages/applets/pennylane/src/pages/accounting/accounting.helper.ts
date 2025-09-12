import { HIDE_ACCOUNTING_HEADER_KEY, HIDE_ACCOUNTING_HEADER_TRUE, HIDE_ACCOUNTING_HEADER_FALSE } from './accounting.const'

export function persistHideAccountingHeader(HideAccountingHeader: boolean) {
  const HideAccountingHeaderStringified = HideAccountingHeader === true
    ? HIDE_ACCOUNTING_HEADER_TRUE
    : HIDE_ACCOUNTING_HEADER_FALSE
  localStorage.setItem(HIDE_ACCOUNTING_HEADER_KEY, HideAccountingHeaderStringified)
}

export function getHideAccountingHeader() {
  const HideAccountingHeaderStringified = localStorage.getItem(HIDE_ACCOUNTING_HEADER_KEY)

  return HideAccountingHeaderStringified === HIDE_ACCOUNTING_HEADER_TRUE
}
