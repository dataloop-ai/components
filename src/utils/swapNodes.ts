export function swapNodes({ source, target }: NodeSwap) {
    const p1 = source.parentNode
    const p2 = target.parentNode
    let i1
    let i2

    if (!p1 || !p2 || p1.isEqualNode(target) || p2.isEqualNode(source)) return

    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(source)) {
            i1 = i
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(target)) {
            i2 = i
        }
    }

    if (p1.isEqualNode(p2) && i1 < i2) {
        i2++
    }
    p1.insertBefore(target, p1.children[i1])
    p2.insertBefore(source, p2.children[i2])
}

export interface NodeSwap {
    source: HTMLElement
    target: HTMLElement
}
