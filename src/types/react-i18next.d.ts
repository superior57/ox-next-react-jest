// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import common from '../../public/locales/en/common.json'
import units from '../../public/locales/en/units.json'
import patient from '../../public/locales/en/patient.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    common: typeof common
    units: typeof units
    patient: typeof patient
  }
}
