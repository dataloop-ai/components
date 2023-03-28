import { DlRadio, DlSwitch, DlCheckbox } from '../../essential'
import { isVue3, shallowRef } from 'vue-demi'
import { OptionGroupOptions } from './OptionGroup.types'
import MenuItemWrapper from './components/MenuItemWrapper.vue'
import SimpleWrapper from './components/SimpleWrapper.vue'

export const components: { [key: string]: any } = isVue3
    ? {
          radio: shallowRef(DlRadio),
          checkbox: shallowRef(DlCheckbox),
          switch: shallowRef(DlSwitch)
          // toggle: shallowRef(DlToggle),
      }
    : {
          radio: () =>
              import('../../essential/DlRadio.vue').then((d) => d.default),
          checkbox: () =>
              import('../../essential/DlCheckbox.vue').then((d) => d.default),
          switch: () =>
              import('../../essential/DlSwitch.vue').then((d) => d.default)
          // toggle: () => import('../DlToggle.vue').then(d => d.default),
      }
export const componentsType = Object.keys(components)

export const typeValidator = (type: string) => componentsType.includes(type)

export const optionsValidator = (opts: OptionGroupOptions) => {
    return opts.every((opt) => 'value' in opt && 'label' in opt)
}

export const wrappers: { [key: string]: any } = isVue3
    ? {
          menuItem: shallowRef(MenuItemWrapper),
          label: shallowRef(SimpleWrapper)
      }
    : {
          menuItem: () =>
              import('./components/MenuItemWrapper.vue').then((d) => d.default),
          label: () =>
              import('./components/SimpleWrapper.vue').then((d) => d.default)
      }
