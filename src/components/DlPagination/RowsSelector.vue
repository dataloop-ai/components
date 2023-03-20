<template>
    <div class="dl-pagination--rows_selector">
        <span class="dl-pagination--rows_per_page_label">{{ itemsName }} per page:</span>
        <dl-typography
            v-if="hasSingeValue"
            color="dl-color-darker"
        >
            {{ modelValue }}
        </dl-typography>
        <dl-select
            v-else
            size="s"
            :options="options"
            :disabled="disabled"
            :fit="false"
            width="min-content"
            align-right
            disable-dropdown-icon-padding
            without-borders
            :model-value="modelValue"
            @update:model-value="setSelectedItem"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlSelect } from '../DlSelect'
import DlTypography from '../DlTypography.vue'

export default defineComponent({
    name: 'RowsSelector',
    components: {
        DlSelect,
        DlTypography
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
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
    emits: ['update:modelValue'],
    computed: {
        hasSingeValue() {
            return this.options.length <= 1
        }
    },
    methods: {
        setSelectedItem(val: number) {
            this.$emit('update:modelValue', val)
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination {
    &--rows_selector {
        width: 15%;
        display: flex;
        align-items: center;
        color: var(--dl-color-darker);
        padding-right: 2px;
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
