<template>
    <div :id="uuid" :class="identifierClass" style="width: 100%">
        <div
            v-if="readonly"
            :class="[{ 'readonly-option': true }, { capitalized }]"
            :style="`padding-left: ${
                10 + depth * indentation
            }px; width: ${computedWidth};`"
        >
            <dl-tooltip v-if="tooltip">
                {{ tooltip }}
            </dl-tooltip>
            <slot>
                {{ label ? (capitalized ? label.toLowerCase() : label) : null }}
            </slot>
        </div>
        <dl-list-item
            v-else
            class="option"
            :class="{
                highlighted: highlightSelected && isSelected,
                'disabled-row': disableRow
            }"
            :with-wave="withWave"
            :clickable="!disableRow"
            :style="`width: ${computedWidth}`"
            @click="handleClick"
        >
            <dl-item-section :color="color">
                <span
                    v-if="multiselect"
                    class="multiselect-option"
                    :style="`padding-left: ${depth * indentation}px;`"
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
                        :disabled="disableRow"
                        @update:model-value="handleCheckboxUpdate"
                        @checked="handleSingleSelect"
                        @unchecked="handleSingleDeselect"
                    >
                        <dl-tooltip v-if="tooltip">
                            {{ tooltip }}
                        </dl-tooltip>
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
                    <dl-tooltip v-if="tooltip">
                        {{ tooltip }}
                    </dl-tooltip>
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
                    :count="getOptionCount(child)"
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
                    :disable-row="isDisableRowOption(child)"
                    :indentation="indentation"
                    :is-expanded="isExpanded"
                    :filter-term="filterTerm"
                    :fit-content="fitContent"
                    :tooltip="tooltip"
                    :uniform-width="uniformWidth"
                    @update:model-value="handleCheckboxUpdate"
                    @selected="handleSingleSelect($event, true)"
                    @deselected="handleSingleDeselect"
                    @depth-change="$emit('depth-change')"
                >
                    <template #option="scope">
                        <slot name="option" v-bind="scope" />
                    </template>
                    <slot :opt="child" name="option">
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
                    </slot>
                </dl-select-option>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlListItem } from '../../../basic'
import { DlIcon, DlCheckbox, DlEllipsis } from '../../../essential'
import { DlItemSection, DlTooltip } from '../../../shared'
import { v4 } from 'uuid'
import { debounce } from 'lodash'
import { stateManager } from '../../../../StateManager'
import { getCaseInsensitiveInput, getLabel } from '../utils'
import { DlSelectOption, DlSelectOptionType } from '../../types'

const ValueTypes = [Array, Boolean, String, Number, Object, Function]

export default defineComponent({
    name: 'DlSelectOption',
    components: {
        DlListItem,
        DlItemSection,
        DlCheckbox,
        DlIcon,
        DlEllipsis,
        DlTooltip
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
            type: Array as PropType<DlSelectOptionType[]>,
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
        disableRow: { type: Boolean, default: false },
        indentation: { type: Number, default: 30 },
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
        },
        tooltip: { type: String, default: null },
        uniformWidth: { type: String, default: null }
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
            return this.defaultStyles ? 'dell-gray-800' : null
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
        displayLabel(): string {
            return String(this.label ? this.label : this.value)
        },
        computedWidth(): string {
            if (this.uniformWidth) {
                return this.uniformWidth
            }
            return 'max-content; min-width: 100%'
        }
    },
    methods: {
        getOptionValue(option: any) {
            return option?.value ?? option
        },
        getOptionLabel(option: any) {
            return getLabel(option) ?? this.getOptionValue(option)
        },
        getOptionHtml(option: DlSelectOptionType) {
            const label = `${this.getOptionLabel(option)}`
            let highlightedHtml = label

            if (this.filterTerm?.length) {
                const toReplace = new RegExp(this.filterTerm, 'gi')

                highlightedHtml = label.replace(
                    toReplace,
                    `<span style="background: var(--dell-yellow-500)">${getCaseInsensitiveInput(
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
            if (this.disableRow) {
                e.stopPropagation()
                e.preventDefault()
                return
            }
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
        getOptionCount(option: any) {
            return option?.count ?? null
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
        },
        isDisableRowOption(option: DlSelectOptionType) {
            return (
                typeof option === 'object' &&
                option !== null &&
                !!option.disableRow
            )
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

.capitalized .checkbox-label {
    text-transform: capitalize !important;
}

.readonly-option {
    min-height: 28px;
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
    color: var(--dl-color-lighter);
}

.disabled-row {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}
</style>
