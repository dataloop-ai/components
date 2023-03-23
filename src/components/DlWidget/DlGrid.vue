<template>
    <!--
    <div
        :style="rowGap"
        class="dl-grid"
    >
        <slot />
    </div>
    -->
    <div
        class="flex"
        :class="[flexDirection]"
    >
        <div v-if="hasRows">
            <div
                v-for="(row, layoutIndex) in layout"
                :key="layoutIndex"
                class="flex flex-row"
            >
                <div
                    v-for="(column, columnIndex) in row"
                    :key="columnIndex"
                    class="flex flex-row"
                >
                    <div>
                        column {{ column }}
                        <slot />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex flex-row">
                flex row
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'

export default defineComponent({
    props: {
        layout: {
            type: Array as PropType<number[] | null>,
            default: null
        },
        gap: {
            type: String,
            default: '30px'
        }
    },
    computed: {
        rowGap(): Record<string, string> {
            return { '--row-gap': this.gap }
        },
        flexDirection() {
            return this.layout?.length ? 'flex-column' : 'flex-row'
        },
        hasRows() {
            return !!this.layout?.length
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-grid {
    display: flex;
    flex-direction: column;
}
</style>
