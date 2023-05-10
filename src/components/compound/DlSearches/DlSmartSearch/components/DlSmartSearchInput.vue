<template>
    <div
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
                        id="editor"
                        ref="input"
                        :class="inputClass"
                        style="-webkit-appearance: textfield"
                        :placeholder="placeholder"
                        :contenteditable="!disabled"
                        @keypress="keyPress"
                        @input="handleValueChange"
                        @click="focus"
                        @blur="blur"
                    />
                </div>
                <div class="dl-smart-search-input__toolbar">
                    <div
                        v-if="withClearButton && modelValue"
                        class="dl-smart-search-input__clear-button-wrapper"
                    >
                        <dl-button
                            icon="icon-dl-close"
                            size="10px"
                            flat
                            :disabled="disabled"
                            @mousedown="clearValue"
                        />
                        <dl-tooltip> Clear Query </dl-tooltip>
                    </div>
                    <div
                        v-if="withScreenButton"
                        class="dl-smart-search-input__screen-button-wrapper"
                    >
                        <dl-button
                            :icon="screenIcon"
                            size="16px"
                            flat
                            :disabled="disabled"
                            @mousedown="handleScreenButtonClick"
                        />
                        <dl-tooltip>
                            {{ expanded ? 'Collapse' : 'Expand' }} Smart Search
                        </dl-tooltip>
                    </div>
                    <div
                        v-if="withSaveButton"
                        class="dl-smart-search-input__save-button-wrapper"
                    >
                        <dl-button
                            icon="icon-dl-save"
                            size="16px"
                            flat
                            :disabled="saveStatus"
                            @click="save"
                        >
                            <dl-tooltip> Save Query </dl-tooltip>
                        </dl-button>
                        <dl-button
                            icon="icon-dl-loop"
                            size="16px"
                            flat
                            transform="none"
                            text-color="dl-color-darker"
                            :disabled="saveStatus"
                            uppercase
                            label="DQL"
                            @click="edit"
                        >
                            <dl-tooltip> Switch to DQL </dl-tooltip>
                        </dl-button>
                    </div>
                </div>
            </div>
            <label
                ref="label"
                class="dl-smart-search-input__search-label"
                :style="labelStyles"
            >{{ status?.message }}</label>
        </div>
        <div :class="messageClasses">
            {{ message }}
        </div>
        <dl-suggestions-dropdown
            v-model="suggestionModal"
            :disabled="disabled"
            :suggestions="suggestions"
            :offset="menuOffset"
            :expanded="expanded"
            @set-input-value="setInputValue"
        />
        <dl-menu
            v-if="isDatePickerVisible"
            v-model="isDatePickerVisible"
            :disabled="disabled"
            :offset="[0, 3]"
        >
            <div class="dl-smart-search-input__date-picker-wrapper">
                <dl-date-picker @change="handleDateSelectionUpdate" />
            </div>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue-demi'
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
    updateEditor
} from '../utils'
import { isEligibleToChange } from '../utils/utils'

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
            default: () => {}
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
                    query.splice(-1)
                    stringValue = [...query, value, ''].join(' ')
                }
            } else {
                stringValue = [value, ''].join(' ')
            }

            emit('update:modelValue', stringValue)
        }

        return {
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
            isDatePickerVisible
        }
    },
    data(): {
        focused: boolean
        isOverflow: boolean
        isTyping: boolean
    } {
        return {
            focused: false,
            isOverflow: false,
            isTyping: false
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
        searchBarClasses(): string {
            let classes = 'dl-smart-search-input__search-bar'

            if (this.focused && this.status.type === 'info') {
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
        inputClass() {
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
        withClearButton(): boolean {
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
        saveStatus() {
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
            if (!this.isTyping) target.innerHTML = value
            updateEditor(this.styleModel)
            this.setMenuOffset(isEligibleToChange(target, this.expanded))
            if (!this.isTyping) setCaret(target)
            if (!this.expanded) {
                this.isOverflow =
                    isEllipsisActive(this.$refs['input'] as Element) ||
                    this.hasEllipsis
            }
            if (value.length === 0) {
                this.focus()
            }
            if (isEndingWithDateIntervalPattern(value)) {
                this.isDatePickerVisible = true
                this.suggestionModal = false
            }
        },
        suggestions(val) {
            if (this.isDatePickerVisible) return

            if (!val.length) {
                this.suggestionModal = false
            }

            if (!this.suggestionModal && val.length > 0 && this.focused) {
                const deb = debounce(() => (this.suggestionModal = true), 200)
                deb()
            }
        },
        expanded(value) {
            this.$nextTick(() => {
                const element = this.$refs['input'] as HTMLTextAreaElement

                if (!value) {
                    element.scrollLeft = 0
                }

                this.setMenuOffset(isEligibleToChange(element, value))

                this.focus()
            })
        },
        focused(value) {
            (this.$refs.searchBar as HTMLElement).style.maxHeight = `${
                value ? parseInt(this.searchBarWidth) : 28
            }px`
            if (!value) {
                (this.$refs.input as HTMLElement).parentElement.style.width =
                    '1px'
            }
        },
        isDatePickerVisible(val: boolean) {
            if (!val) {
                this.datePickerSelection = null

                setTimeout(() => {
                    this.focus()
                }, 1)
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
            transition: height 0.3s ease-out;
            position: relative;
            top: 0;
            left: 0;
            right: 0;
            height: var(--dl-smart-search-bar-wrapper-height);
            max-height: var(--dl-smart-search-bar-wrapper-height);
        }

        &--disabled {
            border-color: var(--dl-color-disabled);
        }
    }

    &__status-icon-wrapper {
        display: flex;
        line-height: 15px;
        align-items: flex-start;
        padding-top: 7px;
        margin-right: 5px;
    }

    &__text,
    &__textarea {
        width: 100%;
        font-size: inherit;
        font-family: inherit;
    }

    &__textarea {
        font-size: 12px;
        line-height: 14px;
        font-weight: 400;
        font-family: 'Roboto', sans-serif;
        width: 100%;
        border: none;
        outline: none;
        resize: none;

        white-space: nowrap;

        height: auto;
        min-height: 14px;
        max-height: 100%;
        display: block;
        overflow: scroll;
    }

    &__input,
    &__textarea {
        color: var(--dl-color-darker);
        background-color: var(--dl-color-panel-background);
        padding: 0;

        ::placeholder {
            color: var(--dl-color-lighter);
        }
        & > * {
            display: flex;
        }
    }

    &__input-wrapper,
    &__textarea-wrapper {
        position: relative;
        display: flex;
        flex-grow: 1;
        padding: 9px 10px 6px 0;
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
        padding-top: 5px;
    }

    &__clear-button-wrapper {
        border-right: 1px solid var(--dl-color-separator);
        padding: 0 7px;
        display: flex;
        align-items: center;
        ::v-deep .dl-button {
            padding: 0px;
            color: var(--dl-color-darker);
        }
    }

    &__screen-button-wrapper {
        display: flex;
        align-items: center;
        padding: 0 5px;
        ::v-deep .dl-icon {
            font-size: 16px;
            color: var(--dl-color-darker);
        }
    }

    &__save-button-wrapper {
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
        font-size: 10px;
        margin-left: 4px;
        margin-top: 4px;
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
