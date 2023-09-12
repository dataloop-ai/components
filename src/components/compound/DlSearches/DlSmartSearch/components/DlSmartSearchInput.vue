<template>
    <div
        :id="`DlSmartSearchInput${uuid}`"
        :style="cssVars"
        class="dl-smart-search-input"
    >
        <div
            class="dl-smart-search-input__search-bar-wrapper"
            @click="focus()"
        >
            <div
                ref="searchBar"
                :class="searchBarClasses"
            >
                <div class="dl-smart-search-input__status-icon-wrapper">
                    <dl-icon
                        v-if="!focused && computedStatus"
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
                        :placeholder="inputPlaceholder"
                        :contenteditable="!disabled"
                        @keypress="onKeyPress"
                        @input="onInput"
                        @click.stop.prevent="focus"
                        @blur="blur"
                    />
                </div>
                <div class="dl-smart-search-input__toolbar">
                    <div
                        v-if="showClearButton && modelValue"
                        class="dl-smart-search-input__clear-btn-wrapper"
                    >
                        <dl-button
                            icon="icon-dl-close"
                            size="12px"
                            flat
                            :disabled="disabled"
                            @mousedown="onClear"
                        />
                        <dl-tooltip> Clear Query </dl-tooltip>
                    </div>
                </div>
            </div>
            <dl-label
                v-if="!focused && computedStatus"
                ref="label"
                class="dl-smart-search-input__search-label"
                :text="computedStatus.message"
                :color="computedStatus.type === 'error' ? 'red' : 'gray'"
                :style="labelStyles"
            />
        </div>
        <suggestions-dropdown
            v-model="showSuggestions"
            :parent-id="`${uuid}`"
            :trigger-percentage="0.5"
            :disabled="disabled"
            :suggestions="suggestions"
            :offset="menuOffset"
            :expanded="expanded"
            @set-input-value="setInputFromSuggestion"
        />
        <dl-menu
            v-if="showDatePicker && focused"
            v-model="showDatePicker"
            :disabled="disabled"
            :offset="[0, 3]"
        >
            <div class="dl-smart-search-input__date-picker-wrapper">
                <dl-date-picker
                    :single-selection="true"
                    @change="onDateSelection"
                />
            </div>
        </dl-menu>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    ref,
    PropType,
    nextTick,
    toRefs,
    computed,
    watch,
    onMounted,
    onBeforeUnmount
} from 'vue-demi'
import { DlButton } from '../../../../basic'
import { DlDatePicker } from '../../../DlDateTime'
import { DlMenu, DlIcon, DlLabel } from '../../../../essential'
import { isEllipsisActive } from '../../../../../utils/is-ellipsis-active'
import { useSizeObserver } from '../../../../../hooks/use-size-observer'
import { ColorSchema, SearchStatus, SyntaxColorSchema } from '../types'
import { debounce, isEqual } from 'lodash'
import { DlTooltip } from '../../../../shared'
import SuggestionsDropdown from './SuggestionsDropdown.vue'
import { DateInterval } from '../../../DlDateTime/types'
import {
    isEndingWithDateIntervalPattern,
    replaceDateInterval,
    setCaret,
    updateEditor,
    isEligibleToChange,
    createColorSchema,
    replaceJSDatesWithStringifiedDates,
    replaceStringifiedDatesWithJSDates,
    setAliases,
    revertAliases,
    clearPartlyTypedSuggestion
} from '../utils'
import { v4 } from 'uuid'
import {
    Schema,
    Alias,
    useSuggestions,
    removeBrackets
} from '../../../../../hooks/use-suggestions'
import { parseSmartQuery, stringifySmartQuery } from '../../../../../utils'

