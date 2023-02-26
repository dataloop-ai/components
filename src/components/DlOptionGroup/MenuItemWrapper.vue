<template>
    <dl-list-item
        as="label"
        clickable
        @click="emitClick"
    >
        <dl-item-section
            class="menu-item-wrapper-section"
            :class="{ 'left-label': leftLabel }"
        >
            <slot />
        </dl-item-section>
    </dl-list-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlListItem } from '../DlListItem'
import DlItemSection from '../DlItemSection.vue'

export default defineComponent({
    name: 'DlMenuItemWrapper',
    components: { DlListItem, DlItemSection },
    props: {
        leftLabel: Boolean
    },
    emits: ['click'],
    methods: {
        emitClick(e: Event) {
            this.$emit('click', e)
        }
    }
})
</script>

<style scoped>
.menu-item-wrapper-section {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
}

.left-label {
    justify-content: space-between;
    flex-direction: row;
}
</style>
