import toastComponent from '../components/ToastComponent.vue'
import { createComponent } from '../utils/render'

export const useToast = (globalProps = {}) => {
    return {
        open(options: Object | string) {
            let message = null
            if (typeof options === 'string') message = options

            const defaultProps = {
                message
            }

            const propsData = Object.assign(
                {},
                defaultProps,
                globalProps,
                options
            )
            createComponent(toastComponent, propsData, document.body)
        }
    }
}
