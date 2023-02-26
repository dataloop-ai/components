import { onBeforeUnmount } from 'vue-demi'

export default function () {
    let timer: number

    onBeforeUnmount(() => {
        clearTimeout(timer)
    })

    return {
        registerTimeout(fn: Function, delay: number) {
            clearTimeout(timer)
            timer = setTimeout(fn, delay)
        },

        removeTimeout() {
            clearTimeout(timer)
        }
    }
}
