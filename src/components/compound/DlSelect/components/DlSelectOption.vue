<template>
    <div
        :id="uuid"
        :class="identifierClass"
        style="width: 100%"
    >
        <dl-list-item
            class="option"
            :class="{ highlighted: highlightSelected && isSelected }"
            :with-wave="withWave"
            clickable
            style="width: 100%"
            @click="handleClick"
        >
            <dl-item-section
                :color="color"
                style="width: 100%"
            >
                <span
                    v-if="multiselect"
                    class="multiselect-option"
                    :style="`padding-left: ${depth * 30}px;`"
                >
                    <span v-if="hasChildren">
                        <dl-icon
                            :icon="'icon-dl-right-chevron'"
                            style="margin-right: 10px"
                            class="expand-icon"
                            :class="`${showChildren && 'expanded'}`"
                            @click="chevronClick"
                        />
                    </span>
                    <dl-checkbox
                        :ref="`checkboxRef-${value}`"
                        :class="{ capitalized }"
                        :model-value="modelValue"
                        :value="value"
                        :label="
                            label
                                ? capitalized
                                    ? label.toLowerCase()
                                    : label
                                : null
                        "
                        :indeterminate-value="indeterminateValue"
                        @update:model-value="handleCheckboxUpdate"
                        @checked="handleSingleSelect"
                        @unchecked="handleSingleDeselect"
                    />
                    <span
                        class="multiselect-label"
                        :class="{ capitalized }"
                    >
                        <slot />
                    </span>
                    <span
                        v-if="count"
                        class="counter"
                    > ({{ count }}) </span>
                </span>
                <div
                    v-else
                    :class="{ capitalized }"
                >
                    <slot>
                        {{
                            capitalized ? value.toString().toLowerCase() : value
                        }}
                    </slot>
                </div>
            </dl-item-section>
        </dl-list-item>
        <div v-if="hasChildren && showChildren">
            <div
                v-for="(child, index) in children"
                :key="`${componentId}-${getValue(child)}-${index}`"
            >
                <dl-select-option
                    :multiselect="multiselect"
                    :count="count"
                    clickable
                    :model-value="modelValue"
                    :value="getValue(child)"
                    :children="getChildren(child)"
                    :label="getLabel(child)"
                    :depth="depth + 1"
                    :highlight-selected="highlightSelected"
                    :with-wave="withWave"
                    :capitalized="capitalized"
                    @update:model-value="handleCheckboxUpdate"
                    @selected="handleSingleSelect"
                    @deselected="handleSingleDeselect"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlListItem from '../../../basic/DlListItem/DlListItem.vue'
import { DlIcon, DlCheckbox } from '../../../essential'
import { DlItemSection } from '../../../shared'
import { v4 } from 'uuid'
import { debounce } from 'lodash'

const ValueTypes = [Array, Boolean, String, Number, Object, Function]

export default defineComponent({
    name: 'DlSelectOption',
    components: {
        DlListItem,
        DlItemSection,
        DlCheckbox,
        DlIcon
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        withWave: Boolean,
        defaultStyles: { type: Boolean, default: true },
        multiselect: { type: Boolean, default: false },
        value: { type: ValueTypes, default: null },
        children: { type: Array, default: null },
        highlightSelected: { type: Boolean, default: false },
        count: { type: Number, default: null },
        totalItems: { type: Boolean, default: false },
        modelValue: {
            type: ValueTypes,
            default: [] as any
        },
        depth: { type: Number, default: 0 },
        label: { type: String, default: null },
        capitalized: { type: Boolean, default: false }
    },
    emits: ['update:model-value', 'click', 'selected', 'deselected'],
    data() {
        return {
            showChildren: false,
            componentId: v4(),
            uuid: `dl-select-option-${v4()}`
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-select-option-${this.value}`.replaceAll(' ', '-')
        },
        color(): string | null {
            return this.defaultStyles ? 'dl-color-darker' : null
        },
        isSelected(): boolean {
            return (
                (this.modelValue as any[])?.includes(this.value) ||
                this.modelValue === true
            )
        },
        indeterminateValue(): string | undefined {
            return this.totalItems ? 'indeterminate' : undefined
        },
        handleChildren(): any {
            return debounce(this.toggleChildren.bind(this), 50)
        },
        hasChildren(): boolean {
            return this.children && this.children?.length > 0
        },
        indent(): { padding: string } {
            return { padding: `0 ${this.depth * 30}px 0 0` }
        }
    },
    methods: {
        handleSingleSelect(value?: any) {
            this.$emit('selected', value ?? this.value)
        },
        handleSingleDeselect(value?: any) {
            this.$emit('deselected', value ?? this.value)
        },
        handleCheckboxUpdate(newVal: string[] | boolean, e: Event): void {
            this.$emit('update:model-value', newVal, e)
        },
        handleClick(e: Event) {
            e.stopPropagation()
            e.preventDefault()
            if (this.multiselect) {
                const checkboxRef: any = this.$refs[`checkboxRef-${this.value}`]
                checkboxRef.$refs.container?.click()
            }
            this.$emit('click', e)
        },
        chevronClick(e: Event) {
            e.stopPropagation()
            this.handleChildren(e)
        },
        toggleChildren() {
            this.showChildren = !this.showChildren
        },
        getChildren(option: any) {
            return typeof option === 'object' ? option.children : null
        },
        getLabel(option: any) {
            return typeof option === 'object' ? option.label : null
        },
        getValue(option: any) {
            return typeof option === 'object' ? option.value : null
        }
    }
})
</script>

<style lang="scss" scoped>
.option {
    &::v-deep .container {
        padding: 0 10px 0 0;
    }
}

.highlighted {
    background-color: var(--dl-color-fill);
}

.multiselect-option {
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.multiselect-label {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* max-width: 40%; */
}

.counter {
    color: var(--dl-color-lighter);
    font-size: 10px;
}
.expand-icon {
    display: flex !important;
    justify-content: center !important;
    color: var(--dl-color-medium);
    transition-property: transform, -webkit-transform;
    transition-duration: 0.28s, 0.28s;
    transition-timing-function: ease, ease;
    transition-delay: 0s, 0s;
    &.expanded {
        transform: rotate(90deg);
    }
}
.capitalized {
    text-transform: capitalize !important;
}
</style>
<style lang="scss">
.capitalized .checkbox-label {
    text-transform: capitalize !important;
}
</style>
