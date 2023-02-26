import { globalConfig } from './global-config'

const globalNodes: HTMLElement[] = []
let target = document.body

export function createGlobalNode(id: string | null = null) {
    const el: HTMLElement = document.createElement('div')
    el.setAttribute('data-test-id', 'portal')

    if (id) {
        el.id = id
    }

    if (globalConfig.globalNodes !== void 0) {
        const cls = globalConfig.globalNodes.class
        if (cls !== void 0) {
            el.className = cls
        }
    }

    target.appendChild(el)
    globalNodes.push(el)

    return el
}

export function removeGlobalNode(el: HTMLElement) {
    globalNodes.splice(globalNodes.indexOf(el), 1)
    el.remove()
}

export function changeGlobalNodesTarget(el: HTMLElement) {
    if (el !== target) {
        target = el

        globalNodes.forEach((el) => {
            if (el.contains(target) === false) {
                target.appendChild(el)
            }
        })
    }
}
