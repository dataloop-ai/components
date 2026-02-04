<template>
    <div
        :id="uuid"
        :style="cssVars"
        class="root-container"
        :class="{
            'root-container--s': isSmall,
            [identifierClass]: true,
            'fit-content': fitContent,
            'row-root': !!errorIcon.length
        }"
    >
        <div
            v-if="!!title.length || !!tooltip.length"
            :class="{
                'dl-select__title-container': true,
                'dl-select__title-container--s': isSmall
            }"
        >
            <label v-if="!!title.length" class="dl-select__title">
                {{ title
                }}<span v-if="required" :class="asteriskClasses"> *</span>
                {{ !required && optional ? ' (Optional)' : null }}
            </label>
            <span v-if="!!tooltip.length">
                <dl-icon
                    icon="icon-dl-info"
                    :inline="false"
                    class="tooltip-icon"
                    size="12px"
                />
                <dl-tooltip>
                    {{ tooltip }}
                </dl-tooltip>
            </span>
        </div>
        <div
            v-if="!!topMessage.length && !isSmall"
            class="top-message-container"
        >
            <dl-info-error-message
                v-if="!!topMessage.length"
                position="above"
                :value="topMessage"
            />
        </div>
        <div
            class="select-wrapper"
            :tabindex="removeTabIndex ? undefined : 0"
            :style="placeholderStyles"
            @keydown="handleKeyDown"
        >
            <div ref="select" :class="selectClasses">
                <div
                    v-if="hasPrepend || searchable"
                    :class="[
                        ...adornmentClasses,
                        'adornment-container--pos-left'
                    ]"
                >
                    <slot name="prepend">
                        <dl-icon
                            v-if="searchable"
                            icon="icon-dl-search"
                            :size="iconSize"
                            color="dell-gray-500"
                        />
                    </slot>
                </div>
                <input
                    v-if="searchable"
                    ref="searchInput"
                    class="select-search-input"
                    :style="!isExpanded ? 'display: none;' : 'width: 100%;'"
                    :disabled="disabled"
                    :readonly="readonly"
                    :placeholder="computedPlaceholder"
                    @input="handleSearchInput"
                    @focus="handleSearchFocus"
                    @blur="handleSearchBlur"
                    @keyup.enter="handleSearchEnter"
                    @keyup.esc="handleSearchEscape"
                    @keydown="handleSearchKeyDown"
                />
                <dl-tooltip v-if="disabled && disabledTooltip">
                    {{ disabledTooltip }}
                </dl-tooltip>
                <div v-if="hasSelectedSlot" style="width: 100%">
                    <slot
                        v-if="!isActiveSearchInput"
                        :opt="selectedOption"
                        name="selected"
                    >
                        <span class="root-container--placeholder">
                            <dl-ellipsis :text="filterSelectLabel" />
                        </span>
                    </slot>
                </div>
                <template v-else>
                    <span
                        v-if="multiselect && (!searchable || !isExpanded)"
                        class="root-container--placeholder"
                    >
                        <template v-if="allFiltersModel">
                            <dl-ellipsis :text="computedAllItemsLabel" />
                        </template>
                        <template v-else>
                            <dl-ellipsis :text="filterSelectLabel" />
                        </template>
                    </span>
                    <span
                        v-if="!multiselect && (!searchable || !isExpanded)"
                        class="selected-label"
                    >
                        <dl-ellipsis :text="getLabel(selectedOption)" />
                    </span>
                </template>
                <div
                    :class="[
                        ...adornmentClasses,
                        `adornment-container--pos-right${
                            withoutDropdownIconPadding
                                ? ' adornment-container--pos-right-without_padding'
                                : ''
                        }`
                    ]"
                >
                    <dl-icon
                        v-if="clearable && hasSelection"
                        class=".dl-select__clear-button"
                        icon="icon-dl-close"
                        :size="withoutBorders ? '10px' : '16px'"
                        style="margin-right: 3px; cursor: pointer"
                        @click.prevent.stop="clearSelection"
                    />
                    <dl-icon
                        v-if="!hideChevron"
                        :icon="dropdownIcon"
                        :color="chevronIconColor"
                        class="expand-icon"
                        :inline="false"
                        :size="withoutBorders ? '12px' : '16px'"
                        :class="{ expanded: isExpanded }"
                    />
                </div>
            </div>
            <dl-menu
                v-if="!noOptions || !hideEmptyMenu"
                ref="menu"
                v-model="isExpanded"
                fit-container
                :fit-content="fitContent"
                square
                no-focus
                :offset="[0, 3]"
                style="border-radius: 0"
                :style="computedMenuStyle"
                :menu-class="menuClass"
                :disabled="disabled || readonly"
                :arrow-nav-items="options"
                :max-height="dropdownMaxHeight"
                :trigger-percentage="triggerPercentage"
                @show="onMenuOpen"
                @hide="closeMenu"
                @highlighted-item="setHighlightedIndex"
                @selected-item="handleSelectedItem"
            >
                <dl-list-item v-if="hasBeforeOptions && !noOptions">
                    <dl-item-section color="dell-gray-600">
                        <slot name="before-options" />
                    </dl-item-section>
                </dl-list-item>
                <dl-list-item
                    v-if="noOptions"
                    :style="computedNoOptionsStyle"
                    :padding="noOptionsPadding"
                >
                    <dl-item-section color="dell-gray-600">
                        <slot name="no-options"> No options </slot>
                    </dl-item-section>
                </dl-list-item>
                <dl-list
                    v-else-if="showMenuList"
                    class="select-list"
                    :padding="false"
                    :style="
                        optionsCount > MAX_ITEMS_PER_LIST
                            ? ''
                            : `width: 100%; max-height: calc(${calculatedDropdownMaxHeight} - 20px); overflow-y: auto;`
                    "
                >
                    <dl-select-option
                        v-if="showAllItems"
                        :multiselect="multiselect"
                        :select-children="selectChildren"
                        :with-wave="withWave"
                        clickable
                        :model-value="allFiltersModel"
                        :count="totalCount"
                        :highlight-selected="highlightSelected"
                        :filter-term="searchTerm"
                        :fit-content="fitContent"
                        :uniform-width="uniformWidth"
                        total-items
                        @update:model-value="selectAll"
                        @depth-change="handleDepthChange"
                    >
                        <slot name="all-items">
                            {{ computedAllItemsLabel }}
                        </slot>
                    </dl-select-option>

                    <!-- Virtual scroll -->
                    <dl-virtual-scroll
                        v-if="optionsCount > MAX_ITEMS_PER_LIST"
                        v-slot="{ item, index }"
                        :items="filteredOptions"
                        :virtual-scroll-item-size="28"
                        :virtual-scroll-sticky-size-start="28"
                        :virtual-scroll-sticky-size-end="20"
                        :style="`width: 100%; max-height: calc(${calculatedDropdownMaxHeight} - 20px);`"
                    >
                        <dl-select-option
                            :key="getKeyForOption(item)"
                            clickable
                            :multiselect="multiselect"
                            :class="{
                                selected:
                                    item === selectedOption && highlightSelected
                            }"
                            :style="
                                index === highlightedIndex
                                    ? 'background-color: var(--dl-color-fill)'
                                    : ''
                            "
                            :fit-content="fitContent"
                            :filter-term="searchTerm"
                            :with-wave="withWave"
                            :model-value="modelValue"
                            :value="getOptionValue(item)"
                            :highlight-selected="highlightSelected"
                            :count="getOptionCount(item)"
                            :children="getOptionChildren(item)"
                            :capitalized="capitalizedOptions"
                            :readonly="isReadonlyOption(item)"
                            :disable-row="isDisableRowOption(item)"
                            :indentation="indentation"
                            :is-expanded="item.expanded"
                            :tooltip="getOptionTooltip(item)"
                            :uniform-width="uniformWidth"
                            @update:model-value="handleModelValueUpdate"
                            @click="selectOption(item)"
                            @selected="handleSelected"
                            @deselected="handleDeselected"
                        >
                            <slot name="option" :opt="item">
                                <span
                                    v-if="fitContent"
                                    class="inner-option"
                                    v-html="getOptionHtml(item)"
                                />
                                <dl-ellipsis v-else>
                                    <span
                                        class="inner-option"
                                        v-html="getOptionHtml(item)"
                                    />
                                </dl-ellipsis>
                            </slot>
                        </dl-select-option>
                    </dl-virtual-scroll>
                    <!-- Else normal list -->
                    <div v-else>
                        <dl-select-option
                            v-for="(option, optionIndex) in filteredOptions"
                            :key="getKeyForOption(option)"
                            clickable
                            :multiselect="multiselect"
                            :select-children="selectChildren"
                            :class="{
                                selected:
                                    option === selectedOption &&
                                    highlightSelected
                            }"
                            :style="
                                optionIndex === highlightedIndex
                                    ? 'background-color: var(--dl-color-fill)'
                                    : ''
                            "
                            :fit-content="fitContent"
                            :filter-term="searchTerm"
                            :with-wave="withWave"
                            :model-value="modelValue"
                            :value="getOptionValue(option)"
                            :highlight-selected="highlightSelected"
                            :count="getOptionCount(option)"
                            :children="getOptionChildren(option)"
                            :capitalized="capitalizedOptions"
                            :readonly="isReadonlyOption(option)"
                            :disable-row="isDisableRowOption(option)"
                            :indentation="indentation"
                            :is-expanded="isExpandedOption(option)"
                            :tooltip="getOptionTooltip(option)"
                            :uniform-width="uniformWidth"
                            @update:model-value="handleModelValueUpdate"
                            @click="selectOption(option)"
                            @selected="handleSelected"
                            @deselected="handleDeselected"
                            @depth-change="handleDepthChange"
                        >
                            <template #option="scope">
                                <slot name="option" v-bind="scope" />
                            </template>
                            <slot :opt="option" name="option">
                                <span
                                    v-if="fitContent"
                                    class="inner-option"
                                    v-html="getOptionHtml(option)"
                                />
                                <dl-ellipsis v-else>
                                    <span
                                        class="inner-option"
                                        v-html="getOptionHtml(option)"
                                    />
                                </dl-ellipsis>
                            </slot>
                        </dl-select-option>
                    </div>
                </dl-list>
                <dl-list-item
                    v-if="hasAfterOptions && !noOptions"
                    :padding="afterOptionsPadding"
                >
                    <dl-item-section>
                        <slot name="after-options" />
                    </dl-item-section>
                </dl-list-item>
            </dl-menu>
        </div>
        <div
            v-if="!isSmall && (!!infoMessage.length || !!errorMessage.length)"
            class="bottom-message-container"
        >
            <span v-if="!!errorIcon.length">
                <dl-icon
                    v-if="!!infoMessage.length && !error"
                    icon="icon-dl-info"
                    :inline="false"
                    :size="iconSize"
                >
                    <dl-tooltip>
                        {{ infoMessage }}
                    </dl-tooltip>
                </dl-icon>
                <dl-icon
                    v-if="error && !!errorMessage.length"
                    :icon="errorIcon"
                    :inline="false"
                    color="dell-red-500"
                    :size="iconSize"
                >
                    <dl-tooltip>
                        {{ errorMessage }}
                    </dl-tooltip>
                </dl-icon>
            </span>
            <span v-else>
                <dl-info-error-message
                    v-if="!!infoMessage.length && !error"
                    position="below"
                    :value="infoMessage"
                />
                <dl-info-error-message
                    v-if="error && !!errorMessage.length"
                    position="below"
                    error
                    :value="errorMessage"
                />
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { InputSizes, TInputSizes } from '../../../utils/input-sizes'
import { DlListItem } from '../../basic'
import { DlTooltip } from '../../shared'
import { DlList, DlIcon, DlMenu } from '../../essential'
import {
    DlInfoErrorMessage,
    DlItemSection,
    DlVirtualScroll
} from '../../shared'
import { DlEllipsis } from '../../essential'
import { defineComponent, PropType, ref } from 'vue-demi'
import {
    getLabel,
    getIconSize,
    optionsValidator,
    getLabelOfSelectedOption,
    getCaseInsensitiveInput
} from './utils'
import {
    DlSelectOption as DlSelectOptionEntry,
    DlSelectOptionType
} from '../types'
import DlSelectOption from './components/DlSelectOption.vue'
import { cloneDeep, isEqual } from 'lodash'
import { getColor } from '../../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DlIcon,
        DlInfoErrorMessage,
        DlList,
        DlItemSection,
        DlListItem,
        DlMenu,
        DlTooltip,
        DlSelectOption,
        DlVirtualScroll,
        DlEllipsis
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: { type: [String, Object, Array, Number], default: '' },
        size: {
            type: String as PropType<TInputSizes>,
            default: InputSizes.l
        },
        withWave: Boolean,
        alignRight: { type: Boolean, default: false },
        allItemsOption: { type: Boolean, default: false },
        allItemsOptionLabel: { type: String, default: null },
        placeholder: { type: String, default: null },
        removableSelection: { type: Boolean, default: false },
        width: { type: String, default: '100%' },
        withoutBorders: { type: Boolean, default: false },
        title: { type: String, default: '' },
        searchable: { type: Boolean, default: false },
        customFilter: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        optional: { type: Boolean, default: false },
        fitContent: Boolean,
        tooltip: { type: String, default: '' },
        highlightSelected: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        multiselect: { type: Boolean, default: false },
        dropdownIcon: { type: String, default: 'icon-dl-down-chevron' },
        indentation: { type: Number, default: 30 },
        topMessage: { type: String, default: '' },
        redAsterisk: { type: Boolean, default: false },
        infoMessage: { type: String, default: '' },
        errorMessage: { type: String, default: '' },
        error: { type: Boolean, default: false },
        errorIcon: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        emitValue: { type: Boolean, default: false }, // We emit the value from the option and compare with it as a modelvalue
        options: {
            type: Array as PropType<DlSelectOptionType[]>,
            default: (): DlSelectOptionType[] => [],
            validator: optionsValidator
        },
        capitalizedOptions: { type: Boolean, default: false },
        withoutDropdownIconPadding: { type: Boolean, default: false },
        clearable: { type: Boolean, default: false },
        dropdownMaxHeight: { type: String, default: '30vh' },
        preserveSearch: { type: Boolean, default: false },
        disabledTooltip: { type: String, default: 'Disabled' },
        /**
         * the % of the select element to display the menu
         */
        triggerPercentage: {
            type: Number,
            default: 1
        },
        menuStyle: {
            type: String,
            default: null
        },
        menuClass: {
            type: String,
            default: null
        },
        /**
         * when multiselect is true, this will select all children of the selected option
         */
        selectChildren: {
            type: Boolean,
            default: true
        },
        /**
         * the label to show when items are selected
         */
        selectedResourceLabel: {
            type: String,
            default: 'Selected Items'
        },
        hideChevron: {
            type: Boolean,
            default: false
        },
        disableSearchHighlighting: {
            type: Boolean,
            default: false
        },
        /**
         * shows search results only when there is some user input
         */
        openMenuDuringSearch: {
            type: Boolean,
            default: false
        },
        afterOptionsPadding: {
            type: String,
            default: null
        },
        noOptionsPadding: {
            type: String,
            default: null
        },
        keepFocusOnBlur: {
            type: Boolean,
            default: false
        },
        hideEmptyMenu: {
            type: Boolean,
            default: false
        },
        removeTabIndex: {
            type: Boolean,
            default: false
        },
        isAllOptionsSelected: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'search-focus',
        'search-blur',
        'search-enter',
        'search-escape',
        'search-keydown',
        'filter',
        'change',
        'search-input',
        'update:model-value',
        'before-show',
        'before-hide',
        'show',
        'hide',
        'selected',
        'deselected'
    ],
    setup(props, { emit, slots }) {
        const isExpanded = ref(false)
        const selectedIndex = ref(-1)
        const highlightedIndex = ref(-1)
        const isEmpty = ref(true)
        const searchTerm = ref('')
        const searchInputValue = ref('')
        const MAX_ITEMS_PER_LIST = 100 // HARDCODED - max items per list before virtual scroll
        const initialMenuWidth = ref(0)

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value
        }
        const handleModelValueUpdate = (val: any) => {
            emit('update:model-value', val)
            emit('selected', val)
            emit('change', val)
        }

        const hasSlotByName = (name: string) => !!slots[name]
        const hasSlotContent = (name: string) => {
            const slot = slots[name]
            if (slot) {
                const newSlot = typeof slot === 'function' ? slot() : slot
                return newSlot?.length > 0
            }
            return false
        }

        return {
            uuid: `dl-select-${v4()}`,
            MAX_ITEMS_PER_LIST,
            isEmpty,
            isExpanded,
            highlightedIndex,
            selectedIndex,
            setHighlightedIndex,
            handleModelValueUpdate,
            searchTerm, // todo: merge this sometime
            searchInputValue,
            hasSlotByName,
            hasSlotContent,
            initialMenuWidth
        }
    },
    computed: {
        hasSelection(): boolean {
            return !!this.modelValueLength || this.selectedIndex !== -1
        },
        filteredOptions(): DlSelectOptionType[] {
            if (this.customFilter || this.searchTerm === '') {
                return this.options
            }
            const labelIncluded = (
                options: DlSelectOptionType[],
                term: string
            ): DlSelectOptionType[] => {
                const filteredNodes: DlSelectOptionType[] = []

                for (const op of options) {
                    const queue: DlSelectOptionType[] = [op]
                    const filteredRoots: DlSelectOptionType[] = []
                    while (queue.length) {
                        const node = queue.shift()
                        let shouldPush = false
                        if ((node as DlSelectOptionEntry)?.children?.length) {
                            const filteredChildren: DlSelectOptionType[] =
                                labelIncluded(
                                    (node as DlSelectOptionEntry).children,
                                    term
                                )
                            if (filteredChildren.length) {
                                // @ts-ignore
                                node.children = filteredChildren
                                shouldPush = true
                            }
                        }

                        const label = getLabel(node)

                        if (
                            shouldPush ||
                            (label &&
                                label
                                    .toLowerCase()
                                    .includes(term.toLowerCase().trim()))
                        ) {
                            filteredRoots.push(node)
                        }
                    }
                    for (const root of filteredRoots) {
                        filteredNodes.push(root)
                    }
                }

                return filteredNodes
            }

            return labelIncluded(cloneDeep(this.options), this.searchTerm)
        },
        calculatedDropdownMaxHeight(): string {
            const knownValuePhrases = ['vh', 'px', 'vw', 'em', 'rem', '%']
            let val = this.dropdownMaxHeight

            for (const phrase of knownValuePhrases) {
                if (val.includes(phrase)) {
                    val = val.replace(phrase, '')
                    let value = parseInt(val)
                    if (this.hasAfterOptions) {
                        value -= 5
                    }
                    if (this.hasBeforeOptions) {
                        value -= 5
                    }
                    return String(value + phrase)
                }
            }

            // :shrug: if it's not a known value, just return it
            return `calc(${this.dropdownMaxHeight} - 20px)`
        },
        computedMenuStyle(): string {
            let style = this.menuStyle ?? ''
            if (this.optionsCount > this.MAX_ITEMS_PER_LIST) {
                style += '; overflow-y: hidden'
            }
            if (!this.showMenuList) {
                style += '; border: none;'
            }
            return style
        },
        computedNoOptionsStyle(): string {
            return `min-width: ${this.initialMenuWidth}px`
        },
        optionsCount(): number {
            return this.options?.length ?? 0
        },
        maxDepth(): number {
            const hasChildren = (option: DlSelectOptionType) =>
                typeof option === 'object' && option?.children?.length > 0

            const getMaxDepth = (
                options: DlSelectOptionType[],
                depth: number = 0
            ): number => {
                let max = depth
                for (const option of options) {
                    if (hasChildren(option)) {
                        const childDepth = getMaxDepth(
                            (option as any).children,
                            depth + 1
                        )
                        if (childDepth > max) {
                            max = childDepth
                        }
                    }
                }
                return max
            }
            return getMaxDepth(this.options)
        },
        uniformWidth(): string {
            return this.maxDepth === 0
                ? '100%'
                : `calc(100% + ${(this.maxDepth - 1) * this.indentation}px)`
        },
        identifierClass(): string {
            return `dl-select-${this.title}-${
                this.placeholder ?? ''
            }`.replaceAll(' ', '-')
        },
        showAllItems: {
            get(): boolean {
                return this.multiselect && this.allItemsOption && this.isEmpty
            },
            set(val: boolean) {
                this.isEmpty = val
            }
        },
        modelValueLength(): number {
            if (
                typeof this.modelValue !== 'string' &&
                !Array.isArray(this.modelValue)
            ) {
                return 0
            }
            return this.modelValue?.length ?? 0
        },
        allFiltersModel(): boolean {
            if (Array.isArray(this.modelValue)) {
                const options = this.options.some((opt) =>
                    this.getOptionChildren(opt)
                )
                return (
                    this.modelValue?.length === this.options.length && !options
                )
            }
            return false
        },
        filterSelectLabel(): string {
            if (this.isAllOptionsSelected) {
                return this.computedAllItemsLabel
            }

            if (this.modelValueLength === 1) {
                const valueToSearch = (this.modelValue as any)[0]
                return getLabelOfSelectedOption(valueToSearch, this.options)
            }
            return this.modelValueLength > 0
                ? `${this.modelValueLength} ${this.selectedResourceLabel}`
                : String(this.computedPlaceholder)
        },
        computedAllItemsLabel(): string {
            return String(this.allItemsOptionLabel ?? 'All Items')
        },
        isModelValuePrimitiveType(): boolean {
            return this.isPrimitiveValue(this.modelValue)
        },
        totalCount(): number {
            let total = 0
            if (typeof this.options[0] !== 'string') {
                this.options.forEach((option: any) => {
                    if (typeof option === 'object' && option!.count) {
                        total += option!.count as number
                    }
                })
            }

            return total
        },
        iconSize(): string {
            return getIconSize(this.size)
        },
        hasOptionSlot(): boolean {
            return !!this.hasSlotByName('option')
        },
        hasAllItemsSlot(): boolean {
            return !!this.hasSlotByName('all-items')
        },
        hasSelectedSlot(): boolean {
            return !!this.hasSlotByName('selected')
        },
        hasSelectedSlotContent(): boolean {
            return this.hasSlotContent('selected')
        },
        isActiveSearchInput(): boolean {
            return this.searchable && this.isExpanded
        },
        computedPlaceholder(): string {
            return String(this.placeholder ?? 'Select option')
        },
        placeholderStyles(): Record<string, string> {
            if (this.disabled) {
                return
            }
            return {
                '--placeholder-color': getColor(
                    this.modelValueLength > 0 || this.selectedIndex !== -1
                        ? 'dell-gray-800'
                        : 'dell-gray-500'
                )
            }
        },
        selectedOption(): DlSelectOptionType {
            if (this.multiselect) {
                if (this.modelValueLength === 1) {
                    return this.options.find((option: any) => {
                        return isEqual(
                            option.value,
                            Array.isArray(this.modelValue)
                                ? this.modelValue[0]
                                : this.modelValue
                        )
                    })
                } else {
                    return {
                        label: this.filterSelectLabel,
                        value: this.modelValue,
                        readonly: true
                    }
                }
            }

            if (this.selectedIndex === -1) {
                return {
                    label: this.computedPlaceholder,
                    value: null,
                    readonly: true
                }
            }

            return this.options[this.selectedIndex]
        },
        hasBeforeOptions(): boolean {
            return !!this.$slots['before-options']
        },
        hasAfterOptions(): boolean {
            return !!this.$slots['after-options']
        },
        noOptions(): boolean {
            if (Array.isArray(this.options)) {
                if (this.customFilter) {
                    return this.options.length === 0
                }

                return this.filteredOptions.length === 0
            }
            return true
        },
        selectClasses(): string[] {
            const classes = ['dl_select__select']

            classes.push(`dl_select__select--${this.size}`)
            classes.push('dl_select__select--append')

            if (this.withoutDropdownIconPadding) {
                classes.push('dl_select__select--append-without_padding')
            }
            if (this.selectedIndex !== -1) {
                classes.push('dl_select__select--has-selection')
            }
            if (this.alignRight) {
                classes.push('dl_select__select--align-right')
            }
            if (this.withoutBorders) {
                classes.push('dl_select__select--without-border')
            }
            if (this.withoutBorders && this.hasPrepend) {
                classes.push('dl_select__select--without-border__with-prepend')
            }
            if (this.hasPrepend || this.searchable) {
                classes.push('dl_select__select--prepend')
                classes.push('dl_select__select--both-adornments')
            }
            if (this.error) {
                classes.push('dl_select__select--error')
            }
            if (this.disabled) {
                classes.push('dl_select__select--disabled')
            }
            if (this.readonly) {
                classes.push('dl_select__select--readonly')
            }
            if (this.isExpanded) {
                classes.push('dl_select__select--focused')
            }

            return classes
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-select-width': this.width,
                '--dl-select-expand-icon-width': this.withoutDropdownIconPadding
                    ? '16px'
                    : '28px',
                '--dl-menu-scrollbar-width': '10px'
            }
        },
        asteriskClasses(): string[] {
            const classes = ['required-asterisk']
            if (this.redAsterisk) {
                classes.push('required-asterisk--red')
            }
            return classes
        },
        adornmentClasses(): string[] {
            const classes = ['adornment-container']
            classes.push(`adornment-container--${this.size}`)
            return classes
        },
        isSmall(): boolean {
            return (
                this.size === (InputSizes.s as TInputSizes) ||
                this.size === (InputSizes.small as TInputSizes)
            )
        },
        hasPrepend(): boolean {
            return !!this.$slots.prepend && !this.isSmall
        },
        chevronIconColor(): string {
            return `${this.disabled ? 'dell-gray-500' : null}`
        },
        showMenuList(): boolean {
            if (
                this.openMenuDuringSearch &&
                this.searchable &&
                this.searchInputValue.length === 0
            ) {
                return false
            }
            return true
        }
    },
    watch: {
        isExpanded(newVal: boolean) {
            if (this.searchable) {
                if (newVal) {
                    const inputRef = this.$refs.searchInput as HTMLInputElement
                    this.$nextTick(() => {
                        inputRef?.focus({})
                        setTimeout(() => {
                            const menuRef = this.$refs.menu as {
                                innerRef?: HTMLElement
                            }
                            this.initialMenuWidth =
                                menuRef?.innerRef?.clientWidth ?? 0
                        }, 100)
                    })
                }
            }
        },
        modelValue() {
            this.setSelectedIndex()
        },
        emitValue() {
            this.setSelectedIndex()
        },
        options() {
            this.setSelectedIndex()
        }
    },
    beforeMount() {
        this.setSelectedIndex()
    },
    methods: {
        isExpandedOption(option: DlSelectOptionType): boolean {
            if (typeof option === 'string') {
                return false
            }
            if (typeof option === 'number') {
                return false
            }
            return !!option?.expanded
        },
        handleDepthChange() {
            // todo: remove this hack
            setTimeout(() => {
                this.$nextTick(() => {
                    // @ts-ignore
                    this.$refs.menu?.updatePosition()
                })
            }, 100)
        },
        isPrimitiveValue(option: any): boolean {
            return (
                typeof option === 'string' ||
                typeof option === 'number' ||
                typeof option === 'boolean'
            )
        },
        setSelectedIndex() {
            if (!this.modelValue) {
                this.selectedIndex = -1
                return
            }

            if (this.emitValue) {
                this.selectedIndex = this.options.findIndex(
                    (option: DlSelectOptionType) =>
                        isEqual(
                            (option as any).value,
                            this.modelValue as string | number
                        )
                )
                return
            }

            if (this.isModelValuePrimitiveType) {
                this.selectedIndex = this.options.findIndex(
                    (option: DlSelectOptionType) => option === this.modelValue
                )
                return
            }

            this.selectedIndex = this.options.findIndex(
                (option: DlSelectOptionType) => isEqual(option, this.modelValue)
            )
        },
        handleSelectedItem(value: DlSelectOptionType) {
            this.selectOption(value)
        },
        getOptionValue(option: any) {
            return option?.value ?? option
        },
        getOptionLabel(option: any) {
            return getLabel(option) ?? this.getOptionValue(option)
        },
        getOptionChildren(option: any) {
            if (typeof option === 'string') {
                return null
            }
            return option?.children && option?.children?.length
                ? option?.children
                : null
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
        },
        getOptionCount(option: any) {
            return option?.count ?? null
        },
        getOptionTooltip(option: DlSelectOptionType): string | null {
            if (typeof option === 'object' && option?.tooltip) {
                return option.tooltip
            }
            return null
        },
        getKeyForOption(
            option:
                | string
                | number
                | Record<string, string | number>
                | DlSelectOptionType
        ) {
            if (typeof option === 'string' || typeof option === 'number') {
                return option
            }
            return option.key ?? option.label
        },
        handleMenuTrigger(val: boolean) {
            this.isExpanded = val
        },
        selectAll(val: string[] | boolean, e: Event): void {
            e.preventDefault()
            e.stopPropagation()
            let toEmit: string[] = []
            if (
                !['string', 'number'].includes(typeof this.options[0]) &&
                !this.isModelValuePrimitiveType &&
                (this.modelValue as any)?.length < this.options.length
            ) {
                toEmit = this.options.map((option: any) => option!.value)
            }
            this.$emit('update:model-value', toEmit)
            this.$emit('change', toEmit)
        },
        clearSelection(): void {
            let toEmit: any[] | string = []
            if (this.isModelValuePrimitiveType) {
                toEmit = ''
            }

            this.$emit('update:model-value', toEmit)
            this.$emit('change', toEmit)
            this.selectedIndex = -1
            this.closeMenu()
        },
        selectOption(selectedOption: DlSelectOptionType) {
            if (this.multiselect || this.isReadonlyOption(selectedOption)) {
                return
            }

            if (this.searchable) {
                const searchInput = this.$refs.searchInput as HTMLInputElement
                searchInput.value =
                    typeof selectedOption === 'string'
                        ? selectedOption
                        : (selectedOption as Record<string, any>)?.label
            }
            this.closeMenu()

            const valueToEmit =
                this.emitValue && !this.isPrimitiveValue(selectedOption)
                    ? (selectedOption as Record<string, any>)?.value
                    : selectedOption

            this.handleModelValueUpdate(valueToEmit)
        },
        handleSearchInput(e: Event): void {
            if (this.searchable) {
                if (this.customFilter) {
                    this.$emit(
                        'filter',
                        (e.target as HTMLInputElement).value.trim()
                    )
                } else {
                    this.searchTerm = (
                        e.target as HTMLInputElement
                    ).value.trim()
                }

                this.showAllItems =
                    (e.target as HTMLInputElement).value.trim() === ''

                this.$nextTick(() => {
                    const menu = this.$refs.menu as any
                    menu?.updatePosition()
                })
            }
            const searchValue = (e.target as HTMLInputElement).value
            this.searchInputValue = searchValue
            this.$emit('search-input', searchValue)
        },
        getOptionHtml(option: DlSelectOptionType) {
            const label = `${this.getOptionLabel(option)}`
            let highlightedHtml = label

            if (
                this.searchInputValue?.length &&
                !this.disableSearchHighlighting
            ) {
                const toReplace = new RegExp(this.searchInputValue, 'gi')

                highlightedHtml = label.replace(
                    toReplace,
                    `<span style="background: var(--dl-color-warning)">${getCaseInsensitiveInput(
                        label,
                        this.searchInputValue
                    )}</span>`
                )
            }

            const html = `<span>${highlightedHtml}</span>`

            return html
        },
        handleSearchEnter(e: Event): void {
            if (this.searchable) {
                this.$emit('search-enter', e, this.searchInputValue)
            }
        },
        handleSearchKeyDown(e: KeyboardEvent): void {
            if (this.searchable) {
                this.$emit('search-keydown', e)
            }
        },
        handleSearchEscape(e: Event): void {
            if (this.searchable) {
                this.$emit('search-escape', e, this.searchInputValue)
            }
        },
        handleSearchBlur(e: Event): void {
            if (!this.searchable) return

            const focusEvent = e as FocusEvent
            const shouldKeepFocus =
                this.keepFocusOnBlur && !focusEvent.relatedTarget

            this.$nextTick(() => {
                const inputRef = this.$refs.searchInput as HTMLInputElement
                inputRef?.focus({})
            })

            if (!shouldKeepFocus) {
                this.$emit('search-blur', e)
            }
        },
        closeMenu(): void {
            this.$emit('before-hide')
            this.isExpanded = false
            this.$emit('hide')

            if (!this.preserveSearch) {
                const inputRef = this.$refs.searchInput as HTMLInputElement
                if (inputRef) inputRef.value = ''
                this.searchTerm = ''
                this.searchInputValue = ''
                this.$emit('filter', '')
            }
        },
        getLabel,
        onMenuOpen(): void {
            this.$emit('before-show')
            if (this.searchable) {
                const inputRef = this.$refs.searchInput as HTMLInputElement
                this.$nextTick(() => {
                    inputRef?.focus({})
                })
            }
            this.$emit('show')
        },
        handleSearchFocus(e: FocusEvent): void {
            this.$emit('search-focus', e)
        },
        onBlur(e: InputEvent): void {
            this.$emit('search-blur', e)
        },
        handleSelected(value: any) {
            this.$emit('selected', value)
        },
        handleDeselected(value: any) {
            this.$emit('deselected', value)
        },
        handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Enter' && this.isExpanded) {
                event.preventDefault()
                event.stopPropagation()

                if (
                    this.highlightedIndex !== -1 &&
                    this.filteredOptions.length > this.highlightedIndex
                ) {
                    const selectedItem =
                        this.filteredOptions[this.highlightedIndex]
                    if (selectedItem) {
                        this.selectOption(selectedItem)
                        this.closeMenu()
                    }
                }
            }
        }
    }
})
</script>

