// Message shown on the error line when a file exceeds `pMaxFileSize`. Kept
// internal (unlike the extension message which is the `pRejectedFileMessage` prop).
export const OVERSIZED_FILE_MESSAGE = 'Le fichier dépasse la taille autorisée, le fichier ne sera pas enregistré'

// Default toast message when a selection exceeds the allowed file count
// (element-plus rejects the whole batch). Overridable via `pMaxFilesExceededMessage`.
export const MAX_FILES_EXCEEDED_MESSAGE = 'Le nombre maximum de fichiers autorisés est atteint'

// Default toast message when the remote deletion of a persisted document fails.
// Overridable via `pRemoteDeleteErrorMessage`.
export const REMOTE_DELETE_ERROR_MESSAGE = 'La suppression du document a échoué'

// Default texts of the confirmation popup shown before a remote deletion.
// Overridable via the `pDeleteConfirmation*` props.
export const DELETE_CONFIRMATION_TITLE = 'Supprimer le document'
export const DELETE_CONFIRMATION_MESSAGE = 'Êtes-vous sûr de vouloir supprimer ce document ?'
export const DELETE_CONFIRMATION_CONFIRM_LABEL = 'Supprimer'
export const DELETE_CONFIRMATION_CANCEL_LABEL = 'Annuler'

// `pMaxFileSize` is expressed in megabytes; this converts it to bytes to compare
// against the native file size. Decimal megabyte (1_000_000), aligned with the
// existing repo convention (GED's MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000000).
export const BYTES_PER_MEGABYTE = 1_000_000
