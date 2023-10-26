<template>
    <div class="dl-pagination--legend">
        {{ paginationContent }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'PaginationLegend',
    props: {
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            default: null
        },
        itemsName: {
            type: String,
            default: 'rows'
        }
    },
    computed: {
        paginationContent(): string {
            return (
                `Showing ${this.from}-${this.to}` +
                (this.total ? ` of ${this.total} ${this.itemsName}` : '')
            )
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination--legend {
    justify-content: flex-end;
    display: flex;
    color: var(--dl-color-lighter);
    height: 100%;
    min-width: min-content;
    overflow-y: scroll;
}
</style>
