import type { PTagProps } from '@pulse/styleguide/types'

export const DEFAULT_TAG_PROPS: Omit<PTagProps, 'pContent'> = {
  pColor: 'info',
  pEffect: 'light',
}

export const CATALOG_TAG_STYLES: {
  tagLabel: string
  tagProps: Omit<PTagProps, 'pContent'>
}[] = [{
  tagLabel: 'Gérer',
  tagProps: { pColor: 'info', pEffect: 'light' },
}, {
  tagLabel: 'ERC',
  tagProps: { pColor: 'info', pEffect: 'light' },
}, {
  tagLabel: 'Pack',
  tagProps: { pColor: 'amethyste', pEffect: 'light' },
}, {
  tagLabel: 'Développer',
  tagProps: { pColor: 'fuschia', pEffect: 'light' },
}, {
  tagLabel: 'Transmettre',
  tagProps: { pColor: 'cyan', pEffect: 'light' },
}, {
  tagLabel: 'Conseil Patrimonial',
  tagProps: { pColor: 'warning', pEffect: 'light' },
}, {
  tagLabel: 'Gestion Privée',
  tagProps: { pColor: 'success', pEffect: 'light' },
}, {
  tagLabel: 'ESC',
  tagProps: { pColor: 'cyan', pEffect: 'light' },
}, {
  tagLabel: 'Conseil',
  tagProps: { pColor: 'fuschia', pEffect: 'light' },
}, {
  tagLabel: 'Gestion sociale',
  tagProps: { pColor: 'warning', pEffect: 'light' },
}, {
  tagLabel: 'Transverse',
  tagProps: { pColor: 'warning', pEffect: 'light' },
}, {
  tagLabel: 'Avocats',
  tagProps: { pColor: 'success', pEffect: 'light' },
}, {
  tagLabel: 'Filiale Gestion Privée',
  tagProps: { pColor: 'amethyste', pEffect: 'light' },
}, {
  tagLabel: 'Partenariat',
  tagProps: { pColor: 'fuschia', pEffect: 'light' },
}]
