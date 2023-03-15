import { h, render } from 'vue-demi'

export function removeElement(el: Element) {
    if (typeof el.remove !== 'undefined') {
        el.remove()
    } else {
        el.parentNode?.removeChild(el)
    }
}

export function createComponent(
    component: object,
    props: object,
    parentContainer: Element,
    slots = {}
) {
    const vNode = h(component, props, slots)
    const container = document.createElement('div')
    container.classList.add('v-toast--pending')
    parentContainer.appendChild(container)
    render(vNode, container)

    return vNode.component
}