export default defineComponent({
    components: {
        DlIcon,
        DlButton,
        SuggestionsDropdown,
        DlTooltip,
        DlDatePicker,
        DlMenu,
        DlLabel
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        schema: {
            type: Object as PropType<Schema>,
            default: () => ({})
        },
        aliases: {
            type: Array as PropType<Alias[]>,
            default: () => [] as Alias[]
        },
        colorSchema: {
            type: Object as PropType<ColorSchema>,
            default: () => ({
                fields: 'var(--dl-color-secondary)',
                operators: 'var(--dl-color-positive)',
                keywords: 'var(--dl-color-medium)'
            })
        },
        status: {
            type: Object as PropType<SearchStatus>,
            default: () => ({ type: 'info', message: '' })
        },
        placeholder: {
            type: String,
            default: ''
        },
        clearButton: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '250px'
        },
        height: {
            type: String,
            default: '28px'
        },

        strict: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:model-value', 'focus', 'blur', 'input', 'search', 'error'],
    setup(props, { emit }) {
        //#region refs
        const input = ref<HTMLInputElement>(null)
        const label = ref<HTMLLabelElement>(null)
        const searchBar = ref<HTMLDivElement>(null)
        //#endregion

        //#region props
        const {
            modelValue,
            colorSchema,
            aliases,
            strict,
            status,
            disabled,
            schema,
            height,
            width
        } = toRefs(props)
        //#endregion

        //#region data
        const searchQuery = ref<string>('')
        const focused = ref(false)
        const isOverflowing = ref(false)
        const isTyping = ref(false)
        const scroll = ref(false)
        const showSuggestions = ref(false)
        const menuOffset = ref([0, 5])
        const cancelBlur = ref(0)
        const expanded = ref(true)
        const datePickerSelection = ref(null)
        const showDatePicker = ref(false)
        //#endregion

        //#region hooks
        // todo: these can be stale data. we need to update them on schema change.
        const { hasEllipsis } = useSizeObserver(input)
        const { suggestions, error, findSuggestions } = useSuggestions(
            schema.value,
            aliases.value,
            { strict }
        )
        //#endregion

        //#region methods
        const setInputValue = (
            value: string,
            options: { noEmit?: boolean } = {}
        ) => {
            const { noEmit } = options

            showSuggestions.value = false

            // to handle date suggestion modal to open automatically.
            if (value.includes('(dd/mm/yyyy)')) {
                value = value.trimEnd()
            }

            const specialSuggestions = suggestions.value.filter((suggestion) =>
                suggestion.startsWith('.')
            )

            for (const suggestion of specialSuggestions) {
                if (value.includes(suggestion)) {
                    value = value.replace(` ${suggestion}`, suggestion)
                }
            }

            searchQuery.value = value

            if (value !== input.value.innerText) {
                input.value.innerHTML = value
            }

            updateEditor(input.value, editorStyle.value)
            setMenuOffset(isEligibleToChange(input.value, expanded.value))

            if (!expanded.value) {
                isOverflowing.value =
                    isEllipsisActive(input.value) || hasEllipsis.value
            }

            if (focused.value) {
                if (value.length && isEndingWithDateIntervalPattern(value)) {
                    showDatePicker.value = true
                    showSuggestions.value = false
                } else {
                    showDatePicker.value = false
                    datePickerSelection.value = null
                    showSuggestions.value = true
                }
            }

            scroll.value = input.value.offsetHeight > 40

            nextTick(() => {
                findSuggestions(value)
            })

            if (!noEmit) {
                emit('input', value)
            }
        }

        const setInputFromSuggestion = (value: string) => {
            let stringValue = ''
            if (searchQuery.value.length) {
                let query = searchQuery.value
                    .replace(new RegExp(' ', 'g'), ' ')
                    .split(' ')
                    .map((string: string) => string.trim())
                    .filter((string: string) => !!string.length)

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
                        } else if (
                            value
                                .toLowerCase()
                                .startsWith(
                                    query[query.length - 1].toLowerCase()
                                )
                        ) {
                            query = query.slice(0, query.length - 1)
                        }
                        stringValue = [...query, value, ''].join(' ')
                    }
                } else {
                    if (query[query.length - 1].endsWith('.')) {
                        query[query.length - 1] = query[
                            query.length - 1
                        ].replace('.', '')
                    } else if (
                        value
                            .toLowerCase()
                            .startsWith(query[query.length - 1].toLowerCase())
                    ) {
                        query = query.slice(0, query.length - 1)
                    }

                    stringValue = [...query, value, ''].join(' ')
                }
            } else {
                stringValue = value + ' '
            }

            setInputValue(
                clearPartlyTypedSuggestion(input.value.innerText, stringValue)
            )
            setCaret(input.value)
        }

        const debouncedSetInputValue = debounce(setInputValue, 300)

        const updateJSONQuery = () => {
            try {
                const bracketless = removeBrackets(searchQuery.value)
                const cleanedAliases = revertAliases(bracketless, aliases.value)
                const json = toJSON(cleanedAliases)
                if (!isEqual(json, modelValue.value)) {
                    emit('update:model-value', json)
                }
                return json
            } catch (e) {
                emit('error', {
                    error: e,
                    message: 'Could not translate given JSON to a valid Scheme'
                })
                return modelValue.value
            }
        }

        const setInputFromModel = (value: string) => {
            searchQuery.value = value
            input.value.innerHTML = value

            let inputValue = `${value}`
            if (value.length) {
                inputValue += ' '
            }
            setInputValue(inputValue, { noEmit: true })
        }

        const debouncedSetInputFromModel = debounce(setInputFromModel, 300)

        const setMenuOffset = (value: number[]) => {
            menuOffset.value = value
        }

        const focus = () => {
            if (disabled.value) {
                return
            }

            if (focused.value) {
                return
            }

            input.value.scrollTo(0, input.value.scrollHeight)
            input.value.scrollLeft = input.value.scrollWidth

            input.value.focus()

            focused.value = true
            emit('focus')
        }

        const blur = (
            e: Event | null = null,
            options: { force?: boolean } = {}
        ) => {
            const { force } = options

            if (showDatePicker.value) {
                return
            }

            if (cancelBlur.value === 0) {
                if (showSuggestions.value) {
                    focused.value = true
                    return
                }

                if (!focused.value && !force) {
                    return
                }

                input.value.scrollLeft = 0
                input.value.scrollTop = 0
                focused.value = false
                expanded.value = true
                updateJSONQuery()
                emit('blur')
            } else {
                focus()
                cancelBlur.value = cancelBlur.value - 1
            }
        }

        const onClear = () => {
            cancelBlur.value = cancelBlur.value === 0 ? 1 : cancelBlur.value
            searchQuery.value = ''
            input.value.innerHTML = ''
            emit('update:model-value', {})
            if (!focused.value) {
                focus()
            }
        }

        const onKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                emit('search', updateJSONQuery())
                showSuggestions.value = false
                return
            }

            if (!focused.value) {
                focus()
            }
        }

        const onInput = (e: Event) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                return
            }

            const text = (e.target as HTMLElement).textContent
            debouncedSetInputValue(text)
        }

        const onDateSelection = (value: DateInterval) => {
            datePickerSelection.value = value
            searchQuery.value = replaceDateInterval(searchQuery.value, value)
            input.value.innerHTML = searchQuery.value
        }

        const readModelValue = (val: { [key: string]: any }) => {
            if (val) {
                const aliased = fromJSON(val)

                if (
                    aliased !== searchQuery.value.trim() ||
                    !input.value?.innerHTML.length
                ) {
                    debouncedSetInputFromModel(aliased)
                }
            }
        }

        const isValidJSON = (item: string | Object): boolean => {
            let value = typeof item !== 'string' ? JSON.stringify(item) : item
            try {
                value = JSON.parse(value)
            } catch (e) {
                return false
            }

            return typeof value === 'object' && value !== null
        }

        const toJSON = (value: string) => {
            const replacedDate = replaceStringifiedDatesWithJSDates(value)
            const json = parseSmartQuery(replacedDate ?? searchQuery.value)

            return isValidJSON(json) ? json : searchQuery.value
        }

        const fromJSON = (value: { [key: string]: any }) => {
            try {
                const replacedDate = replaceJSDatesWithStringifiedDates(
                    value,
                    dateKeys.value
                )

                const stringQuery = stringifySmartQuery(replacedDate)
                const aliased = setAliases(stringQuery, aliases.value)
                return aliased
            } catch (e) {
                emit('error', {
                    error: e,
                    message: 'Could not translate given JSON to a valid Scheme'
                })
                return ''
            }
        }
        //#endregion

        //#region computed
        const editorStyle = computed((): SyntaxColorSchema => {
            return createColorSchema(colorSchema.value, aliases.value)
        })

        const statusIcon = computed(() => {
            switch (computedStatus.value.type) {
                case 'success':
                    return 'icon-dl-approve-filled'
                case 'error':
                    return 'icon-dl-discard-filled'
                case 'warning':
                    return 'icon-dl-alert-filled'
                default:
                    return ''
            }
        })

        const statusIconColor = computed(() => {
            switch (computedStatus.value.type) {
                case 'success':
                    return 'dl-color-positive'
                case 'error':
                    return 'dl-color-negative'
                case 'warning':
                    return 'dl-color-warning'
                default:
                    return ''
            }
        })

        const textareaStyles = computed<Record<string, string | number>>(() => {
            const overflow: string =
                scroll.value && focused.value ? 'scroll' : 'hidden'
            return {
                overflow,
                '-webkit-appearance': 'textfield'
            }
        })

        const searchBarClasses = computed<string>(() => {
            let classes = 'dl-smart-search-input__search-bar'

            if (focused.value) {
                classes += ' dl-smart-search-input__search-bar--focused'
            } else if (!focused.value) {
                if (computedStatus.value.type === 'error') {
                    classes += ' dl-smart-search-input__search-bar--error'
                } else if (computedStatus.value.type === 'warning') {
                    classes += ' dl-smart-search-input__search-bar--warning'
                }
            }

            if (expanded.value) {
                classes += ' dl-smart-search-input__search-bar--expanded'
            }

            if (disabled.value) {
                classes += ' dl-smart-search-input__search-bar--disabled'
            }

            return classes
        })

        const inputClass = computed<string>(() => {
            return `dl-smart-search-input__textarea${
                focused.value ? ' focus' : ''
            }`
        })

        const showClearButton = computed(() => {
            return searchQuery.value.length > 0
        })

        const cssVars = computed<Record<string, string | number>>(() => {
            return {
                '--dl-smart-search-bar-wrapper-height': !focused.value
                    ? 'auto'
                    : 'fit-content',
                '--dl-smart-search-input-height': height.value,
                '--dl-smart-search-input-bar-width': focused.value
                    ? '100%'
                    : width.value,
                '--dl-smart-search-input-max-width': focused.value
                    ? '100%'
                    : width.value
            }
        })

        const labelStyles = computed<Record<string, string | number>>(() => {
            return {
                color: computedStatus.value.type === 'error' ? 'red' : 'gray'
            }
        })

        const dateKeys = computed(() => {
            return Object.keys(schema.value).filter(
                (key) => schema.value[key] === 'date'
            )
        })

        const computedStatus = computed<SearchStatus>((): SearchStatus => {
            if (searchQuery.value === '') {
                return status.value
            }

            if (!error.value && searchQuery.value !== '') {
                return {
                    type: 'success',
                    message: ''
                }
            }

            if (error.value === 'warning') {
                return {
                    type: 'warning',
                    message: 'The query is not supported technically.'
                }
            }

            return {
                type: 'error',
                message: error.value
            }
        })

        const inputPlaceholder = computed(() => {
            return focused.value || searchQuery.value.length
                ? ''
                : props.placeholder
        })

        //#endregion

        //#region watcher
        watch(suggestions, (value) => {
            if (showDatePicker.value) return
            nextTick(() => {
                if (!value.length) {
                    showSuggestions.value = false
                }

                if (
                    !showSuggestions.value &&
                    value.length > 0 &&
                    focused.value
                ) {
                    showSuggestions.value = true
                }
            })
        })

        watch(focused, (value) => {
            if (!value) {
                input.value.parentElement.style.width = '1px'
            } else {
                setMenuOffset(isEligibleToChange(input.value, value))
                input.value.parentElement.style.width = '100%'
            }
        })

        watch(showDatePicker, (value) => {
            if (!value) {
                datePickerSelection.value = null

                nextTick(() => {
                    focus()
                })
            }
        })

        watch(
            modelValue,
            (value, old) => {
                if (value) {
                    if (isEqual(value, old)) {
                        return
                    }
                    readModelValue(value)
                }
            },
            { immediate: true, deep: true }
        )
        //#endregion

        onMounted(() => {
            if (!expanded.value) {
                isOverflowing.value =
                    isEllipsisActive(input.value) || hasEllipsis.value
            }
            window.addEventListener('mousemove', () => (isTyping.value = false))
            blur(null, { force: true })
        })
        onBeforeUnmount(() => {
            window.removeEventListener(
                'mousemove',
                () => (isTyping.value = false)
            )
        })

        return {
            uuid: v4(),
            input,
            label,
            searchBar,
            searchQuery,
            focused,
            isOverflowing,
            isTyping,
            scroll,
            showSuggestions,
            menuOffset,
            cancelBlur,
            expanded,
            datePickerSelection,
            showDatePicker,
            suggestions,
            error,
            editorStyle,
            debouncedSetInputValue,
            statusIcon,
            statusIconColor,
            textareaStyles,
            searchBarClasses,
            inputClass,
            showClearButton,
            cssVars,
            labelStyles,
            focus,
            blur,
            onClear,
            onKeyPress,
            onInput,
            onDateSelection,
            computedStatus,
            setInputFromSuggestion,
            inputPlaceholder
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-smart-search-input {
    display: flex;
    flex-grow: 1;
    max-width: var(--dl-smart-search-input-max-width);
    width: var(--dl-smart-search-input-bar-width);
    height: 100%;
    transition: max-width 0.3s ease-out;
    /* Margin for the status label */
    margin-bottom: 15px;

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
        padding-left: 10px;
        overflow-y: auto;
        background-color: var(--dl-color-panel-background);
        cursor: text;

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
            color: var(--dl-color-disabled);
            cursor: not-allowed;
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

        &::before {
            color: var(--dl-color-lighter);
            /* In case this causes render shadowing move to use html/injection approach */
            content: attr(placeholder);
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
        padding-left: 5px;
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
        font-size: 10px;
        height: 15px;
        color: gray;
        position: absolute;
        word-break: break-all;
        bottom: -15px;
        max-width: 100%;
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
