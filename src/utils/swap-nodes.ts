export function swapNodes(nodeA: HTMLElement, nodeB: HTMLElement): void {
    if (!nodeA || !nodeB) return
    const parentA = nodeA.parentNode as Node
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling

    nodeB.parentNode?.insertBefore(nodeA, nodeB)

    if (parentA) {
        parentA.insertBefore(nodeB, siblingA)
    }
}
