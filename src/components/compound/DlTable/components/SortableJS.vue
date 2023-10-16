<template>
    <component
        :is="$props.tag"
        v-if="isSortable"
        ref="rootRef"
        v-bind="props"
        :class="$props.class"
    >
        <slot />
    </component>
    <component
        :is="$props.tag"
        v-else
        v-bind="props"
        :class="$props.class"
    >
        <slot />
    </component>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue-demi'
import { useSortable, useSortableProps, emits } from '../hooks/use-sortable'

export default defineComponent({
    props: useSortableProps,
    emits,
    setup() {
        const vm = getCurrentInstance()
        const { getKey, rootRef } = useSortable(vm)
        return { getKey, rootRef }
    }
})
</script>
