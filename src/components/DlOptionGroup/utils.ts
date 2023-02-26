import DlRadio from '../DlRadio.vue'
import DlSwitch from '../DlSwitch.vue'
import DlCheckbox from '../DlCheckbox.vue'

import { isVue3, shallowRef } from 'vue-demi'
import { OptionGroupOptions } from './OptionGroup.types'
import MenuItemWrapper from './MenuItemWrapper.vue'
import SimpleWrapper from './SimpleWrapper.vue'

export const components = isVue3
    ? {
          radio: shallowRef(DlRadio),
          checkbox: shallowRef(DlCheckbox),
          switch: shallowRef(DlSwitch)
          // toggle: shallowRef(DlToggle),
      }
    : {
          radio: () => import('../DlRadio.vue').then((d) => d.default),
          checkbox: () => import('../DlCheckbox.vue').then((d) => d.default),
          switch: () => import('../DlSwitch.vue').then((d) => d.default)
          // toggle: () => import('../DlToggle.vue').then(d => d.default),
      }
export const componentsType = Object.keys(components)

export const typeValidator = (type: string) => componentsType.includes(type)

export const optionsValidator = (opts: OptionGroupOptions) => {
    return opts.every((opt) => 'value' in opt && 'label' in opt)
}

export const wrappers = isVue3
    ? {
          menuItem: shallowRef(MenuItemWrapper),
          label: shallowRef(SimpleWrapper)
      }
    : {
          menuItem: () =>
              import('./MenuItemWrapper.vue').then((d) => d.default),
          label: () => import('./SimpleWrapper.vue').then((d) => d.default)
      }