<style scoped lang="scss">
.root-container {
    width: var(--dl-select-width);
    &--s,
    &--small {
        display: flex;
        align-items: center;
    }
    &--placeholder {
        color: var(--dl-select-placeholder-color, var(--placeholder-color));
        width: 100%;
    }

    .dl-select__title-container {
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        color: var(--dl-color-lighter);

        &--s,
        &--small {
            margin-bottom: 0;
            margin-right: 4px;
        }
    }

    .selected-label {
        color: var(--dl-select-placeholder-color, var(--placeholder-color));
        width: fit-content;
        max-width: 100%;
    }

    .dl-select__title {
        color: var(--dl-color-medium);
        font-size: 12px;
        text-align: left;
        margin-right: 5px;
        white-space: nowrap;
    }

    .required-asterisk {
        color: var(--dl-color-medium);
        font-size: 12px;
        user-select: none;

        &--red {
            color: var(--dl-color-negative);
        }
    }

    .tooltip-icon {
        color: var(--dl-color-medium);
    }

    .top-message-container {
        display: flex;
        margin-bottom: 10px;
        text-align: start;
    }

    .select-wrapper {
        position: relative;
        width: 100%;
    }

    .dl_select__select {
        border: 1px solid var(--dell-gray-500);
        border-radius: 0px;
        cursor: pointer;
        color: var(--dell-gray-800);
        height: 12px;
        width: 100%;
        box-sizing: content-box;
        padding: 10px;
        outline: none;
        background: none;
        font-size: 12px;
        position: relative;
        display: flex;
        align-items: center;
        transition-property: border-color;
        transition-duration: 0.28s, 0.28s;
        transition-timing-function: ease, ease;
        transition-delay: 0s, 0s;

        &--align-right {
            justify-content: flex-end;
        }

        &--prepend {
            padding-left: 28px;
            width: calc(100% - 10px - 28px);
        }

        &--append {
            padding-right: var(--dl-select-expand-icon-width);
            width: calc(100% - 10px - var(--dl-select-expand-icon-width));
        }

        &--both-adornments {
            width: calc(100% - 28px - 28px);
        }

        &--m {
            padding-top: 7px;
            padding-bottom: 7px;
        }
        &--medium {
            padding-top: 7px;
            padding-bottom: 7px;
        }

        &--s {
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 5px;
            padding-right: 5px;
            width: calc(100% - 10px);
        }
        &--small {
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 5px;
            padding-right: 5px;
            width: calc(100% - 10px);
        }

        &--has-selection {
            color: var(--dl-color-medium);
        }

        &--error {
            border-color: var(--dl-color-negative);
        }
        &--without-border {
            border: none;
            width: calc(100% - var(--dl-select-expand-icon-width));
            padding: 0;
            padding-right: var(--dl-select-expand-icon-width);
            height: auto;
            .adornment-container {
                height: 100%;
            }

            &__with-prepend {
                padding-left: 30px;
                padding-top: 10px;
                padding-bottom: 10px;
                width: calc(80% - var(--dl-select-expand-icon-width));
            }
        }

        & input::placeholder {
            color: var(--placeholder-color);
            opacity: 1;
        }

        &:hover {
            border-color: var(--dell-gray-800);
        }

        &--focused {
            border-color: var(--dell-blue-500) !important;

            ::v-deep .dl-icon {
                color: var(--dell-blue-500);
            }
        }

        &--disabled {
            border-color: var(--dl-color-separator);
            color: var(--dl-color-disabled);
            cursor: not-allowed;

            &:hover {
                border-color: var(--dl-color-separator);
            }
            & input {
                pointer-events: none;
            }
        }

        &--readonly {
            border-color: var(--dl-color-separator);
            cursor: text;

            &:hover {
                border-color: var(--dl-color-separator);
            }
            & input {
                pointer-events: none;
            }
        }
    }

    .selected {
        background-color: var(--dl-color-fill);
    }

    //todo: This doesnt work because of portal.
    .select-list {
        padding: 5px 0;
        max-height: var(--dl-select-dropdown-max-height);
        overflow: auto;
        width: fit-content;
    }

    .expand-icon {
        display: flex !important;
        justify-content: center !important;
        align-items: center;
        color: var(--dl-color-medium);
        transition-property: transform, -webkit-transform;
        transition-duration: 0.28s, 0.28s;
        transition-timing-function: ease, ease;
        transition-delay: 0s, 0s;
        &.expanded {
            transform: rotate(180deg);
        }
    }

    .adornment-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 28px;

        &--l {
            height: 34px;
        }

        &--large {
            height: 34px;
        }

        &--m {
            height: 28px;
        }

        &--medium {
            height: 28px;
        }

        &--s {
            height: 20px;
        }

        &--small {
            height: 20px;
        }

        &--pos-left {
            top: 0;
            left: 0;
        }

        &--pos-right {
            top: 0;
            right: 0;
            &-without_padding {
                width: 14px;
            }
        }
    }

    .select-search-input {
        appearance: none;
        border: 0;
        outline: none;
        background: none;
        color: var(--dl-color-darker);
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        height: 14px;

        &.hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        &::placeholder {
            color: var(--dl-color-lighter);
        }
    }
    .bottom-message-container {
        display: flex;
        justify-content: space-between;
        text-align: left;
    }
}
.fit-content > * {
    max-width: fit-content;
}
.row-root {
    display: flex;
    gap: 8px;
    align-items: center;
}
</style>
