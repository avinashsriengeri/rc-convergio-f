/**
 * ENTERPRISE-GRADE I18N CONFIGURATION
 * 
 * This file provides a modular, scalable internationalization setup for the RC Convergio application.
 * It supports 9 languages with a clean module-based structure for easy maintenance and expansion.
 * 
 * ARCHITECTURE:
 * - Modular translation files organized by language and feature module
 * - Automatic combination using Object.assign() for clean separation
 * - localStorage persistence for user language preferences
 * - RTL support for Arabic language
 * - Fallback to English for missing translations
 * 
 * SUPPORTED LANGUAGES:
 * - en: English (🇬🇧) - Default/Fallback
 * - zh: Chinese (🇨🇳)
 * - ar: Arabic (🇸🇦) - RTL Support
 * - pt: Portuguese (🇵🇹)
 * - af: Afrikaans (🇿🇦)
 * - zu: Zulu (🇿🇦)
 * - fr: French (🇫🇷)
 * - tn: Tswana (🇧🇼)
 * - sw: Swahili (🇹🇿)
 * 
 * HOW TO ADD A NEW MODULE:
 * 1. Create translation files for each language:
 *    - src/locales/en/{module}.json
 *    - src/locales/zh/{module}.json
 *    - ... (repeat for all 9 languages)
 * 
 * 2. Import the new module translations in this file:
 *    import en{Module} from './locales/en/{module}.json'
 *    import zh{Module} from './locales/zh/{module}.json'
 *    ... (repeat for all languages)
 * 
 * 3. Add the module to each language's Object.assign() call:
 *    en: Object.assign({}, 
 *      { common: enCommon },
 *      { dashboard: enDashboard },
 *      { campaigns: enCampaigns },
 *      { auth: enAuth },
 *      { {module}: en{Module} }  // Add this line
 *    ),
 * 
 * 4. Use in components with: $t('{module}.key') or t('{module}.key')
 * 
 * EXAMPLE - Adding a "contacts" module:
 * 1. Create: src/locales/en/contacts.json with { "title": "Contacts", "add": "Add Contact" }
 * 2. Import: import enContacts from './locales/en/contacts.json'
 * 3. Add to messages: { contacts: enContacts }
 * 4. Use: $t('contacts.title') → "Contacts"
 * 
 * LAZY LOADING (Optional):
 * For large applications, consider implementing lazy loading using the utility in src/i18n/utils.js
 * This allows loading module translations only when needed, reducing initial bundle size.
 * 
 * MAINTENANCE:
 * - Keep translation keys consistent across all languages
 * - Use descriptive, hierarchical key names (e.g., 'campaigns.create.title')
 * - Test all languages after adding new translations
 * - Consider using translation management tools for large teams
 */

import { createI18n } from 'vue-i18n'
import { ref } from 'vue'

// Import modular translation files for English
import enCommon from './locales/en/common.json'
import enDashboard from './locales/en/dashboard.json'
import enCampaigns from './locales/en/campaigns.json'
import enAuth from './locales/en/auth.json'
import enCompanies from './locales/en/companies.json'
import enTasks from './locales/en/tasks.json'
import enContacts from './locales/en/contacts.json'
import enDeals from './locales/en/deals.json'
import enSettings from './locales/en/settings.json'
import enActivities from './locales/en/activities.json'
import enForms from './locales/en/forms.json'
import enUsers from './locales/en/users.json'
import enLists from './locales/en/lists.json'
import enMarketing from './locales/en/marketing.json'
import enSales from './locales/en/sales.json'
import enService from './locales/en/service.json'
import enCommerce from './locales/en/commerce.json'
import enCms from './locales/en/cms.json'
import enCopilot from './locales/en/copilot.json'

