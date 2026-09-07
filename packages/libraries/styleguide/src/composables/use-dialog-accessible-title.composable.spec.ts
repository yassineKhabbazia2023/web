import { ref } from 'vue'
import { useDialogAccessibleTitle } from './use-dialog-accessible-title.composable'

describe('useDialogAccessibleTitle', () => {
  it('flattens the base translation with the highlighted portion interpolated', () => {
    const t = (key: string, params?: Record<string, unknown>) => {
      if (key === 'dialog.title') {
        return `Missing information ${params?.highlight}`
      }
      if (key === 'dialog.titleHighlight') {
        return 'to provide'
      }
      return key
    }

    const title = useDialogAccessibleTitle(t, 'dialog.title', 'dialog.titleHighlight')

    expect(title.value).toBe('Missing information to provide')
  })

  it('stays reactive to changes made by the translate function it was built from', () => {
    const locale = ref<'en' | 'fr'>('en')
    const t = (key: string, params?: Record<string, unknown>) => {
      if (key === 'dialog.title') {
        return locale.value === 'en' ? `Missing information ${params?.highlight}` : `Informations manquantes ${params?.highlight}`
      }
      return locale.value === 'en' ? 'to provide' : 'à renseigner'
    }

    const title = useDialogAccessibleTitle(t, 'dialog.title', 'dialog.titleHighlight')
    expect(title.value).toBe('Missing information to provide')

    locale.value = 'fr'
    expect(title.value).toBe('Informations manquantes à renseigner')
  })
})
