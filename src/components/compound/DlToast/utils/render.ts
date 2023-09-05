import * as VueDemiModule from 'vue-demi'
import ToastComponent from '../components/ToastComponent.vue'

let createComponent: Function

const VueDemi: any = VueDemiModule

if (VueDemi.isVue3) {
    createComponent = function (
        component: object,
        props: object,
        parentContainer: Element,
        slots = {}
    ) {
        const vNode = VueDemi.h(component, props, slots)
        const container = document.createElement('div')
        container.classList.add('dl-toast-container--pending')
        parentContainer.appendChild(container)
        VueDemi.render(vNode, container)

        return vNode.component
    }
} else {
    createComponent = function (
        component: object,
        props: object,
        parentContainer: Element,
        slots = {}
    ) {
        const container = document.createElement('div')
        container.classList.add('dl-toast-container--pending')
        parentContainer.appendChild(container)
        return renderVue2Component(
            ToastComponent,
            props,
            '.dl-toast-container--pending',
            slots
        )
    }
}

export function removeElement(el: Element) {
    if (typeof el.remove !== 'undefined') {
        el.remove()
    } else {
        el.parentNode?.removeChild(el)
    }
}

export { createComponent }

function renderVue2Component(
    component: { [key: string]: any },
    props: { [key: string]: any },
    container: string,
    slots: { [key: string]: any }
) {
    const vueComponent: any = new VueDemi.Vue2({
        render: (
            h: (
                arg0: { [key: string]: any },
                arg1: { [key: string]: any }
            ) => any
        ) => h(component, { props, on: props.on, scopedSlots: slots })
    })
    return vueComponent.$mount(container)
}