// Import modular translation files for Chinese
import zhCommon from './locales/zh/common.json'
import zhDashboard from './locales/zh/dashboard.json'
import zhCampaigns from './locales/zh/campaigns.json'
import zhAuth from './locales/zh/auth.json'
import zhCompanies from './locales/zh/companies.json'
import zhTasks from './locales/zh/tasks.json'
import zhContacts from './locales/zh/contacts.json'
import zhDeals from './locales/zh/deals.json'
import zhSettings from './locales/zh/settings.json'
import zhActivities from './locales/zh/activities.json'
import zhForms from './locales/zh/forms.json'
import zhUsers from './locales/zh/users.json'
import zhLists from './locales/zh/lists.json'
import zhMarketing from './locales/zh/marketing.json'
import zhSales from './locales/zh/sales.json'
import zhService from './locales/zh/service.json'
import zhCommerce from './locales/zh/commerce.json'
import zhCms from './locales/zh/cms.json'
import zhCopilot from './locales/zh/copilot.json'

// Import modular translation files for Arabic
import arCommon from './locales/ar/common.json'
import arDashboard from './locales/ar/dashboard.json'
import arCampaigns from './locales/ar/campaigns.json'
import arAuth from './locales/ar/auth.json'
import arCompanies from './locales/ar/companies.json'
import arTasks from './locales/ar/tasks.json'
import arContacts from './locales/ar/contacts.json'
import arDeals from './locales/ar/deals.json'
import arSettings from './locales/ar/settings.json'
import arActivities from './locales/ar/activities.json'
import arForms from './locales/ar/forms.json'
import arUsers from './locales/ar/users.json'
import arLists from './locales/ar/lists.json'
import arMarketing from './locales/ar/marketing.json'
import arSales from './locales/ar/sales.json'
import arService from './locales/ar/service.json'
import arCommerce from './locales/ar/commerce.json'
import arCms from './locales/ar/cms.json'
import arCopilot from './locales/ar/copilot.json'

// Import modular translation files for Portuguese
import ptCommon from './locales/pt/common.json'
import ptDashboard from './locales/pt/dashboard.json'
import ptCampaigns from './locales/pt/campaigns.json'
import ptAuth from './locales/pt/auth.json'
import ptCompanies from './locales/pt/companies.json'
import ptTasks from './locales/pt/tasks.json'
import ptContacts from './locales/pt/contacts.json'
import ptDeals from './locales/pt/deals.json'
import ptSettings from './locales/pt/settings.json'
import ptActivities from './locales/pt/activities.json'
import ptForms from './locales/pt/forms.json'
import ptUsers from './locales/pt/users.json'
import ptLists from './locales/pt/lists.json'
import ptMarketing from './locales/pt/marketing.json'

// Import modular translation files for Afrikaans
import afCommon from './locales/af/common.json'
import afDashboard from './locales/af/dashboard.json'
import afCampaigns from './locales/af/campaigns.json'
import afAuth from './locales/af/auth.json'
import afCompanies from './locales/af/companies.json'
import afTasks from './locales/af/tasks.json'
import afContacts from './locales/af/contacts.json'
import afDeals from './locales/af/deals.json'
import afSettings from './locales/af/settings.json'
import afActivities from './locales/af/activities.json'
import afForms from './locales/af/forms.json'
import afUsers from './locales/af/users.json'
import afLists from './locales/af/lists.json'
import afMarketing from './locales/af/marketing.json'

// Import modular translation files for Zulu
import zuCommon from './locales/zu/common.json'
import zuDashboard from './locales/zu/dashboard.json'
import zuCampaigns from './locales/zu/campaigns.json'
import zuAuth from './locales/zu/auth.json'
import zuCompanies from './locales/zu/companies.json'
import zuTasks from './locales/zu/tasks.json'
import zuContacts from './locales/zu/contacts.json'
import zuDeals from './locales/zu/deals.json'
import zuSettings from './locales/zu/settings.json'
import zuActivities from './locales/zu/activities.json'
import zuForms from './locales/zu/forms.json'
import zuUsers from './locales/zu/users.json'
import zuLists from './locales/zu/lists.json'
import zuMarketing from './locales/zu/marketing.json'

