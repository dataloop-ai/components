import { isUndefined } from 'lodash'
import { ref, watch } from 'vue-demi'
import { DlTableRow } from '../types'

function getVal(val: DlTableRow[]) {
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

    function isRowExpanded(row: DlTableRow) {
        return innerExpanded.value.includes(row)
    }

    function setExpanded(val: DlTableRow[]) {
        if (props.expanded !== null && !isUndefined(props.expanded)) {
            emit('update:expanded', val)
        } else {
            innerExpanded.value = val
        }
    }

    function updateExpanded(row: DlTableRow) {
        const target = innerExpanded.value.slice()
        const index = target.indexOf(row)

        if (!isRowExpanded(row)) {
            if (index === -1) {
                target.push(row)
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
