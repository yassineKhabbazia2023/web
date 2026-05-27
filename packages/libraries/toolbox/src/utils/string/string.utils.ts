import { isNotNullNorEmpty } from '../validators'

export function getAlphanumericString(text?: string): string {
  if (text === undefined) {
    return ''
  }

  return text
    .replaceAll('æ', 'ae') // Replace 'æ' with 'ae'
    .replaceAll('Æ', 'AE') // Replace 'Æ' with 'AE'
    .replaceAll('œ', 'oe') // Replace 'œ' with 'oe'
    .replaceAll('Œ', 'OE') // Replace 'Œ' with 'OE'
    .replaceAll('€', 'EURO') // Replace '€' with 'EURO'
    // see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    // and https://gist.github.com/codeguy/6684588?permalink_comment_id=3332719
    // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '') // Remove diacritics,
    .replaceAll(/[^a-zA-Z0-9]/g, ' ') // replace special characters by whitespaces
    .replaceAll(/ +/g, ' ') // Replace multiple whitespaces with a single whitespaces
    .trim()
}

export function formatPhoneNumber(phone?: string | null): string {
  if (phone === undefined || phone === null) {
    return ''
  }

  return phone.replaceAll(/(\d{2})(?=\d)/g, '$1 ')
}

export function formatFrenchPhoneNumber(phone?: string): string {
  if (phone === undefined || phone === '') {
    return ''
  }

  if (phone.startsWith('+33')) {
    return phone
  }

  const digits = phone.replaceAll(/\D/g, '')
  const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits

  return `+33${withoutLeadingZero}`
}

export function containsIgnoreCase(text: string, searchValue: string): boolean {
  return isNotNullNorEmpty(text) && text.toLowerCase().includes(searchValue.toLowerCase())
}
