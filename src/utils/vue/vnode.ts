import type { VNode, VNodeChild, VNodeNormalizedChildren } from 'vue-demi'
import { isVNode } from 'vue-demi'
import { isArray } from '@vue/shared'

export type VNodeChildAtom = Exclude<VNodeChild, any[]>
export type RawSlots = Exclude<VNodeNormalizedChildren, any[] | null | string>
export type FlattenVNodes = (VNodeChildAtom | RawSlots)[]

export const flattedChildren = (
    children: FlattenVNodes | VNode | VNodeNormalizedChildren
): FlattenVNodes => {
    const vNodes = isArray(children) ? children : [children]
    const result: FlattenVNodes = []

    vNodes.forEach((child) => {
        if (isArray(child)) {
            result.push(...flattedChildren(child))
        } else if (isVNode(child) && isArray(child.children)) {
            result.push(...flattedChildren(child.children))
        } else {
            result.push(child)
            if (isVNode(child) && child.component?.subTree) {
                result.push(...flattedChildren(child.component.subTree))
            }
        }
    })
    return result
}
