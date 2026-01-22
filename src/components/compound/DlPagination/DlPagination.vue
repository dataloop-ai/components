<template>
    <div :id="uuid" class="dl-pagination">
        <div class="dl-pagination--container">
            <rows-selector
                v-if="withRowsPerPage && rowsPerPageState"
                v-model="rowsPerPageState"
                class="dl-pagination--sides dl-pagination--sides--left"
                :options="rowsPerPageOptions"
                :items-name="itemsName"
                :disabled="disabled"
            />
            <div
                v-else-if="withLegend"
                class="dl-pagination--sides dl-pagination--sides--left"
            />

            <div
                v-if="rowsPerPageState"
                class="dl-pagination--navigation dl-pagination--navigation-legend"
                :class="
                    withLegend || (withRowsPerPage && rowsPerPageState)
                        ? ''
                        : 'dl-pagination--navigation--maximized'
                "
            >
                <page-navigation
                    :model-value="value"
                    :min="min"
                    :max="max"
                    :max-display-range="maxDisplayRange"
                    :disabled="disabled"
                    :boundary-numbers="boundaryNumbers"
                    :boundary-links="boundaryLinks"
                    :direction-links="directionLinks"
                    :color="color"
                    :active-color="activeColor"
                    :text-color="textColor"
                    :active-text-color="activeTextColor"
                    @update:model-value="setValue"
                />
                <quick-navigation
                    v-if="withQuickNavigation"
                    :model-value="value"
                    :max="max"
                    :min="min"
                    :disabled="disabled"
                    @update:model-value="setValue"
                />
            </div>
            <pagination-legend
                v-if="withLegend"
                :from="rowFrom"
                :to="rowTo"
                :total="totalItems"
                :items-name="itemsName"
                class="dl-pagination--sides dl-pagination--sides--right"
            />
            <div
                v-else-if="withRowsPerPage && rowsPerPageState"
                class="dl-pagination--sides dl-pagination--sides--right"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import RowsSelector from './components/RowsSelector.vue'
import PageNavigation from './components/PageNavigation.vue'
import QuickNavigation from './components/QuickNavigation.vue'
import PaginationLegend from './components/PaginationLegend.vue'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlPagination',
    components: {
        RowsSelector,
        PageNavigation,
        QuickNavigation,
        PaginationLegend
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1
        },
        maxDisplayRange: {
            type: Number,
            default: 7,
            validator: (v: number) => v >= 0
        },
        rowsPerPage: {
            type: Number,
            default: 10
        },
        rowsPerPageOptions: {
            type: Array as PropType<number[]>,
            default: () => [10, 25, 50, 75, 100]
        },
        disabled: Boolean,
        boundaryNumbers: Boolean,
        boundaryLinks: Boolean,
        directionLinks: Boolean,
        color: {
            type: String,
            default: 'dl-color-transparent'
        },
        textColor: {
            type: String,
            default: 'dell-gray-800'
        },
        activeColor: {
            type: String,
            default: 'dell-blue-500'
        },
        activeTextColor: {
            type: String,
            default: 'dell-white'
        },
        totalItems: {
            type: Number,
            required: true
        },
        itemsName: {
            type: String,
            default: 'rows'
        },
        withQuickNavigation: Boolean,
        withRowsPerPage: Boolean,
        withLegend: Boolean
    },
    emits: ['update:model-value', 'update:rowsPerPage'],
    data() {
        return {
            uuid: `dl-pagination-${v4()}`,
            value: this.modelValue,
            rowsPerPageState: this.rowsPerPage
        }
    },
    computed: {
        rowFrom(): number {
            return 1 + this.rowsPerPageState * (this.value - 1)
        },
        rowTo(): number {
            const to = this.rowsPerPageState * this.value

            if (to === 0) {
                return this.totalItems
            }

            return to > this.totalItems ? this.totalItems : to
        },
        max(): number {
            return this.rowsPerPageState === 0 || this.totalItems === 0
                ? 1
                : Math.ceil(this.totalItems / this.rowsPerPageState)
        }
    },
    watch: {
        modelValue(val: number) {
            this.value = this.modelValue
        },
        rowsPerPageState(newVal: number) {
            this.setValue(this.min)
            this.$emit('update:rowsPerPage', newVal)
        },
        rowsPerPage(newVal: number) {
            this.rowsPerPageState = newVal
        }
    },

    methods: {
        setValue(value: number) {
            this.value = value
            this.$emit('update:model-value', value)
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-pagination {
    width: 100%;
    height: 40px;
    font-size: 12px;
    font-weight: 400;

    &--container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &--navigation {
        display: flex;
        flex-grow: 1;
        width: 60%;
        justify-content: center;
        &--maximized {
            width: 100%;
        }
    }

    &--sides {
        width: 20%;
    }
}
</style>
