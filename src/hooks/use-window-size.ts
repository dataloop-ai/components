import { reactive, onMounted, onUnmounted } from 'vue-demi'

const useWindowSize = () => {
    const sizes = reactive({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const onResize = () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    }

    onMounted(() => {
        window.addEventListener('resize', onResize)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', onResize)
    })

    return sizes
}

export default useWindowSize
