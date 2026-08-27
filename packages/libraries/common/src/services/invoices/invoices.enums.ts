/**
 * Where the demat mail dialog was opened from.
 * Sent as-is to Amplitude, hence the human-readable values.
 */
export enum DematMailLocalisation {
  CONNECTION = 'Connexion',
  HOME = 'Home',
  HEADER = 'Header',
}

/**
 * Routing codes eligible to the demat mail solicitation:
 * B2C and B2B International customers only.
 */
export enum DematMailRoutingCode {
  B2C = '0-B2C',
  B2B_INTERNATIONAL = '0-B2BINT',
}
