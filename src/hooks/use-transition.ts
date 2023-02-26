import { ref, computed, watch, nextTick, Ref } from 'vue-demi'

export const useTransitionProps = {
    transitionDuration: {
        type: Number,
        default: 300
    }
}

export default function (
    props: {
        transitionDuration: number
    },
    showing: Ref<boolean>
) {
    const transitionState = ref(showing.value)

    watch(showing, (val) => {
        nextTick(() => {
            transitionState.value = val
        })
    })

    // return transition
    return {
        transitionStyle: computed(() => {
            return {
                '--dl-transition-duration': `${props.transitionDuration}ms`
            }
        })
    }
}
