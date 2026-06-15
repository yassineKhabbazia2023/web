// Message shown on the error line when a file exceeds `pMaxFileSize`. Kept
// internal (unlike the extension message which is the `pRejectedFileMessage` prop).
export const OVERSIZED_FILE_MESSAGE = 'Le fichier dépasse la taille autorisée'

// `pMaxFileSize` is expressed in megabytes; this converts it to bytes to compare
// against the native file size. Decimal megabyte (1_000_000), aligned with the
// existing repo convention (GED's MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000000).
export const BYTES_PER_MEGABYTE = 1_000_000
