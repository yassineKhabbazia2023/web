export function getAlphanumericString(text?: string): string {
  if (text === undefined) {
    return ''
  }

  return text
    .replace(/æ/g, 'ae') // Replace 'æ' with 'ae'
    .replace(/Æ/g, 'AE') // Replace 'Æ' with 'AE'
    .replace(/œ/g, 'oe') // Replace 'œ' with 'oe'
    .replace(/Œ/g, 'OE') // Replace 'Œ' with 'OE'
    .replace(/€/g, 'EURO') // Replace '€' with 'EURO'
    // see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    // and https://gist.github.com/codeguy/6684588?permalink_comment_id=3332719
    // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics,
    .replace(/[^a-zA-Z0-9]/g, ' ') // replace special characters by whitespaces
    .replace(/ +/g, ' ') // Replace multiple whitespaces with a single whitespaces
    .trim()
}

export function formatPhoneNumber(phone?: string | null): string {
  if (phone === undefined || phone === null) {
    return ''
  }

  return phone.replace(/(\d{2})(?=\d)/g, '$1 ')
}