// Import modular translation files for French
import frCommon from './locales/fr/common.json'
import frDashboard from './locales/fr/dashboard.json'
import frCampaigns from './locales/fr/campaigns.json'
import frAuth from './locales/fr/auth.json'
import frCompanies from './locales/fr/companies.json'
import frTasks from './locales/fr/tasks.json'
import frContacts from './locales/fr/contacts.json'
import frDeals from './locales/fr/deals.json'
import frSettings from './locales/fr/settings.json'
import frActivities from './locales/fr/activities.json'
import frForms from './locales/fr/forms.json'
import frUsers from './locales/fr/users.json'
import frLists from './locales/fr/lists.json'
import frMarketing from './locales/fr/marketing.json'

// Import modular translation files for Tswana
import tnCommon from './locales/tn/common.json'
import tnDashboard from './locales/tn/dashboard.json'
import tnCampaigns from './locales/tn/campaigns.json'
import tnAuth from './locales/tn/auth.json'
import tnCompanies from './locales/tn/companies.json'
import tnTasks from './locales/tn/tasks.json'
import tnContacts from './locales/tn/contacts.json'
import tnDeals from './locales/tn/deals.json'
import tnSettings from './locales/tn/settings.json'
import tnActivities from './locales/tn/activities.json'
import tnForms from './locales/tn/forms.json'
import tnUsers from './locales/tn/users.json'
import tnLists from './locales/tn/lists.json'
import tnMarketing from './locales/tn/marketing.json'

