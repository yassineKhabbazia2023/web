import { displayNotification } from '@pulse/styleguide'
import { openDocumentInNewTab } from '@pulse/common/helpers'

// Shared per-test arming for the conformity document composable specs
// (engagement letter, commercial proposal, payment completed step): the
// spy-wrapped displayNotification and openDocumentInNewTab are stubbed out to
// keep the real behaviors inert.
export function armConformityDocumentMocks(): void {
  vi.mocked(displayNotification).mockImplementation(() => undefined)
  vi.mocked(openDocumentInNewTab).mockImplementation(() => undefined as unknown as Promise<boolean>)
}
