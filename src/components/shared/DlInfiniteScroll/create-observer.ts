export const createObserver = (ref: any, emit: Function) => {
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
        { root }
    )
}
