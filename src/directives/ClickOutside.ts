import { VNode, DirectiveBinding, Directive, isVue2 } from 'vue-demi'

const clickOutsideDirectiveVue2 = {
    bind(el: HTMLElement, binding: DirectiveBinding<VNode>) {
        // Define a function to handle the click event
        const handleClick = (event: MouseEvent) => {
            // Check if the clicked element is outside the element
            if (!(el == event.target || el.contains(event.target as Node))) {
                // Call the provided method when the click is outside
                binding.value(event)
            }
        }
        // Attach the event listener to the document object
        document.addEventListener('click', handleClick)
        // Save the event listener in the element's data object so that we can remove it later
        el.__clickOutsideEventHandler__ = handleClick
    },

    unbind(el: HTMLElement) {
        // Remove the event listener from the document object
        document.removeEventListener('click', el.__clickOutsideEventHandler__)
        // Remove the event listener from the element's data object
        delete el.__clickOutsideEventHandler__
    }
}

const clickOutsideDirectiveVue3: Directive<HTMLElement> = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const handleClickOutside = (event: MouseEvent) => {
            if (!el.contains(event.target as Node) && el !== event.target) {
                binding.value()
            }
        }
        document.addEventListener('click', handleClickOutside)
        el.__clickOutsideEventHandler__ = handleClickOutside
    },
    unmounted(el: HTMLElement) {
        document.removeEventListener('click', el.__clickOutsideEventHandler__)
        delete el.__clickOutsideEventHandler__
    }
}

export default isVue2 ? clickOutsideDirectiveVue2 : clickOutsideDirectiveVue3
