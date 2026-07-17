import { armModuleMocks } from '@pulse/toolbox/mocks/spy-module.helper'
import { documentsServiceMock } from './documents.service.mocks'
import { folderServiceMock } from './folder.service.mocks'
import * as DocumentsService from '@ged/services/Documents'
import * as FolderService from '@ged/services/Folder'

// Re-applies the legacy automock behaviors of the spy-wrapped GED services
// (documents + folder) on the shared wrapper spies. The global mockReset
// restores the real implementations before every test (doctrine: guardrails), so
// specs call this in a beforeEach and arm their extra behaviors afterwards.
export function armGedServiceDefaults(): void {
  armModuleMocks(DocumentsService, documentsServiceMock)
  armModuleMocks(FolderService, folderServiceMock as unknown as Parameters<typeof armModuleMocks>[1])
}
