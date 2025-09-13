/**
 * I18N UTILITIES FOR LAZY LOADING AND DYNAMIC TRANSLATIONS
 * 
 * This utility provides functions for dynamically loading module translations
 * and managing i18n state in large-scale applications.
 * 
 * USAGE:
 * import { loadModuleTranslations, addModuleTranslations } from '@/i18n/utils'
 * import { useI18n } from 'vue-i18n'
 * 
 * const { locale } = useI18n()
 * 
 * // Load translations for a specific module
 * await loadModuleTranslations('contacts', locale.value)
 * 
 * // Add translations dynamically
 * addModuleTranslations('contacts', {
 *   en: { title: 'Contacts', add: 'Add Contact' },
 *   zh: { title: '联系人', add: '添加联系人' }
 * })
 */

import { getCurrentInstance } from 'vue'

/**
 * Dynamically load module translations for a specific language
 * @param {string} moduleName - The module name (e.g., 'contacts', 'reports')
 * @param {string} locale - The target locale (e.g., 'en', 'zh', 'ar')
 * @returns {Promise<Object>} The loaded translation object
 */
export async function loadModuleTranslations(moduleName, locale) {
  try {
    // Dynamic import of the module translation file
    const module = await import(`../locales/${locale}/${moduleName}.json`)
    return module.default || module
  } catch (error) {
    console.warn(`Failed to load ${moduleName} translations for ${locale}:`, error)
    
    // Fallback to English if the translation doesn't exist
    if (locale !== 'en') {
      try {
        const fallbackModule = await import(`../locales/en/${moduleName}.json`)
        return fallbackModule.default || fallbackModule
      } catch (fallbackError) {
        console.error(`Fallback translation for ${moduleName} not found:`, fallbackError)
        return {}
      }
    }
    
    return {}
  }
}

/**
 * Add module translations to the current i18n instance
 * @param {string} moduleName - The module name
 * @param {Object} translations - Object with locale keys and translation objects
 * @param {Object} i18nInstance - The i18n instance (optional, will auto-detect)
 */
export function addModuleTranslations(moduleName, translations, i18nInstance = null) {
  const i18n = i18nInstance || getCurrentI18nInstance()
  
  if (!i18n) {
    console.error('No i18n instance found. Make sure to call this function within a Vue component context.')
    return
  }
  
  // Add translations for each locale
  Object.keys(translations).forEach(locale => {
    const existingMessages = i18n.global.getLocaleMessage(locale)
    const newMessages = {
      ...existingMessages,
      [moduleName]: translations[locale]
    }
    
    i18n.global.setLocaleMessage(locale, newMessages)
  })
}

/**
 * Load and add module translations for all supported languages
 * @param {string} moduleName - The module name
 * @param {Object} i18nInstance - The i18n instance (optional)
 */
export async function loadAndAddModuleTranslations(moduleName, i18nInstance = null) {
  const i18n = i18nInstance || getCurrentI18nInstance()
  const supportedLocales = ['en', 'zh', 'ar', 'pt', 'af', 'zu', 'fr', 'tn', 'sw']
  
  if (!i18n) {
    console.error('No i18n instance found.')
    return
  }
  
  const translations = {}
  
  // Load translations for all supported languages
  for (const locale of supportedLocales) {
    try {
      translations[locale] = await loadModuleTranslations(moduleName, locale)
    } catch (error) {
      console.warn(`Failed to load ${moduleName} for ${locale}:`, error)
      translations[locale] = {}
    }
  }
  
  // Add all translations to i18n
  addModuleTranslations(moduleName, translations, i18n)
}

/**
 * Get the current i18n instance from Vue context
 * @returns {Object|null} The i18n instance or null if not found
 */
function getCurrentI18nInstance() {
  try {
    const instance = getCurrentInstance()
    return instance?.appContext?.app?.config?.globalProperties?.$i18n || null
  } catch (error) {
    console.warn('Could not get current i18n instance:', error)
    return null
  }
}

/**
 * Check if a module translation is already loaded
 * @param {string} moduleName - The module name
 * @param {string} locale - The locale to check
 * @param {Object} i18nInstance - The i18n instance (optional)
 * @returns {boolean} True if the module is loaded
 */
export function isModuleLoaded(moduleName, locale, i18nInstance = null) {
  const i18n = i18nInstance || getCurrentI18nInstance()
  
  if (!i18n) return false
  
  const messages = i18n.global.getLocaleMessage(locale)
  return messages && messages[moduleName] !== undefined
}

/**
 * Remove module translations from i18n instance
 * @param {string} moduleName - The module name
 * @param {Object} i18nInstance - The i18n instance (optional)
 */
export function removeModuleTranslations(moduleName, i18nInstance = null) {
  const i18n = i18nInstance || getCurrentI18nInstance()
  
  if (!i18n) {
    console.error('No i18n instance found.')
    return
  }
  
  const supportedLocales = ['en', 'zh', 'ar', 'pt', 'af', 'zu', 'fr', 'tn', 'sw']
  
  supportedLocales.forEach(locale => {
    const messages = i18n.global.getLocaleMessage(locale)
    if (messages && messages[moduleName]) {
      delete messages[moduleName]
      i18n.global.setLocaleMessage(locale, messages)
    }
  })
}

/**
 * Create a composable for module-specific translations
 * @param {string} moduleName - The module name
 * @returns {Object} Composable with translation functions
 */
export function useModuleTranslations(moduleName) {
  const { t, locale } = getCurrentI18nInstance() || {}
  
  return {
    t: (key, params = {}) => t ? t(`${moduleName}.${key}`, params) : key,
    locale: locale?.value || 'en',
    loadModule: () => loadAndAddModuleTranslations(moduleName),
    isLoaded: () => isModuleLoaded(moduleName, locale?.value || 'en')
  }
}

