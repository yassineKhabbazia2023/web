import type { Language } from 'element-plus/es/locale'

export interface PConfigProviderProps {
  pLocale?: Language,
  pSize?: 'large' | 'default' | 'small',
  pZIndex?: number,
  pNamespace?: string,
  pButton?: { autoInsertSpace?: boolean },
  pMessage?: { max: number },
}
