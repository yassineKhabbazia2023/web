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
  tagProps: { pColor: 'blue' },
}, {
  tagLabel: 'Développer',
  tagProps: { pColor: 'blue' },
}, {
  tagLabel: 'Transmettre',
  tagProps: { pColor: 'tranquil' },
}, {
  tagLabel: 'Conseil Patrimonial',
  tagProps: { pColor: 'warning' },
}, {
  tagLabel: 'Gestion Privée',
  tagProps: { pColor: 'success' },
}, {
  tagLabel: 'ESC',
  tagProps: { pColor: 'tranquil' },
}, {
  tagLabel: 'Conseil',
  tagProps: { pColor: 'blue' },
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
  tagProps: { pColor: 'blue' },
}, {
  tagLabel: 'Partenariat',
  tagProps: { pColor: 'blue' },
}]
