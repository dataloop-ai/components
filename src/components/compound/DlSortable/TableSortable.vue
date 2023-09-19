<template>
    <component
        :is="$props.tag"
        ref="rootRef"
        v-bind="props"
        :class="$props.class"
    >
        <slot />
    </component>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue-demi'
import DlTable from '../DlTable/DlTable.vue'
import { useSortable, useSortableProps, emits } from './use-sortable'

export default defineComponent({
    components: {
        DlTable
    },
    props: useSortableProps,
    emits,
    setup(props) {
        const vm = getCurrentInstance()

        const { element, getKey, rootRef } = useSortable(vm)
        return { element, getKey, rootRef }
    }
})
</script>
