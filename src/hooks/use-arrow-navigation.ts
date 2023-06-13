import { ref, isRef, onMounted, onBeforeUnmount, computed } from 'vue-demi'

type ItemType = Record<string, any> | string

export function useArrowNavigation(items: any, isOpen: any) {
    const selectItem = ref<ItemType | null>(null)
    const highlightIndex = ref<number>(-1)

    const itemsData = computed(() => (isRef(items) ? items.value : items))
    const isMenuOpen = computed(() => (isRef(isOpen) ? isOpen.value : isOpen))

    const selectedItem = computed({
        get: () => selectItem.value,
        set: (value: ItemType) => {
            selectItem.value = value
        }
    })
    const highlightedIndex = computed({
        get: () => highlightIndex.value,
        set: (value: number) => {
            highlightIndex.value = value
        }
    })

    const itemsLength = computed<number>(() => itemsData.value.length)

    const decrementHighlightedIndex = (): void => {
        highlightedIndex.value -= 1
    }
    const incrementHighlightedIndex = (): void => {
        highlightedIndex.value += 1
    }
    const resetHighlightedIndex = (): void => {
        highlightedIndex.value = -1
    }

    const isEligibleToHandleEnter = computed<boolean>(() => {
        return (
            highlightedIndex.value >= 0 &&
            highlightedIndex.value < itemsLength.value
        )
    })
    const isEligibleToIncrementHighlightedIndex = computed<boolean>(() => {
        return highlightedIndex.value < itemsLength.value - 1
    })
    const isEligibleToDecrementHighlightedIndex = computed<boolean>(() => {
        return highlightedIndex.value > 0
    })
    const isNotEligibleToHandleArrows = computed<boolean>(() => {
        return !itemsLength.value || !isMenuOpen.value
    })

    const handleArrowUp = (event: KeyboardEvent) => {
        event.preventDefault()
        if (isEligibleToDecrementHighlightedIndex) {
            decrementHighlightedIndex()
        }
    }
    const handleArrowDown = (event: KeyboardEvent) => {
        event.preventDefault()
        if (isEligibleToIncrementHighlightedIndex.value) {
            incrementHighlightedIndex()
        }
    }
    const handleEnter = () => {
        if (isEligibleToHandleEnter.value) {
            selectedItem.value = itemsData.value[highlightedIndex.value]
            resetHighlightedIndex()
        }
    }

    const navigateList = (event: KeyboardEvent) => {
        if (isNotEligibleToHandleArrows.value) {
            return
        }
        switch (event.key) {
            case 'ArrowUp':
                handleArrowUp(event)
                break
            case 'ArrowDown':
                handleArrowDown(event)
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
