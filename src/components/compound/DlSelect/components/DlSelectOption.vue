<template>
    <div :id="uuid" :class="identifierClass" style="width: 100%">
        <div
            v-if="readonly"
            :class="[{ 'readonly-option': true }, { capitalized }]"
            :style="`padding-left: ${10 + depth * 30}px;`"
        >
            <slot>
                {{ label ? (capitalized ? label.toLowerCase() : label) : null }}
            </slot>
        </div>
        <dl-list-item
            v-else
            class="option"
            :class="{ highlighted: highlightSelected && isSelected }"
            :with-wave="withWave"
            clickable
            style="width: 100%"
            @click="handleClick"
        >
            <dl-item-section :color="color" style="width: 100%">
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
                        :indeterminate-value="indeterminateValue"
                        @update:model-value="handleCheckboxUpdate"
                        @checked="handleSingleSelect"
                        @unchecked="handleSingleDeselect"
                    >
                        <slot>
                            {{
                                capitalized
                                    ? displayLabel.toString().toLowerCase()
                                    : displayLabel
                            }}
                        </slot>
                    </dl-checkbox>
                    <span v-if="count" class="counter"> ({{ count }}) </span>
                </span>
                <div v-else :class="{ capitalized }">
                    <slot>
                        {{
                            capitalized
                                ? displayLabel.toString().toLowerCase()
                                : displayLabel
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
                    :ref="`option-${getValue(child)}`"
                    :multiselect="multiselect"
                    :select-children="selectChildren"
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
                    :readonly="isReadonlyOption(child)"
                    :is-expanded="isExpanded"
                    :filter-term="filterTerm"
                    :fit-content="fitContent"
                    @update:model-value="handleCheckboxUpdate"
                    @selected="handleSingleSelect($event, true)"
                    @deselected="handleSingleDeselect"
                    @depth-change="$emit('depth-change')"
                >
                    <span
                        v-if="fitContent"
                        class="inner-option"
                        v-html="getOptionHtml(child)"
                    />
                    <dl-ellipsis v-else>
                        <span
                            class="inner-option"
                            v-html="getOptionHtml(child)"
                        />
                    </dl-ellipsis>
                </dl-select-option>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlListItem } from '../../../basic'
import { DlIcon, DlCheckbox, DlEllipsis } from '../../../essential'
import { DlItemSection } from '../../../shared'
import { v4 } from 'uuid'
import { debounce } from 'lodash'
import { stateManager } from '../../../../StateManager'
import { getCaseInsensitiveInput, getLabel } from '../utils'
import {
    DlSelectedValueType,
    DlSelectOption,
    DlSelectOptionType
} from '../../types'

const ValueTypes = [Array, Boolean, String, Number, Object, Function]

export default defineComponent({
    name: 'DlSelectOption',
    components: {
        DlListItem,
        DlItemSection,
        DlCheckbox,
        DlIcon,
        DlEllipsis
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        withWave: Boolean,
        // todo: clean this up; rename the prop to something better
        defaultStyles: { type: Boolean, default: true },
        multiselect: { type: Boolean, default: false },
        value: { type: ValueTypes, default: null },
        children: {
            type: Array as PropType<DlSelectedValueType[]>,
            default: null
        },
        highlightSelected: { type: Boolean, default: false },
        count: { type: Number, default: null },
        totalItems: { type: Boolean, default: false },
        modelValue: {
            type: ValueTypes,
            default: [] as any
        },
        depth: { type: Number, default: 0 },
        label: { type: String, default: null },
        capitalized: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        isExpanded: {
            type: Boolean,
            default: false
        },
        filterTerm: {
            type: String,
            default: null
        },
        fitContent: {
            type: Boolean,
            default: false
        },
        selectChildren: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'update:model-value',
        'click',
        'selected',
        'deselected',
        'depth-change'
    ],
    data() {
        return {
            showChildren: this.isExpanded,
            updatingLeaf: false,
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
            if (stateManager.disableDebounce) {
                return this.toggleChildren.bind(this)
            }
            return debounce(this.toggleChildren.bind(this), 50)
        },
        hasChildren(): boolean {
            return this.children && this.children?.length > 0
        },
        indent(): { padding: string } {
            return { padding: `0 ${this.depth * 30}px 0 0` }
        },
        displayLabel(): string {
            return String(this.label ? this.label : this.value)
        }
    },
    methods: {
        getOptionValue(option: any) {
            return option?.value ?? option
        },
        getOptionLabel(option: any) {
            return getLabel(option) ?? this.getOptionValue(option)
        },
        getOptionHtml(option: DlSelectOptionType | DlSelectedValueType) {
            const label = `${this.getOptionLabel(option)}`
            let highlightedHtml = label

            if (this.filterTerm?.length) {
                const toReplace = new RegExp(this.filterTerm, 'gi')

                highlightedHtml = label.replace(
                    toReplace,
                    `<span style="background: var(--dl-color-warning)">${getCaseInsensitiveInput(
                        label,
                        this.filterTerm
                    )}</span>`
                )
            }

            const html = `<span>${highlightedHtml}</span>`

            return html
        },
        getAllChildren(children: any[]) {
            let flattened: any[] = []
            if (!children) return flattened
            for (const child of children) {
                flattened.push(this.getOptionValue(child))
                if (this.getChildren(child)) {
                    flattened = flattened.concat(
                        this.getAllChildren(this.getChildren(child))
                    )
                }
            }
            return flattened
        },
        handleSingleSelect(value?: any, skip?: boolean) {
            this.$emit('selected', value ?? this.value)
            if (skip) {
                return
            }
            if (this.multiselect && this.selectChildren) {
                const hasChildren = !!(
                    this.getOptionByValue(value ?? this.value) as DlSelectOption
                )?.children?.length
                if (hasChildren) {
                    this.updatingLeaf = true
                    this.$nextTick(() => {
                        // select all children rerecursively and update model value
                        const children = this.getAllChildren(
                            this.children ?? []
                        )
                        children.push(value ?? this.value)
                        const newModelValue = Array.from(
                            new Set([
                                ...(this.modelValue as any[]),
                                ...children
                            ] as any)
                        )
                        this.$emit('update:model-value', newModelValue)
                        this.updatingLeaf = false
                    })
                }
            }
        },
        handleSingleDeselect(value?: any, skip?: boolean) {
            this.$emit('deselected', value ?? this.value)
            if (skip) {
                return
            }
            if (this.multiselect && this.selectChildren) {
                const hasChildren = !!(
                    this.getOptionByValue(value ?? this.value) as DlSelectOption
                )?.children?.length
                if (hasChildren) {
                    this.updatingLeaf = true
                    this.$nextTick(() => {
                        // deselect all children recursively and update model value
                        const children = this.getAllChildren(
                            this.children ?? []
                        )
                        children.push(value ?? this.value)
                        const newModelValue = (this.modelValue as any[]).filter(
                            (v) => !children.includes(v)
                        )
                        this.$emit('update:model-value', newModelValue)
                        this.updatingLeaf = false
                    })
                }
            }
        },
        handleCheckboxUpdate(newVal: string[] | boolean, e: Event): void {
            if (!this.updatingLeaf) {
                this.$emit('update:model-value', newVal, e)
            }
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
            this.$emit('depth-change')
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
        },
        getOptionByValue(value: any): DlSelectOptionType {
            if (this.value === value) {
                return this as any as DlSelectOptionType
            }
            if (this.children) {
                const child =
                    this.children.find((child) => {
                        return this.getValue(child) === value
                    }) ?? null

                return child as DlSelectOptionType
            }
        },
        isReadonlyOption(option: any) {
            return !!option?.readonly
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
    transition-property:
        transform,
        -webkit-transform;
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

.capitalized .checkbox-label {
    text-transform: capitalize !important;
}

.readonly-option {
    height: 28px;
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
    color: var(--dl-color-lighter);
}
</style>
