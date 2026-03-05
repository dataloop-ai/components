<template>
    <div class="dl-pagination--rows_selector">
        <span class="dl-pagination--rows_per_page_label"
        >{{ itemsName }} per page:</span
        >
        <dl-typography v-if="hasSingeValue" color="dell-gray-800">
            {{ modelValue }}
        </dl-typography>
        <dl-select
            v-else
            size="s"
            :options="options"
            :disabled="disabled"
            menu-style="min-width: fit-content;"
            align-right
            disable-dropdown-icon-padding
            fit-content
            without-borders
            :model-value="modelValue"
            @update:model-value="setSelectedItem"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlSelect } from '../../DlSelect'
import { DlTypography } from '../../../essential'

export default defineComponent({
    name: 'RowsSelector',
    components: {
        DlSelect,
        DlTypography
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        options: {
            type: Array as PropType<number[]>,
            required: true
        },
        modelValue: {
            type: Number,
            required: true
        },
        itemsName: {
            type: String,
            default: 'rows'
        },
        disabled: Boolean
    },
    emits: ['update:model-value'],
    computed: {
        hasSingeValue(): boolean {
            return this.options.length <= 1
        }
    },
    methods: {
        setSelectedItem(val: number) {
            this.$emit('update:model-value', val)
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination {
    &--rows_selector {
        display: flex;
        align-items: center;
        color: var(--dell-gray-800);
    }

    &--rows_per_page_label {
        white-space: nowrap;
        padding-right: 4px;
        &::first-letter {
            text-transform: uppercase;
        }
    }
}
</style>
