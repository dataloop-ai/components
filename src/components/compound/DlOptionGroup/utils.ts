import { DlRadio, DlSwitch, DlCheckbox } from '../../essential'
import { isVue3, shallowRef } from 'vue-demi'
import { DlOptionGroupOptions } from './types'
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
              import('../../essential/DlRadio/DlRadio.vue').then(
                  (d) => d.default
              ),
          checkbox: () =>
              import('../../essential/DlCheckbox/DlCheckbox.vue').then(
                  (d) => d.default
              ),
          switch: () =>
              import('../../essential/DlSwitch/DlSwitch.vue').then(
                  (d) => d.default
              )
      }
export const componentsType = Object.keys(components)

export const typeValidator = (type: string) => componentsType.includes(type)

export const optionsValidator = (opts: DlOptionGroupOptions) => {
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
