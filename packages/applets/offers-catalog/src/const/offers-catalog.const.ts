import type { PTagProps } from '@pulse/styleguide/types'

export const DEFAULT_TAG_PROPS: Omit<PTagProps, 'pContent'> = {
  pColor: 'info',
}

export const CATALOG_TAG_STYLES: {
  tagLabel: string
  tagProps: Omit<PTagProps, 'pContent'>
}[] = [{
  tagLabel: 'Gérer',
  tagProps: { pColor: 'info' },
}, {
  tagLabel: 'ERC',
  tagProps: { pColor: 'info' },
}, {
  tagLabel: 'Pack',
  tagProps: { pColor: 'amethyste' },
}, {
  tagLabel: 'Développer',
  tagProps: { pColor: 'fuschia' },
}, {
  tagLabel: 'Transmettre',
  tagProps: { pColor: 'cyan' },
}, {
  tagLabel: 'Conseil Patrimonial',
  tagProps: { pColor: 'warning' },
}, {
  tagLabel: 'Gestion Privée',
  tagProps: { pColor: 'success' },
}, {
  tagLabel: 'ESC',
  tagProps: { pColor: 'cyan' },
}, {
  tagLabel: 'Conseil',
  tagProps: { pColor: 'fuschia' },
}, {
  tagLabel: 'Gestion sociale',
  tagProps: { pColor: 'warning' },
}, {
  tagLabel: 'Transverse',
  tagProps: { pColor: 'warning' },
}, {
  tagLabel: 'Avocats',
  tagProps: { pColor: 'success' },
}, {
  tagLabel: 'Filiale Gestion Privée',
  tagProps: { pColor: 'amethyste' },
}, {
  tagLabel: 'Partenariat',
  tagProps: { pColor: 'fuschia' },
}]
