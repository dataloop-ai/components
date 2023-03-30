<template>
    <label
        class="simple-option-group-item"
        @click="emitClick"
    >
        <slot />
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'SimpleWrapper',
    emits: ['click'],
    methods: {
        emitClick(e: Event) {
            this.$emit('click', e)
        }
    }
})
</script>

<style scoped>
.simple-option-group-item {
    white-space: nowrap;
}
</style>
