import * as VueDemi from 'vue-demi'
import ToastComponent from '../components/ToastComponent.vue'

let createComponent

if (VueDemi.isVue3) {
    createComponent = function (
        component: object,
        props: object,
        parentContainer: Element,
        slots = {}
    ) {
        const vNode = VueDemi.h(component, props, slots)
        const container = document.createElement('div')
        container.classList.add('v-toast--pending')
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
        container.classList.add('v-toast--pending')
        parentContainer.appendChild(container)
        renderVue2Component(ToastComponent, props, '.v-toast--pending')
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
    component: Object,
    props: Object,
    container: string
) {
    new VueDemi.Vue2({
        render: (h: (arg0: Object, arg1: { props: Object }) => any) =>
            h(component, { props })
    }).$mount(container)
}
