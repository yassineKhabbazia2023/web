import { ref, nextTick } from 'vue'
import type { UploadFile, UploadInstance } from 'element-plus'
import { withSetup } from '@pulse/toolbox/utils/test'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '../../utils/PNotification/PNotification'
import { getAxiosInstance } from '../../utils/axiosInstanceInit'
import { useUploadCore } from './PUploadCore.composable'
import type { PUploadCoreOptions } from './PUploadTypes'

const buildUploadFile = (name: string, type: string, uid = 1, size = 100): UploadFile => {
  const rawFile = new File(['content'], name, { type })
  return {
    name,
    uid,
    status: 'ready',
    size,
    raw: Object.assign(rawFile, { uid }),
  } as UploadFile
}

const buildOptions = (overrides: Partial<PUploadCoreOptions> = {}): PUploadCoreOptions => ({
  uploadElement: ref(null),
  accept: ref(undefined),
  maxFileSizeInMo: ref(undefined),
  rejectedFileMessage: ref('Extension non supportée'),
  oversizedFileMessage: ref('Fichier trop volumineux'),
  maxFilesExceededMessage: ref('Trop de fichiers'),
  canRemoteDelete: ref(false),
  remoteDeleteUrl: ref(undefined),
  remoteDeleteErrorMessage: ref('Suppression échouée'),
  uploadedFileIds: ref([]),
  ...overrides,
})

const buildUploadElement = (): UploadInstance => {
  const rootElement = document.createElement('div')
  const nativeInputElement = document.createElement('input')
  nativeInputElement.className = 'el-upload__input'
  rootElement.appendChild(nativeInputElement)
  return { $el: rootElement } as unknown as UploadInstance
}

