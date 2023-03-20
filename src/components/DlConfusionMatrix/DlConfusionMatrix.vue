<template>
    <div class="wrapper">
        <div class="vertical_wrapper">
            <div
                :style="matrixStyles"
                class="matrix"
            >
                <div
                    v-for="value in flattenedMatrix"
                    :key="value"
                    class="matrix__cell"
                >
                    {{ value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
export default defineComponent({
    props: {
        labels: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        matrix: {
            type: Array as PropType<number[][]>,
            default: () => []
        }
    },
    computed: {
        flattenedMatrix() {
            return [].concat.apply([], this.matrix)
        },
        matrixStyles() {
            return {
                '--matrix-rows': this.matrix.length,
                '--matrix-columns': this.matrix[0].length
            }
        }
    }
})
</script>

<style lang="scss">
.matrix {
    display: grid;
    grid-template-rows: repeat(var(--matrix-rows), 1fr);
    grid-template-columns: repeat(var(--matrix-columns), 1fr);
}
</style>
