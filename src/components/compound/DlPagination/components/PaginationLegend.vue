<template>
    <div class="dl-pagination--legend">
        <span>Showing {{ from }}-{{ to
        }}<span v-if="total"> of {{ total }} {{ itemsName }} </span></span>
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
    }
})
</script>

<style scoped lang="scss">
.dl-pagination--legend {
    justify-content: flex-end;
    display: flex;
    color: var(--dl-color-lighter);
    padding-left: 16px;
    margin-left: auto;
}
</style>
