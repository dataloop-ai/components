<template>
    <div
        :id="`DlSmartSearchInput${uuid}`"
        ref="container"
        :style="cssVars"
        class="dl-smart-search-input"
    >
        <div class="dl-smart-search-input__search-bar-wrapper">
            <div ref="searchBar" :class="searchBarClasses" @click="focus()">
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
                        @keyup.esc="onKeyPress"
                        @input="onInput"
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
            ref="suggestionsDropdown"
            v-model="showSuggestions"
            :parent-id="`${uuid}`"
            :trigger-percentage="0.5"
            :disabled="disabled"
            :suggestions="suggestions"
            :offset="menuOffset"
            :expanded="expanded"
            @set-input-value="setInputFromSuggestion"
            @escapekey="onEscapeKey"
            @enterkey="onEnterKey({ fromSuggestion: true })"
        />
        <dl-menu
            v-if="showDatePicker && focused"
            v-model="showDatePicker"
            :disabled="disabled"
            :offset="[0, 3]"
            :toggle-key="'Escape'"
            @escapekey="onEscapeKey"
        >
            <div class="dl-smart-search-input__date-picker-wrapper">
                <dl-date-picker
                    :single-selection="true"
                    @change="onDateSelection"
                />
                <div class="dl-smart-search-input__date-picker-buttons">
                    <dl-button
                        label="Cancel"
                        outlined
                        @mousedown="onDateSelectionCancel"
                    />
                    <dl-button
                        label="Apply"
                        :disabled="!datePickerSelection"
                        @mousedown="onDateSelectionApply"
                    />
                </div>
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
import {
    getSelectionOffset,
    setCaretAtTheEnd,
    setSelectionOffset
} from '../../../../../utils'
import { ColorSchema, SearchStatus, SyntaxColorSchema } from '../types'
import { debounce, isEqual } from 'lodash'
import { DlTooltip } from '../../../../shared'
import SuggestionsDropdown from './SuggestionsDropdown.vue'
import { DateInterval } from '../../../DlDateTime/types'
import {
    isEndingWithDateIntervalPattern,
    replaceDateInterval,
    removeDateInterval,
    updateEditor,
    isEligibleToChange,
    createColorSchema,
    replaceJSDatesWithStringifiedDates,
    replaceStringifiedDatesWithJSDates,
    setAliases,
    revertAliases,
    setValueAliases,
    revertValueAliases
} from '../utils'
import { v4 } from 'uuid'
import {
    Schema,
    Alias,
    useSuggestions,
    removeBrackets,
    removeLeadingExpression
} from '../../../../../hooks/use-suggestions'
import { parseSmartQuery, stringifySmartQuery } from '../../../../../utils'
import { stateManager } from '../../../../../StateManager'

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
        omitSuggestions: {
            type: Array as PropType<string[]>,
            default: () => [] as string[]
        },
        forbiddenKeys: {
            type: Array as PropType<string[]>,
            default: () => [] as string[]
        },
        strict: {
            type: Boolean,
            default: false
        },
        inputDebounce: {
            type: Number,
            default: 300
        }
    },
    emits: [
        'update:model-value',
        'focus',
        'blur',
        'input',
        'search',
        'error',
        'clear'
    ],
    setup(props, { emit }) {
        //#region refs
        const container = ref<HTMLDivElement>(null)
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
            omitSuggestions,
            height,
            width,
            forbiddenKeys,
            inputDebounce,
            placeholder
        } = toRefs(props)
        //#endregion

        //#region data
        const caretAt = ref(0)
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
        const suggestionsDropdown = ref(null)
        //#endregion

        //#region hooks
        // todo: these can be stale data. we need to update them on schema change.
        const { hasEllipsis } = useSizeObserver(input)
        const { suggestions, error, findSuggestions, checkErrors } =
            useSuggestions(schema, aliases, {
                strict,
                forbiddenKeys,
                omitSuggestions
            })
        //#endregion

        //#region methods
        const setInputValue = (
            value: string,
            options: { noEmit?: boolean; testCaret?: number } = {}
        ) => {
            const { noEmit, testCaret } = options

            showSuggestions.value = false

            // to handle typing . after accepting a suggestion
            if (/\s+\.$/.test(value)) {
                value = value.replace(/\s+\.$/, '.')
            }

            // to handle date suggestion modal to open automatically.
            if (value.includes('(dd/mm/yyyy)')) {
                value = value.trimEnd()
            }

            const specialSuggestions = suggestions.value.filter(
                (suggestion) =>
                    typeof suggestion === 'string' && suggestion.startsWith('.')
            )

            for (const suggestion of specialSuggestions) {
                if (value.includes(suggestion)) {
                    value = value.replace(` ${suggestion}`, suggestion)
                }
            }

            searchQuery.value = value

            // TODO
            // here the value is finalized - this should be inner function entry point

            // find value left side before current input value is altered by any code below
            // to match previous behavior, move the caret to the end if setInputValue has been passed new value
            caretAt.value =
                testCaret !== undefined
                    ? testCaret
                    : value === input.value.innerText
                    ? getSelectionOffset(input.value)[0]
                    : value.length

            if (value !== input.value.innerText) {
                input.value.innerHTML = value
            }

            updateEditor(input.value, editorStyle.value)
            setSelectionOffset(input.value, caretAt.value, caretAt.value)
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
                findSuggestions(value.substring(0, caretAt.value))
                checkErrors(value)
            })

            if (!noEmit) {
                emit('input', value)
            }
        }

        const setInputFromSuggestion = (suggestion: any) => {
            const value = '' + suggestion
            let stringValue = ''
            let caretPosition = 0
            if (searchQuery.value.length) {
                let queryLeftSide = searchQuery.value.substring(
                    0,
                    caretAt.value
                )
                let queryRightSide = searchQuery.value.substring(caretAt.value)

                if (['AND', 'OR'].includes(value)) {
                    // do not replace text if the value is AND or OR
                    const leftover = queryLeftSide.match(/\S+$/)?.[0] || ''
                    queryLeftSide =
                        queryLeftSide.replace(/\S+$/, '').trimEnd() + ' '
                    queryRightSide = leftover + queryRightSide
                } else if (value.startsWith('.')) {
                    // dot notation case
                    const words = queryLeftSide.trimEnd().split('.')
                    const lastWord = words.pop()
                    if (!value.startsWith('.' + lastWord)) {
                        words.push(lastWord)
                    }
                    queryLeftSide = words.join('.')
                } else if (queryLeftSide.endsWith(' ')) {
                    // caret after space: only replace multiple spaces on the left
                    queryLeftSide = queryLeftSide.trimEnd() + ' '
                } else if (/\.\S+$/.test(queryLeftSide)) {
                    // if there are dots in left side expression, suggestions have an operator
                    // looks like a bug in findSuggestions TODO find it - for now work around it here
                    const leftover = queryRightSide.match(/^\S+/)?.[0] || ''
                    queryLeftSide += leftover + ' '
                    queryRightSide = queryRightSide
                        .substring(leftover.length)
                        .trimStart()
                } else if (queryRightSide.startsWith(' ')) {
                    // this| situation: replace whatever is there on the left side with the value
                    queryLeftSide = queryLeftSide.replace(/\S+$/, '')
                    queryRightSide = queryRightSide.trimStart()
                } else {
                    // this|situation: replace whatever is there on both sides with the value
                    queryLeftSide = queryLeftSide.replace(/\S+$/, '')
                    queryRightSide =
                        removeLeadingExpression(queryRightSide).trimStart()
                }

                stringValue = queryLeftSide + value + ' ' + queryRightSide
                caretPosition = stringValue.length - queryRightSide.length
            } else {
                stringValue = value + ' '
                caretPosition = stringValue.length
            }

            setInputValue(stringValue)
            setSelectionOffset(input.value, caretPosition, caretPosition)
        }

        const debouncedSetInputValue = computed<any>(() => {
            if (stateManager?.disableDebounce) {
                return setInputValue
            }

            return debounce(setInputValue, inputDebounce.value)
        })

        let lastSearchQuery: string

        const updateJSONQuery = () => {
            try {
                const bracketless = removeBrackets(searchQuery.value)
                const cleanedAliases = revertAliases(bracketless, aliases.value)
                const json = toJSON(cleanedAliases)
                if (isValid.value && !isEqual(json, modelValue.value)) {
                    emit('update:model-value', json)
                }
                return json
            } catch (e) {
                emit('error', {
                    error: e,
                    message: 'Could not translate given JSON to a valid Scheme'
                })
                return null
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

        const debouncedSetInputFromModel = computed<any>(() => {
            if (stateManager?.disableDebounce) {
                return setInputFromModel
            }

            return debounce(setInputFromModel, inputDebounce.value)
        })

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
            if (suggestions.value.length) {
                showSuggestions.value = true
            }
            emit('focus')
        }

        const processBlur = () => {
            input.value.scrollLeft = 0
            input.value.scrollTop = 0
            focused.value = false
            expanded.value = true
            updateJSONQuery()
            emit('blur')
        }

        const blur = (e: Event) => {
            if (showDatePicker.value) {
                return
            }

            if (cancelBlur.value === 0) {
                if (showSuggestions.value) {
                    focused.value = true
                    return
                }

                if (!focused.value) {
                    return
                }

                processBlur()
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
            emit('clear')
            emit('search', {})
            if (!focused.value) {
                focus()
            }
            nextTick(() => {
                findSuggestions('')
                checkErrors('')
            })
        }

        const endsWithOperator = computed(() => {
            const operators = ['>=', '<=', '!=', '=', '>', '<', 'IN', 'NOT-IN']

            for (const op of operators) {
                if (
                    searchQuery.value.endsWith(op) ||
                    searchQuery.value.endsWith(`${op} `)
                ) {
                    return true
                }
            }

            return false
        })

        const onKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Escape' || e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()

                onEscapeKey()
                return
            }

            if (e.code === 'Enter' || e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()

                onEnterKey()
                return
            }

            if (!focused.value) {
                focus()
            }
        }

        const onInput = (e: Event) => {
            const text = (e.target as HTMLElement).textContent
            if (text.endsWith('.')) {
                setInputValue(text)
            } else {
                debouncedSetInputValue.value(text)
            }
        }

        const onDateSelection = (value: DateInterval) => {
            datePickerSelection.value = value
        }

        const onDateSelectionCancel = () => {
            searchQuery.value = removeDateInterval(searchQuery.value)
            showDatePicker.value = false
            showSuggestions.value = true
            datePickerSelection.value = null
            setInputValue(searchQuery.value + ' ', { noEmit: true })
            setCaretAtTheEnd(input.value)
        }

        const onDateSelectionApply = () => {
            searchQuery.value = replaceDateInterval(
                searchQuery.value,
                datePickerSelection.value
            )
            showDatePicker.value = false
            showSuggestions.value = true
            datePickerSelection.value = null
            setInputValue(searchQuery.value + ' ', { noEmit: true })
            setCaretAtTheEnd(input.value)
        }

        const readModelValue = (val: { [key: string]: any }) => {
            if (val) {
                const aliased = fromJSON(val)

                if (
                    aliased !== searchQuery.value.trim() ||
                    !input.value?.innerHTML.length
                ) {
                    nextTick(() => {
                        debouncedSetInputFromModel.value(aliased)
                    })
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

            return isValidJSON(json)
                ? revertValueAliases(json, schema.value)
                : searchQuery.value
        }

        const fromJSON = (value: { [key: string]: any }) => {
            try {
                const replacedDate = replaceJSDatesWithStringifiedDates(
                    value,
                    dateKeys.value
                )

                const stringQuery = stringifySmartQuery(
                    setValueAliases(replacedDate, schema.value)
                )
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

        const onEnterKey = (options: { fromSuggestion?: boolean } = {}) => {
            const { fromSuggestion } = options

            if (
                (!fromSuggestion && showSuggestions.value) ||
                showDatePicker.value
            ) {
                return
            }

            if (endsWithOperator.value) {
                return
            }

            if (!input.value.innerHTML.length) {
                return
            }

            if (!isValid.value) {
                return
            }

            if (lastSearchQuery !== searchQuery.value) {
                lastSearchQuery = searchQuery.value
                const toSearch = updateJSONQuery()
                if (toSearch) {
                    emit('search', toSearch)
                    showSuggestions.value = false
                }
            }
        }

        const onEscapeKey = () => {
            if (!focused.value) {
                return
            }

            if (showSuggestions.value) {
                showSuggestions.value = false
                return
            }

            input.value.blur()
            processBlur()
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

        const inputPlaceholder = computed<string>(() => {
            return focused.value || searchQuery.value.length
                ? ''
                : placeholder.value
        })

        const isValid = computed(() => {
            return computedStatus.value.type !== 'error'
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

        watch(focused, (value, old) => {
            if (old === value) {
                return
            }

            if (!value) {
                input.value.parentElement.style.width = '1px'
            } else {
                setMenuOffset(isEligibleToChange(input.value, value))
                input.value.parentElement.style.width = '100%'
            }
        })

        watch(showDatePicker, (value, old) => {
            if (old === value) {
                return
            }

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

        const watchMouseMove = () => {
            isTyping.value = false
        }

        const watchKeyUp = (e: KeyboardEvent) => {
            if (
                focused.value &&
                (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            ) {
                setInputValue(searchQuery.value, { noEmit: true })
            }
        }

        onMounted(() => {
            if (!expanded.value) {
                isOverflowing.value =
                    isEllipsisActive(input.value) || hasEllipsis.value
            }
            window.addEventListener('mousemove', watchMouseMove)
            window.addEventListener('keyup', watchKeyUp)
        })
        onBeforeUnmount(() => {
            window.removeEventListener('mousemove', watchMouseMove)
            window.removeEventListener('keyup', watchKeyUp)
        })

        return {
            uuid: v4(),
            suggestionsDropdown,
            container,
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
            onDateSelectionCancel,
            onDateSelectionApply,
            computedStatus,
            setInputFromSuggestion,
            inputPlaceholder,
            onEscapeKey,
            onEnterKey
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

    &__date-picker-buttons {
        padding: 0 16px 16px;
        text-align: right;
        > * {
            margin-left: 16px;
        }
    }
}
.focus {
    word-break: break-all;
    flex-wrap: wrap;
    white-space: pre-wrap;
}
</style>
