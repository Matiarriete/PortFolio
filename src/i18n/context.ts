import { createContext, useContext } from 'react'
import type { Dictionary, Locale } from './dictionaries'

export interface I18nValue {
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (value === null) {
    throw new Error('useI18n() must be called inside <LanguageProvider>')
  }
  return value
}