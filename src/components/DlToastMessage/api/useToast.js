import toastComponent from '../components/ToastComponent.vue'
import { createComponent } from '../helpers/render'

export const useToast = (globalProps = {}) => {
    return {
        open(options) {
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
        },
        success(message, options = {}) {
            return this.open(
                Object.assign(
                    {},
                    {
                        message,
                        type: 'success'
                    },
                    options
                )
            )
        },
        error(message, options = {}) {
            return this.open(
                Object.assign(
                    {},
                    {
                        message,
                        type: 'error'
                    },
                    options
                )
            )
        },
        info(message, options = {}) {
            return this.open(
                Object.assign(
                    {},
                    {
                        message,
                        type: 'info'
                    },
                    options
                )
            )
        },
        warning(message, options = {}) {
            return this.open(
                Object.assign(
                    {},
                    {
                        message,
                        type: 'warning'
                    },
                    options
                )
            )
        }
    }
}