// Import modular translation files for Swahili
import swCommon from './locales/sw/common.json'
import swDashboard from './locales/sw/dashboard.json'
import swCampaigns from './locales/sw/campaigns.json'
import swAuth from './locales/sw/auth.json'
import swCompanies from './locales/sw/companies.json'
import swTasks from './locales/sw/tasks.json'
import swContacts from './locales/sw/contacts.json'
import swDeals from './locales/sw/deals.json'
import swSettings from './locales/sw/settings.json'
import swActivities from './locales/sw/activities.json'
import swForms from './locales/sw/forms.json'
import swUsers from './locales/sw/users.json'
import swLists from './locales/sw/lists.json'
import swMarketing from './locales/sw/marketing.json'

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: {
    en: Object.assign({}, 
      { common: enCommon },
      { dashboard: enDashboard },
      { campaigns: enCampaigns },
      { auth: enAuth },
      { companies: enCompanies },
      { tasks: enTasks },
      { contacts: enContacts },
      { deals: enDeals },
      { settings: enSettings },
      { activities: enActivities },
      { forms: enForms },
      { users: enUsers },
      { lists: enLists },
      { marketing: enMarketing },
      { sales: enSales },
      { service: enService },
      { commerce: enCommerce },
      { cms: enCms },
      { copilot: enCopilot }
    ),
    zh: Object.assign({}, 
      { common: zhCommon },
      { dashboard: zhDashboard },
      { campaigns: zhCampaigns },
      { auth: zhAuth },
      { companies: zhCompanies },
      { tasks: zhTasks },
      { contacts: zhContacts },
      { deals: zhDeals },
      { settings: zhSettings },
      { activities: zhActivities },
      { forms: zhForms },
      { users: zhUsers },
      { lists: zhLists },
      { marketing: zhMarketing },
      { sales: zhSales },
      { service: zhService },
      { commerce: zhCommerce },
      { cms: zhCms },
      { copilot: zhCopilot }
    ),
    ar: Object.assign({}, 
      { common: arCommon },
      { dashboard: arDashboard },
      { campaigns: arCampaigns },
      { auth: arAuth },
      { companies: arCompanies },
      { tasks: arTasks },
      { contacts: arContacts },
      { deals: arDeals },
      { settings: arSettings },
      { activities: arActivities },
      { forms: arForms },
      { users: arUsers },
      { lists: arLists },
      { marketing: arMarketing },
      { sales: arSales },
      { service: arService },
      { commerce: arCommerce },
      { cms: arCms },
      { copilot: arCopilot }
    ),
    pt: Object.assign({}, 
      { common: ptCommon },
      { dashboard: ptDashboard },
      { campaigns: ptCampaigns },
      { auth: ptAuth },
      { companies: ptCompanies },
      { tasks: ptTasks },
      { contacts: ptContacts },
      { deals: ptDeals },
      { settings: ptSettings },
      { activities: ptActivities },
      { forms: ptForms },
      { users: ptUsers },
      { lists: ptLists },
      { marketing: ptMarketing }
    ),
    af: Object.assign({}, 
      { common: afCommon },
      { dashboard: afDashboard },
      { campaigns: afCampaigns },
      { auth: afAuth },
      { companies: afCompanies },
      { tasks: afTasks },
      { contacts: afContacts },
      { deals: afDeals },
      { settings: afSettings },
      { activities: afActivities },
      { forms: afForms },
      { users: afUsers },
      { lists: afLists },
      { marketing: afMarketing }
    ),
    zu: Object.assign({}, 
      { common: zuCommon },
      { dashboard: zuDashboard },
      { campaigns: zuCampaigns },
      { auth: zuAuth },
      { companies: zuCompanies },
      { tasks: zuTasks },
      { contacts: zuContacts },
      { deals: zuDeals },
      { settings: zuSettings },
      { activities: zuActivities },
      { forms: zuForms },
      { users: zuUsers },
      { lists: zuLists },
      { marketing: zuMarketing }
    ),
    fr: Object.assign({}, 
      { common: frCommon },
      { dashboard: frDashboard },
      { campaigns: frCampaigns },
      { auth: frAuth },
      { companies: frCompanies },
      { tasks: frTasks },
      { contacts: frContacts },
      { deals: frDeals },
      { settings: frSettings },
      { activities: frActivities },
      { forms: frForms },
      { users: frUsers },
      { lists: frLists },
      { marketing: frMarketing }
    ),
    tn: Object.assign({}, 
      { common: tnCommon },
      { dashboard: tnDashboard },
      { campaigns: tnCampaigns },
      { auth: tnAuth },
      { companies: tnCompanies },
      { tasks: tnTasks },
      { contacts: tnContacts },
      { deals: tnDeals },
      { settings: tnSettings },
      { activities: tnActivities },
      { forms: tnForms },
      { users: tnUsers },
      { lists: tnLists },
      { marketing: tnMarketing }
    ),
    sw: Object.assign({}, 
      { common: swCommon },
      { dashboard: swDashboard },
      { campaigns: swCampaigns },
      { auth: swAuth },
      { companies: swCompanies },
      { tasks: swTasks },
      { contacts: swContacts },
      { deals: swDeals },
      { settings: swSettings },
      { activities: swActivities },
      { forms: swForms },
      { users: swUsers },
      { lists: swLists },
      { marketing: swMarketing }
    )
  }
})

// Language configuration with flags and names
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'tn', name: 'Tswana', flag: '🇧🇼' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' }
]

// Function to change language
export const changeLanguage = (locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('selectedLanguage', locale)
  
  // Update document direction for RTL languages
  if (locale === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl')
    document.documentElement.setAttribute('lang', 'ar')
  } else {
    document.documentElement.setAttribute('dir', 'ltr')
    document.documentElement.setAttribute('lang', locale)
  }
}

// Initialize document direction
if (savedLanguage === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl')
  document.documentElement.setAttribute('lang', 'ar')
} else {
  document.documentElement.setAttribute('dir', 'ltr')
  document.documentElement.setAttribute('lang', savedLanguage)
}

export default i18n
