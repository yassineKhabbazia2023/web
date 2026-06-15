// element-plus only exposes its upload status as a `UploadStatus` union type with
// no runtime counterpart, which forces magic-string comparisons. This enum mirrors
// that union so we get usable values across the styleguide upload components.
export enum UploadFileStatus {
  READY = 'ready',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAIL = 'fail',
}