describe('useUploadCore', () => {
  beforeEach(() => {
    vi.mocked(displayNotification).mockReturnValue(undefined)
  })

  describe('native accept patch', () => {
    it('should apply accept to the native input when the upload element mounts', async () => {
      const uploadElement = ref<UploadInstance | null>(null)
      const [, app] = withSetup(() => useUploadCore(buildOptions({
        uploadElement,
        accept: ref('.pdf'),
      })))
      uploadElement.value = buildUploadElement()
      await nextTick()

      const nativeInputElement = (uploadElement.value.$el as HTMLElement).querySelector('input.el-upload__input')
      expect(nativeInputElement?.getAttribute('accept')).toBe('.pdf')
      app.unmount()
    })

    it('should not set the accept attribute when accept is empty', async () => {
      const uploadElement = ref<UploadInstance | null>(null)
      const [, app] = withSetup(() => useUploadCore(buildOptions({
        uploadElement,
        accept: ref(undefined),
      })))
      uploadElement.value = buildUploadElement()
      await nextTick()

      const nativeInputElement = (uploadElement.value.$el as HTMLElement).querySelector('input.el-upload__input')
      expect(nativeInputElement?.getAttribute('accept')).toBeNull()
      app.unmount()
    })

    it('should re-apply the patch when accept changes', async () => {
      const uploadElement = ref<UploadInstance | null>(buildUploadElement())
      const accept = ref<string | undefined>('.pdf')
      const [, app] = withSetup(() => useUploadCore(buildOptions({ uploadElement, accept })))
      accept.value = '.jpg'
      await nextTick()

      const nativeInputElement = (uploadElement.value!.$el as HTMLElement).querySelector('input.el-upload__input')
      expect(nativeInputElement?.getAttribute('accept')).toBe('.jpg')
      app.unmount()
    })
  })

  describe('tryAcceptFile', () => {
    it('should accept a valid file without recording any rejected entry', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ accept: ref('.png') })))

      expect(core.tryAcceptFile(buildUploadFile('image.png', 'image/png'))).toBe(true)
      expect(core.rejectedEntries.value).toStrictEqual([])
      app.unmount()
    })

    it('should reject a disallowed extension with the rejection message', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ accept: ref('.png') })))

      expect(core.tryAcceptFile(buildUploadFile('document.exe', 'application/x-msdownload', 3))).toBe(false)
      expect(core.rejectedEntries.value).toStrictEqual([
        { uid: 3, fileName: 'document.exe', message: 'Extension non supportée' },
      ])
      app.unmount()
    })

    it('should reject an oversized file with the oversized message', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ maxFileSizeInMo: ref(1) })))

      expect(core.tryAcceptFile(buildUploadFile('image.png', 'image/png', 4, 2_000_000))).toBe(false)
      expect(core.rejectedEntries.value).toStrictEqual([
        { uid: 4, fileName: 'image.png', message: 'Fichier trop volumineux' },
      ])
      app.unmount()
    })

    it('should accumulate rejected entries across calls', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ accept: ref('.png') })))
      core.tryAcceptFile(buildUploadFile('first.exe', 'application/x-msdownload', 1))
      core.tryAcceptFile(buildUploadFile('second.exe', 'application/x-msdownload', 2))

      expect(core.rejectedEntries.value).toHaveLength(2)
      app.unmount()
    })
  })

  describe('dismissRejectedEntry', () => {
    it('should remove only the dismissed entry', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ accept: ref('.png') })))
      core.tryAcceptFile(buildUploadFile('first.exe', 'application/x-msdownload', 1))
      core.tryAcceptFile(buildUploadFile('second.exe', 'application/x-msdownload', 2))

      core.dismissRejectedEntry(1)

      expect(core.rejectedEntries.value).toStrictEqual([
        { uid: 2, fileName: 'second.exe', message: 'Extension non supportée' },
      ])
      app.unmount()
    })
  })

  describe('notifyMaxFilesExceeded', () => {
    it('should display an error notification with the configured message', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions()))
      core.notifyMaxFilesExceeded()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'Trop de fichiers')
      app.unmount()
    })
  })

  describe('isRemoteDeleteEnabled', () => {
    it('should be disabled by default', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions()))

      expect(core.isRemoteDeleteEnabled.value).toBe(false)
      app.unmount()
    })

    it('should be enabled when allowed and a delete url is provided', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({
        canRemoteDelete: ref(true),
        remoteDeleteUrl: ref('/documents'),
      })))

      expect(core.isRemoteDeleteEnabled.value).toBe(true)
      app.unmount()
    })

    it('should stay disabled when allowed but no url is provided', () => {
      const [core, app] = withSetup(() => useUploadCore(buildOptions({ canRemoteDelete: ref(true) })))

      expect(core.isRemoteDeleteEnabled.value).toBe(false)
      app.unmount()
    })
  })

  describe('deleteUploadedFileRemotely', () => {
    const buildRemoteOptions = (overrides: Partial<PUploadCoreOptions> = {}) => buildOptions({
      canRemoteDelete: ref(true),
      remoteDeleteUrl: ref('/documents'),
      uploadedFileIds: ref<(string | number)[]>([12]),
      ...overrides,
    })

    it('should call DELETE on the base url suffixed with the file id and keep the deleting state', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const [core, app] = withSetup(() => useUploadCore(buildRemoteOptions()))

      const outcome = await core.deleteUploadedFileRemotely(12)

      expect(deleteMock).toHaveBeenCalledWith('/documents/12')
      expect(outcome).toBe('deleted')
      expect(core.deletingUploadedFileIds.value.has(12)).toBe(true)
      app.unmount()
    })

    it('should normalize a trailing slash on the base url', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const [core, app] = withSetup(() => useUploadCore(buildRemoteOptions({
        remoteDeleteUrl: ref('/documents/'),
      })))

      await core.deleteUploadedFileRemotely(12)

      expect(deleteMock).toHaveBeenCalledWith('/documents/12')
      app.unmount()
    })

    it('should toast the error and release the deleting state when the deletion fails', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: vi.fn().mockRejectedValue(new Error('network error')) })
      const [core, app] = withSetup(() => useUploadCore(buildRemoteOptions()))

      const outcome = await core.deleteUploadedFileRemotely(12)

      expect(outcome).toBe('failed')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'Suppression échouée')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(core.deletingUploadedFileIds.value.has(12)).toBe(false)
      app.unmount()
    })

    it('should report unavailable when no axios instance was provided', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue(undefined)
      const [core, app] = withSetup(() => useUploadCore(buildRemoteOptions()))

      const outcome = await core.deleteUploadedFileRemotely(12)

      expect(outcome).toBe('unavailable')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(core.deletingUploadedFileIds.value.size).toBe(0)
      app.unmount()
    })

    it('should release the deleting state once the file leaves the displayed documents', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: vi.fn().mockResolvedValue(undefined) })
      const uploadedFileIds = ref<(string | number)[]>([12])
      const [core, app] = withSetup(() => useUploadCore(buildRemoteOptions({ uploadedFileIds })))
      await core.deleteUploadedFileRemotely(12)

      uploadedFileIds.value = []
      await nextTick()

      expect(core.deletingUploadedFileIds.value.size).toBe(0)
      app.unmount()
    })
  })
})
