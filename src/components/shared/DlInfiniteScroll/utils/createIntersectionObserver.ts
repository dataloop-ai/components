export const createIntersectionObserver = (ref: any, emit: Function) => {
    const root = ref?.$el || ref
    let wasIntersecting = true
    return new IntersectionObserver(
        ([entry]) => {
            const isCurrentlyIntersecting = entry.isIntersecting
            if (!wasIntersecting && isCurrentlyIntersecting) {
                emit()
            }
            wasIntersecting = isCurrentlyIntersecting
        },
        { root, threshold: 0.5 }
    )
}
