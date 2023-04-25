/**
 * A simple delay function that resolves a promise after a certain MS
 * @param ms Number in MiliSeconds to wait
 * @returns
 */
export const delay = (ms: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
    })
}

/**
 * Simple function that resolves when next animation frame occurs
 * @returns
 */
export const waitNextFrame = () => {
    return new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
    })
}
