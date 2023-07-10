import { computed, watch, nextTick, Ref } from 'vue-demi'

export const useTransitionProps = {
    /**
     * The duration of the transition in milliseconds.
     * @default 300
     * @type {number}
     *
     * Disabled for Vue2
     */
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
    watch(showing, (val) => {
        nextTick(() => {
            if (showing.value === val) return
            showing.value = val
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
