import { ref, onMounted, onBeforeUnmount } from 'vue-demi'

export function useArrowNavigation(items: any, isOpen: any) {
    const selectedItem = ref(null)
    const highlightedIndex = ref(-1)

    const handleArrowUp = () => {
        if (highlightedIndex.value > 0) {
            highlightedIndex.value--
        }
    }
    const handleArrowDown = () => {
        if (highlightedIndex.value < items.value.length - 1) {
            highlightedIndex.value++
        }
    }
    const handleEnter = () => {
        if (
            highlightedIndex.value >= 0 &&
            highlightedIndex.value < items.value.length
        ) {
            selectedItem.value = items.value[highlightedIndex.value]
            resetNavigation()
        }
    }
    const resetNavigation = () => {
        highlightedIndex.value = -1
    }
    const navigateList = (event: KeyboardEvent) => {
        if (!isOpen.value) {
            return
        }
        switch (event.key) {
            case 'ArrowUp':
                handleArrowUp()
                break
            case 'ArrowDown':
                handleArrowDown()
                break
            case 'Enter':
                handleEnter()
                break
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', navigateList)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', navigateList)
    })

    return {
        handleEnter,
        highlightedIndex,
        selectedItem
    }
}
