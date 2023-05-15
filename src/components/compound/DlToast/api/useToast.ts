import { reactive } from 'vue'
import toastComponent from '../components/ToastComponent.vue'
import { createComponent } from '../utils/render'
import { v4 } from 'uuid'

export const useToast = (globalProps = {}) => {
    const state: { prevToastId: any; toasts: { [key: string]: any } } =
        reactive({
            prevMessage: null,
            prevToastId: null,
            toasts: {}
        })

    return {
        open(options: Object | string) {
            let message = null
            if (typeof options === 'string') message = options

            const defaultProps = {
                message,
                identifier: v4()
            }

            const propsData = Object.assign(
                {},
                defaultProps,
                globalProps,
                options,
                {
                    remove: () => {
                        delete state.toasts[defaultProps.identifier]
                    }
                }
            )

            if (state.prevToastId && state.toasts[state.prevToastId]) {
                const toast = state.toasts[state.prevToastId]
                const similar =
                    propsData.message === toast.props.message &&
                    propsData.type === toast.props.type
                if (similar) {
                    toast.proxy.updateCount(toast.proxy.count + 1)
                    return
                }
            }

            state.prevToastId = defaultProps.identifier
            state.toasts[defaultProps.identifier] = createComponent(
                toastComponent,
                propsData,
                document.body
            )
        }
    }
}
