<template>
    <div
        :style="gridStyles"
        class="dl-grid-wrapper"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { leastCommonMultiple, getGridTemplate } from './utils'

export default defineComponent({
    props: {
        layout: {
            type: Array as PropType<number[]>,
            default: () => []
        }
    },
    computed: {
        gridStyles() {
            return {
                '--grid-rows': this.layout.length,
                '--grid-columns': leastCommonMultiple(this.layout)
            }
        }
    },
    mounted() {
        this.applyGridElementStyles()
    },
    methods: {
        applyGridElementStyles() {
            getGridTemplate(this.layout)
            const gridElements = Array.from(
                document.getElementsByClassName('widget-wrapper')
            )
            const gridTemplate = getGridTemplate(this.layout)
            if (gridElements.length !== gridTemplate.length) return

            gridElements.forEach((element, index) => {
                (element as HTMLElement).style.gridColumn = gridTemplate[index]
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid-wrapper {
    display: grid;
    grid-template-columns: var(--grid-columns);
    grid-template-rows: var(--grid-rows);
}
</style>
