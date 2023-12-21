export const createObserver = (emit: Function) => {
    let wasIntersecting = true
    return new IntersectionObserver(([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting
        if (!wasIntersecting && isCurrentlyIntersecting) {
            emit()
        }
        wasIntersecting = isCurrentlyIntersecting
    })
}
