import * as VueDemi from 'vue-demi'

let renderComponent: (
    vue2h: any,
    component: any,
    props: any,
    slots?: any
) => [VueDemi.VNode] | VueDemi.VNode

if (VueDemi.isVue3) {
    renderComponent = (_, component, options, slots) => {
        return VueDemi.h(component, options, options.scopedSlots || slots)
    }
} else {
    renderComponent = (vue2h, component, options, slots) => {
        return [
            vue2h?.(
                component,
                {
                    attrs: {
                        colspan: options.colspan,
                        class: options.class,
                        style: options.style,
                        id: options.id
                    },
                    props: options,
                    ref: options.ref,
                    key: options.key,
                    scopedSlots: options.scopedSlots,
                    on: options.on
                },
                slots
            )
        ]
    }
}

export function removeElement(el: Element) {
    if (typeof el.remove !== 'undefined') {
        el.remove()
    } else {
        el.parentNode?.removeChild(el)
    }
}

export { renderComponent }
