<template>
    <div class="dl-pagination--legend">
        {{ paginationContent }}
        <dl-tooltip v-if="longItemsLength">
            {{ fullContent }}
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlTooltip } from '../../../shared'

export default defineComponent({
    name: 'PaginationLegend',
    components: {
        DlTooltip
    },
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
        longItemsLength(): boolean {
            return String(this.total).length > 6
        },
        paginationContent(): string {
            let totalItemsLength = String(this.total)
            if (this.longItemsLength) {
                totalItemsLength = `${totalItemsLength.slice(
                    0,
                    4
                )}...${totalItemsLength.slice(-3)}`
            }

            let toDisplayString = String(this.to)
            if (toDisplayString.length > 3) {
                toDisplayString = `${toDisplayString.slice(
                    0,
                    2
                )}...${toDisplayString.slice(-2)}`
            }

            let fromDisplayString = String(this.from)
            if (fromDisplayString.length > 3) {
                fromDisplayString = `${fromDisplayString.slice(
                    0,
                    2
                )}...${fromDisplayString.slice(-2)}`
            }

            const header = `Showing ${fromDisplayString} - ${toDisplayString}`
            const footer = this.total
                ? `of ${totalItemsLength} ${this.itemsName}`
                : ''

            return `${header} ${footer}`
        },
        fullContent(): string {
            return `Showing ${this.from} - ${this.to} of ${this.total} ${this.itemsName}`
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination--legend {
    justify-content: flex-end;
    display: flex;
    color: var(--dell-gray-500);
    height: 100%;
    min-width: min-content;
    overflow-y: scroll;
    align-items: center;
}
</style>
