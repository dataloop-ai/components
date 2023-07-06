<template>
    <div
        :id="`DlSmartSearchInput${uuid}`"
        class="dl-smart-search-input"
        :style="cssVars"
    >
        <div class="dl-smart-search-input__search-bar-wrapper">
            <div
                ref="searchBar"
                :class="searchBarClasses"
            >
                <div class="dl-smart-search-input__status-icon-wrapper">
                    <dl-icon
                        v-if="!focused && (withSearchIcon || status)"
                        :icon="statusIcon"
                        :color="statusIconColor"
                        size="16px"
                        :inline="false"
                    />
                </div>
                <div class="dl-smart-search-input__textarea-wrapper">
                    <div
                        :id="`dl-smart-search-input-text-area-${uuid}`"
                        ref="input"
                        :class="inputClass"
                        :style="textareaStyles"
                        :placeholder="placeholder"
                        :contenteditable="!disabled"
                        @keypress="keyPress"
                        @input="handleValueChange"
                        @click.stop.prevent="focus"
                        @blur="blur"
                    />
                </div>
                <div class="dl-smart-search-input__toolbar">
                    <div
                        v-if="withClearBtn && modelValue"
                        class="dl-smart-search-input__clear-btn-wrapper"
                    >
                        <dl-button
                            icon="icon-dl-close"
                            size="12px"
                            flat
                            :disabled="disabled"
                            @mousedown="clearValue"
                        />
                        <dl-tooltip> Clear Query </dl-tooltip>
                    </div>
                    <div class="dl-smart-search-input__toolbar--right">
                        <div
                            v-if="withScreenButton"
                            class="dl-smart-search-input__screen-btn-wrapper"
                        >
                            <dl-button
                                :icon="screenIcon"
                                size="16px"
                                flat
                                :disabled="disabled"
                                @mousedown="handleScreenButtonClick"
                            />
                            <dl-tooltip>
                                {{ expanded ? 'Collapse' : 'Expand' }} Smart
                                Search
                            </dl-tooltip>
                        </div>
                        <div
                            v-if="withSaveButton"
                            class="dl-smart-search-input__save-btn-wrapper"
                        >
                            <div>
                                <dl-button
                                    icon="icon-dl-save"
                                    size="16px"
                                    flat
                                    :disabled="saveStatus"
                                    @click="save"
                                />
                                <dl-tooltip> Save Query </dl-tooltip>
                            </div>
                            <dl-button
                                icon="icon-dl-edit"
                                size="16px"
                                flat
                                transform="none"
                                text-color="dl-color-darker"
                                uppercase
                                label="DQL"
                                @click="edit"
                            >
                                <dl-tooltip> Switch to DQL </dl-tooltip>
                            </dl-button>
                        </div>
                    </div>
                </div>
            </div>
            <label
                v-if="!focused"
                ref="label"
                class="dl-smart-search-input__search-label"
                :style="labelStyles"
            >{{ status ? status.message : null }}</label>
        </div>
        <div :class="messageClasses">
            {{ message }}
        </div>
        <dl-suggestions-dropdown
            v-model="suggestionModal"
            :parent-id="`${uuid}`"
            :disabled="disabled"
            :suggestions="suggestions"
            :offset="menuOffset"
            :expanded="expanded"
            @set-input-value="setInputValue"
        />
        <dl-menu
            v-if="isDatePickerVisible && focused"
            v-model="isDatePickerVisible"
            :disabled="disabled"
            :offset="[0, 3]"
        >
            <div class="dl-smart-search-input__date-picker-wrapper">
                <dl-date-picker
                    :single-selection="false"
                    @change="handleDateSelectionUpdate"
                />
            </div>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, nextTick } from 'vue-demi'
