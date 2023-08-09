import { install, reactive } from 'vue-demi'

install()

export * from './StateManager'

export * from './components'
export * from './layouts'

import DlComponentsDemo from './App.vue'
export { DlComponentsDemo }
