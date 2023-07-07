import { isUndefined } from 'lodash'
import { ref, watch } from 'vue-demi'

function getVal(val: string[]) {
    return Array.isArray(val) ? val.slice() : []
}

export const useTableRowExpandProps = {
    expanded: Array // v-model:expanded
}

export const useTableRowExpandEmits = ['update:expanded']

export function useTableRowExpand(props: any, emit: Function) {
    const innerExpanded = ref(getVal(props.expanded))

    watch(
        () => props.expanded,
        (val) => {
            innerExpanded.value = getVal(val)
        }
    )

    function isRowExpanded(key: string) {
        return innerExpanded.value.includes(key)
    }

    function setExpanded(val: string[]) {
        if (props.expanded !== null && !isUndefined(props.expanded)) {
            emit('update:expanded', val)
        } else {
            innerExpanded.value = val
        }
    }

    function updateExpanded(key: string, add: boolean) {
        const target = innerExpanded.value.slice()
        const index = target.indexOf(key)

        if (add === true) {
            if (index === -1) {
                target.push(key)
                setExpanded(target)
            }
        } else if (index !== -1) {
            target.splice(index, 1)
            setExpanded(target)
        }
    }

    return {
        isRowExpanded,
        setExpanded,
        updateExpanded
    }
}