import { DlButton } from '../../../../basic'
import { DlDatePicker } from '../../../DlDateTime'
import { DlMenu, DlIcon } from '../../../../essential'
import { isEllipsisActive } from '../../../../../utils/is-ellipsis-active'
import { useSizeObserver } from '../../../../../hooks/use-size-observer'
import { SearchStatus, SyntaxColorSchema } from '../types'
import { debounce } from 'lodash'
import { DlTooltip } from '../../../../essential'
import DlSuggestionsDropdown from './DlSuggestionsDropdown.vue'
import { DateInterval } from '../../../DlDateTime/types'
import {
    isEndingWithDateIntervalPattern,
    replaceDateInterval,
    setCaret,
    updateEditor,
    isEligibleToChange
} from '../utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DlIcon,
        DlButton,
        DlSuggestionsDropdown,
        DlTooltip,
        DlDatePicker,
        DlMenu
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        status: {
            type: Object as PropType<SearchStatus>,
            default: () => ({ type: 'info', message: '' })
        },
        styleModel: {
            type: Object as PropType<SyntaxColorSchema>,
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        suggestions: {
            type: Array as PropType<string[]>,
            default: () => [] as string[]
        },
        inputHeight: {
            type: String,
            default: '26px'
        },
        expandedInputHeight: {
            type: String,
            default: '327px'
        },
        modelValue: {
            type: String,
            default: ''
        },
        withSearchIcon: {
            type: Boolean,
            default: false
        },
        withScreenButton: {
            type: Boolean,
            default: false
        },
        withSaveButton: {
            type: Boolean,
            default: false
        },
        withDQLButton: {
            type: Boolean,
            default: true
        },
        message: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        searchBarWidth: {
            type: String,
            default: 'auto'
        },
        defaultWidth: {
            type: String,
            default: '450px'
        }
    },
    emits: [
        'update:modelValue',
        'update:expanded',
        'save',
        'search',
        'filter',
        'dql-edit',
        'focus'
    ],
    setup(props, { emit }) {
        const input = ref(null)
        const label = ref(null)
        const styledTexarea = ref(null)
        const styledInput = ref(null)

        const focused = ref(false)
        const isOverflow = ref(false)
        const isTyping = ref(false)
        const scroll = ref(false)

        const { hasEllipsis } = useSizeObserver(input)

        const suggestionModal = ref(false)
        const menuOffset = ref([0, 5])
        const cancelBlur = ref(0)
        const expanded = ref(false)

        const datePickerSelection = ref(null)
        const isDatePickerVisible = ref(false)

        const setInputValue = (value: string) => {
            const query = props.modelValue
                .split(' ')
                .map((string) => string.trim())

            suggestionModal.value = false

            let stringValue = ''

            if (query.length > 1) {
                if (query[query.length - 1] === '') {
                    stringValue = [...query, value, '']
                        .join(' ')
                        .replace('  ', ' ')
                } else {
                    if (query[query.length - 1].endsWith('.')) {
                        query[query.length - 1] = query[
                            query.length - 1
                        ].replace('.', '')
                    } else {
                        query.splice(-1)
                    }
                    stringValue = [...query, value, ''].join(' ')
                }
            } else {
                if (query[query.length - 1].endsWith('.')) {
                    query[query.length - 1] = query[query.length - 1].replace(
                        '.',
                        ''
                    )
                    stringValue = [...query, value, ''].join(' ')
                } else {
                    stringValue = [value, ''].join(' ')
                }
            }

            // to handle date suggestion modal to open automatically.
            if (stringValue.includes('(dd/mm/yyyy)')) {
                stringValue = stringValue.trimEnd()
            }

            const specialSuggestions = props.suggestions.filter((suggestion) =>
                suggestion.startsWith('.')
            )

            for (const suggestion of specialSuggestions) {
                if (stringValue.includes(suggestion)) {
                    stringValue = stringValue.replace(
                        ` ${suggestion}`,
                        suggestion
                    )
                }
            }

            emit('update:modelValue', stringValue)
        }

        const debouncedSetModal = debounce(
            () => (suggestionModal.value = true),
            200
        )

        return {
            uuid: v4(),
            input,
            label,
            hasEllipsis,
            suggestionModal,
            setInputValue,
            menuOffset,
            cancelBlur,
            expanded,
            styledTexarea,
            styledInput,
            datePickerSelection,
            isDatePickerVisible,
            focused,
            isOverflow,
            isTyping,
            scroll,
            debouncedSetModal
        }
    },
    computed: {
        statusIcon(): string {
            switch (this.status.type) {
                case 'success':
                    return 'icon-dl-approve-filled'
                case 'error':
                    return 'icon-dl-discard-filled'
                case 'warning':
                    return 'icon-dl-alert-filled'
                default:
                    return ''
            }
        },
        statusIconColor(): string {
            switch (this.status.type) {
                case 'success':
                    return 'dl-color-positive'
                case 'error':
                    return 'dl-color-negative'
                case 'warning':
                    return 'dl-color-warning'
                default:
                    return ''
            }
        },
        screenIcon(): string {
            return this.expanded
                ? 'icon-dl-fit-to-screen'
                : 'icon-dl-full-screen'
        },
        textareaStyles(): Record<string, any> {
            const overflow: string =
                this.scroll && this.focused ? 'scroll' : 'hidden'
            return {
                overflow,
                '-webkit-appearance': 'textfield'
            }
        },
        searchBarClasses(): string {
            let classes = 'dl-smart-search-input__search-bar'

            if (this.focused) {
                classes += ' dl-smart-search-input__search-bar--focused'
            } else if (!this.focused) {
                if (this.status.type === 'error') {
                    classes += ' dl-smart-search-input__search-bar--error'
                } else if (this.status.type === 'warning') {
                    classes += ' dl-smart-search-input__search-bar--warning'
                }
            }

            if (this.expanded) {
                classes += ' dl-smart-search-input__search-bar--expanded'
            }

            if (this.disabled) {
                classes += ' dl-smart-search-input__search-bar--disabled'
            }

            return classes
        },
        inputClass(): string {
            return `dl-smart-search-input__textarea${
                this.focused ? ' focus' : ''
            }`
        },
        messageClasses(): string {
            let classes = 'dl-smart-search-input__message'

            if (this.status) {
                classes += ` dl-smart-search-input__message--${this.status}`
            }

            return classes
        },
        withClearBtn(): boolean {
            return this.modelValue.length > 0
        },
        cssVars(): Record<string, string> {
            return {
                '--dl-smart-search-bar-wrapper-height':
                    this.expandedInputHeight,
                '--dl-smart-search-input-height': this.inputHeight,
                '--search-bar-width': this.searchBarWidth
            }
        },
        saveStatus(): boolean {
            return (
                this.disabled ||
                !this.modelValue ||
                this.status.type === 'error'
            )
        },
        labelStyles(): Record<string, any> {
            return {
                color: this.status?.type === 'error' ? 'red' : 'gray'
            }
        }
    },
    watch: {
        modelValue(value: string) {
            const target = this.$refs['input'] as HTMLInputElement
            value = value?.replaceAll(' ', ' ') ?? ''
            /*
             * I commented out this line because it was blocking arrow navigation
             * */
            // if (!this.isTyping) target.innerHTML = value
            target.innerHTML = value
            updateEditor(this.styleModel)
            this.setMenuOffset(isEligibleToChange(target, this.expanded))
            /*
             * I commented out this line because it was blocking arrow navigation
             * */
            // if (!this.isTyping) setCaret(target)
            setCaret(target)
            if (!this.expanded) {
                this.isOverflow =
                    isEllipsisActive(this.$refs['input'] as Element) ||
                    this.hasEllipsis
            }

            if (value.length && isEndingWithDateIntervalPattern(value)) {
                this.isDatePickerVisible = true
                this.suggestionModal = false
            } else {
                this.isDatePickerVisible = false
                this.suggestionModal = true
            }
            this.scroll = (this.$refs.input as HTMLDivElement).offsetHeight > 40
        },
        suggestions(val) {
            if (this.isDatePickerVisible) return
            nextTick(() => {
                if (!val.length) {
                    this.suggestionModal = false
                }

                if (!this.suggestionModal && val.length > 0 && this.focused) {
                    this.suggestionModal = true
                }
            })
        },
        expanded(value) {
            this.$nextTick(() => {
                const element = this.$refs['input'] as HTMLTextAreaElement

                if (!value) {
                    element.scrollLeft = 0
                }

                this.setMenuOffset(isEligibleToChange(element, value))

                if (value) {
                    this.focus()
                }
            })
        },
        focused(value) {
            (this.$refs.searchBar as HTMLElement).style.maxHeight = `${
                value ? parseInt(this.searchBarWidth) : 450
            }px`
            if (!value) {
                (this.$refs.input as HTMLElement).parentElement.style.width =
                    '1px'
            }
        },
        isDatePickerVisible(val: boolean) {
            if (!val) {
                this.datePickerSelection = null

                nextTick(() => {
                    this.focus()
                })
            }
        }
    },
    mounted() {
        if (!this.expanded) {
            this.isOverflow =
                isEllipsisActive(this.$refs['input'] as Element) ||
                this.hasEllipsis
        }
        window.addEventListener('mousemove', () => (this.isTyping = false))
    },
    methods: {
        setMenuOffset(value: number[]) {
            this.menuOffset = value
        },
        focus() {
            const target = this.$refs['input'] as HTMLInputElement
            if (this.disabled) {
                return
            }

            target.scrollTo(0, target.scrollHeight)
            target.scrollLeft = target.scrollWidth

            target.focus()

            this.focused = true
            this.$emit('focus', true)
        },
        blur() {
            const element = this.$refs['input'] as HTMLTextAreaElement

            if (this.isDatePickerVisible) {
                return
            }

            if (this.cancelBlur === 0) {
                if (this.suggestionModal) {
                    this.focused = true
                    return
                }

                element.scrollLeft = 0
                element.scrollTop = 0
                this.focused = false
                this.expanded = false
                this.$emit('focus', false)
            } else {
                this.focus()
                this.focused = true
                this.cancelBlur = this.cancelBlur - 1
            }
        },
        save() {
            this.$emit('save')
        },
        edit() {
            this.$emit('dql-edit')
        },
        clearValue() {
            this.cancelBlur = this.cancelBlur === 0 ? 1 : this.cancelBlur
            this.$emit('update:modelValue', '')
            if (!this.focused) {
                this.focus()
            }
        },
        keyPress(e: KeyboardEvent) {
            if (e.key === 'Enter') {
                this.$emit('search', this.modelValue)
                e.preventDefault()
                return
            } else if (e.key === 'backspace') {
                setCaret(this.$refs['input'] as HTMLElement)
            }
        },
        handleValueChange(e: Event) {
            this.isTyping = true

            const text = (e.target as HTMLElement).textContent
                .toString()
                .replaceAll(' ', ' ')

            this.$emit('update:modelValue', text)
        },
        handleScreenButtonClick() {
            this.cancelBlur = this.cancelBlur === 0 ? 1 : this.cancelBlur
            this.expanded = !this.expanded
            if (!this.focused) {
                this.focus()
            }
        },
        handleDateSelectionUpdate(val: DateInterval) {
            this.datePickerSelection = val

            this.$emit(
                'update:modelValue',
                replaceDateInterval(this.modelValue, val)
            )
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-smart-search-input {
    display: flex;
    text-align: left;
    position: absolute;
    width: var(--search-bar-width);

    &__char {
        ::selection {
            color: white;
        }
    }

    &__search-bar-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    &__search-bar {
        display: flex;
        flex-grow: 1;
        height: 100%;
        padding: 0 10px;
        overflow-y: auto;
        background-color: var(--dl-color-panel-background);

        font-size: 12px;
        line-height: 14px;

        border: 1px solid var(--dl-color-separator);
        border-radius: 2px;

        max-height: var(--dl-smart-search-bar-wrapper-height);

        &--error {
            border-color: var(--dl-color-negative);
        }

        &--warning {
            border-color: var(--dl-color-warning);
        }

        &--focused {
            border-color: var(--dl-color-secondary);
        }

        &--expanded {
            z-index: var(--dl-z-index-overlay);
            transition: height 0.3s ease-out;
            position: relative;
            top: 0;
            left: 0;
            right: 0;
            height: var(--dl-smart-search-bar-wrapper-height);
            max-height: var(--dl-smart-search-bar-wrapper-height);
        }

        &--disabled {
            border-color: var(--dl-color-separator);
        }
    }

    &__status-icon-wrapper {
        display: flex;
        line-height: 15px;
        margin: 6px 8px 0px 0px;
        align-items: flex-start;
        div:first-child {
            display: flex;
            align-items: center;
        }
    }

    &__text,
    &__textarea {
        width: 100%;
        font-size: inherit;
        font-family: inherit;
    }

    &__textarea {
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        font-family: 'Roboto', sans-serif;
        width: 100%;
        border: none;
        outline: none;
        resize: none;

        white-space: pre;
        margin-top: 7px;

        height: auto;

        min-height: 14px;
        max-height: var(--dl-smart-search-bar-wrapper-height);
        display: block;
    }

    &__input,
    &__textarea {
        color: var(--dl-color-darker);
        background-color: var(--dl-color-panel-background);

        ::placeholder {
            color: var(--dl-color-lighter);
        }
        & > * {
            display: flex;
        }
    }

    &__input-wrapper,
    &__textarea-wrapper {
        min-height: 28px;
        position: relative;
        display: flex;
        flex-grow: 1;
        position: relative;

        align-items: flex-start;
        justify-content: flex-start;
    }

    &__input-wrapper {
        align-items: center;
    }

    &__toolbar {
        display: flex;
        align-items: flex-start;
        height: 28px;
        &--right {
            height: 100%;
            display: flex;
        }
    }

    &__clear-btn-wrapper {
        border-right: 1px solid var(--dl-color-separator);
        height: 100%;
        display: flex;
        align-items: center;
        div:first-child {
            margin-right: 5px;
        }
        ::v-deep .dl-button {
            padding: 0px;
            color: var(--dl-color-darker);
        }
    }

    &__screen-btn-wrapper {
        display: flex;
        margin-right: 14px;
        align-items: center;
        margin-left: 9px;
        ::v-deep .dl-icon {
            font-size: 16px;
            color: var(--dl-color-darker);
        }
    }

    &__save-btn-wrapper {
        display: flex;
        align-items: center;
        color: var(--dl-color-darker);

        & > div:nth-of-type(1) {
            padding-right: 10px;
            border-right: 1px solid var(--dl-color-separator);
        }
        & > div:nth-of-type(2) {
            padding-left: 10px;
        }
        ::v-deep .dl-icon {
            transition: 1s;
            font-size: 16px;
            color: var(--dl-color-darker);
        }
    }

    &__action-buttons {
        display: flex;
        align-items: center;
        height: var(--dl-smart-search-input-height);
    }

    &__message {
        margin-top: 3px;
        color: var(--dl-color-medium);
        font-size: 10px;
        line-height: 12px;

        &--error {
            color: var(--dl-color-negative);
        }
    }

    &__search-label {
        margin-top: 3px;
        font-size: 10px;
        color: gray;
        position: relative;
        word-break: break-all;
    }

    &__date-picker-wrapper {
        width: 562px;
    }
}
.focus {
    word-break: break-all;
    flex-wrap: wrap;
    white-space: pre-wrap;
}
</style>
