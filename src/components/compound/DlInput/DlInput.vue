<template>
    <div :id="uuid" style="display: block">
        <div :style="cssVars" :class="rootContainerClasses">
            <div class="row full-width full-height">
                <div
                    :class="`${isSmall ? 'col' : 'row  full-width'} top`"
                    :style="`${isSmall ? 'flex-grow: 0;' : ''}`"
                >
                    <div
                        v-if="!!title.length || !!tooltip.length"
                        :class="{
                            'dl-input__title-container': true,
                            'dl-input__title-container--s': isSmall
                        }"
                    >
                        <label
                            v-if="!!title.length"
                            class="dl-input__title"
                            :style="`${isSmall ? 'width: 90%' : 'width: 100%'}`"
                        >
                            <dl-ellipsis>
                                {{ title
                                }}<span
                                    v-if="required"
                                    :class="asteriskClasses"
                                >
                                    *</span
                                >
                                {{
                                    !required && optional ? ' (Optional)' : null
                                }}
                            </dl-ellipsis>
                        </label>
                        <span v-if="!!tooltip.length">
                            <dl-icon
                                class="dl-input__tooltip-icon"
                                icon="icon-dl-info"
                                size="12px"
                            />
                            <dl-tooltip>
                                {{ tooltip }}
                            </dl-tooltip>
                        </span>
                    </div>
                    <div v-if="!!topMessage.length && !isSmall" class="break" />
                    <div
                        v-if="!!topMessage.length"
                        :class="{
                            'dl-input__top-message-container': true,
                            'dl-input__top-message-container--s': isSmall
                        }"
                    >
                        <dl-info-error-message
                            v-if="!!topMessage.length"
                            position="above"
                            :value="topMessage"
                        />
                    </div>
                </div>
                <div
                    :class="`${
                        isSmall ? 'col' : 'row'
                    } bottom-section full-width full-height`"
                    :style="{ cursor: disabled ? 'not-allowed' : '' }"
                >
                    <div class="row center full-width full-height">
                        <div :class="wrapperClasses">
                            <div
                                v-if="hasPrepend"
                                :class="[
                                    ...adornmentClasses,
                                    'dl-input__adornment-container--pos-left'
                                ]"
                            >
                                <slot name="prepend" />
                            </div>
                            <div
                                ref="input"
                                :contenteditable="contenteditable"
                                :class="inputClasses"
                                :placeholder="placeholder"
                                :style="stylesInput"
                                @input="onChange"
                                @focus="onFocus"
                                @blur="onBlur"
                                @keydown="onKeydown"
                                @keyup.enter="onEnterPress"
                                @paste="handlePaste"
                                @mouseover="onHover"
                            />
                            <dl-tooltip v-if="showTooltip">
                                {{ spanText }}
                            </dl-tooltip>
                            <div
                                v-if="
                                    hasAppend ||
                                        showClearButton ||
                                        showShowPassButton
                                "
                                :class="[
                                    ...adornmentClasses,
                                    'dl-input__adornment-container--pos-right'
                                ]"
                                :style="styleAppend"
                            >
                                <slot v-if="hasAppend" name="append" />
                                <span
                                    v-if="showClearButton"
                                    class="dl-input__adornment-container--clear"
                                >
                                    <dl-button
                                        ref="input-clear-button"
                                        icon="icon-dl-close"
                                        :size="clearIconSize"
                                        text-color="dl-color-darker"
                                        flat
                                        fluid
                                        @click="onClear"
                                    />
                                    <dl-tooltip v-if="clearButtonTooltip">
                                        Remove text
                                    </dl-tooltip>
                                </span>
                                <span v-if="showShowPassButton">
                                    <dl-button
                                        ref="input-show-pass-button"
                                        :icon="passShowIcon"
                                        size="s"
                                        text-color="dl-color-darker"
                                        flat
                                        fluid
                                        @click="onPassShowClick"
                                    />
                                    <dl-tooltip>
                                        {{ showPass ? 'Hide' : 'Show' }}
                                    </dl-tooltip>
                                </span>
                            </div>
                        </div>
                        <dl-menu
                            v-if="showSuggestItems"
                            v-model="isMenuOpen"
                            auto-close
                            no-focus
                            :offset="[0, 3]"
                            fit-container
                            :fit-content="fitContent"
                            :arrow-nav-items="stringSuggestions"
                            @click="onMenuShow"
                            @highlighted-item="setHighlightedIndex"
                            @selected-item="handleSelectedItem"
                        >
                            <dl-list
                                bordered
                                :style="{ maxWidth: suggestMenuWidth }"
                            >
                                <dl-list-item
                                    v-for="(item, suggestIndex) in suggestItems"
                                    :key="item.suggestion"
                                    clickable
                                    style="font-size: 12px"
                                    :highlighted="
                                        suggestIndex === highlightedIndex
                                    "
                                    @click="onClick($event, item)"
                                >
                                    <img
                                        v-if="item.image"
                                        :src="item.image"
                                        class="dl-input__suggestion--image"
                                    />
                                    <span
                                        v-for="(word, index) in getSuggestWords(
                                            item.suggestion,
                                            modelValue
                                        )"
                                        :key="JSON.stringify(word) + index"
                                        :class="{
                                            'dl-input__suggestion--highlighted':
                                                word.highlighted
                                        }"
                                    >
                                        <span v-if="word.value[0] === ' '"
                                        >&nbsp;</span
                                        >
                                        {{ word.value }}
                                        <span
                                            v-if="
                                                word.value[
                                                    word.value.length - 1
                                                ] === ' '
                                            "
                                        >&nbsp;</span
                                        >
                                    </span>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </div>
                    <div class="row bottom full-width">
                        <div
                            v-if="bottomMessage"
                            class="row full-width dl-input__bottom-message-container"
                            style="justify-content: space-between"
                        >
                            <div>
                                <dl-info-error-message
                                    v-if="
                                        !!infoMessage.length &&
                                            !error &&
                                            !warning
                                    "
                                    position="below"
                                    :value="infoMessage"
                                />
                                <dl-info-error-message
                                    v-else-if="
                                        error &&
                                            !!errorMessage &&
                                            !!errorMessage.length
                                    "
                                    position="below"
                                    error
                                    :value="errorMessage"
                                />
                                <dl-info-error-message
                                    v-else-if="
                                        warning &&
                                            !!warningMessage &&
                                            !!warningMessage.length &&
                                            !error
                                    "
                                    position="below"
                                    warning
                                    :value="warningMessage"
                                />
                            </div>
                            <div>
                                <span
                                    v-if="
                                        showCounter &&
                                            maxLength &&
                                            maxLength > 0
                                    "
                                    class="dl-input__counter"
                                >
                                    {{ characterCounter }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="files.length" class="dl-input__files">
                    <input-file-element
                        v-for="file in files"
                        :key="file.id"
                        :file="file"
                        @remove-file="emitRemoveFile"
                        @zoom-image="handleZoomImage"
                        @rename-file="handleRenameFileModal"
                    />
                </div>
            </div>
            <dl-dialog-box
                v-if="currentZoomImage"
                v-model="zoomImageModel"
                volatile
                width="60vw"
                style="--dl-dialog-box-content-padding: 0"
            >
                <template #body>
                    <img class="dl-input__zoom-image" :src="currentZoomImage" />
                </template>
            </dl-dialog-box>
            <dl-dialog-box
                v-model="renameFileModel"
                volatile
                :style="`--dl-dialog-box-header-height: 25px;
                     --dl-dialog-box-footer-height: 25px;`"
            >
                <template #header>
                    <dl-dialog-box-header
                        title="Rename File"
                        close-button
                        @onClose="renameFileModel = false"
                    />
                </template>
                <template #body>
                    <dl-input
                        v-model="newFileName"
                        title="Name"
                        red-asterisk
                        min-width="80%"
                        hide-clear-button
                        :placeholder="`Enter new file ${currentFile.name}`"
                    />
                </template>
                <template #footer>
                    <dl-dialog-box-footer>
                        <div style="display: flex; justify-content: flex-end">
                            <dl-button @click="handleRenameFile">
                                Rename
                            </dl-button>
                        </div>
                    </dl-dialog-box-footer>
                </template>
            </dl-dialog-box>
            <div v-if="hasAction" class="dl-input__action">
                <slot name="action" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { debounce as debounceFunc, cloneDeep } from 'lodash'
import {
    computed,
    defineComponent,
    PropType,
    ref,
    toRefs,
    nextTick,
    watch
} from 'vue-demi'
import { DlInfoErrorMessage, DlTooltip } from '../../shared'
import { DlListItem } from '../../basic'
import { DlMenu, DlIcon, DlList, DlEllipsis } from '../../essential'
import {
    DlDialogBox,
    DlDialogBoxHeader,
    DlDialogBoxFooter
} from '../../compound/DlDialogBox'
import { DlButton } from '../../basic'
import { InputSizes, TInputSizes } from '../../../utils/input-sizes'
import {
    addEventListenersToElement,
    clearSuggestion,
    getSuggestItems,
    isArrayBufferImage,
    readBlob,
    readClipboard,
    setInnerHTMLWithCursor
} from './utils'
import { v4 } from 'uuid'
import { setCaretAtTheEnd } from '../../../utils'
import { DlInputFile, DlInputSuggestion } from './types'
import InputFileElement from './components/InputFileElement.vue'
import { stateManager } from '../../../StateManager'

export default defineComponent({
    name: 'DlInput',
    components: {
        DlButton,
        DlIcon,
        DlTooltip,
        DlInfoErrorMessage,
        DlMenu,
        DlList,
        DlListItem,
        DlEllipsis,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        InputFileElement
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        /**
         * The text value of the input
         */
        modelValue: {
            type: [String, Number],
            default: null as string
        },
        /**
         * An array of InputFile objects contained and modeled in the input
         */
        files: {
            type: Array as PropType<DlInputFile[]>,
            default: (): DlInputFile[] => []
        },
        /**
         * Input height
         */
        height: {
            type: String,
            default: null
        },
        /**
         * Input max height
         */
        maxHeight: {
            type: String,
            default: '100px'
        },
        /**
         * The input will expand like a textarea while typing
         */
        expandable: {
            type: Boolean,
            default: false
        },
        /**
         * Input width
         */
        width: {
            type: String,
            default: '100%'
        },
        /**
         * Input max-width
         */
        maxWidth: {
            type: String,
            default: 'fit-content'
        },
        /**
         * General size: s,m,l
         */
        size: {
            type: String as PropType<TInputSizes>,
            default: InputSizes.l
        },
        /**
         * Input placeholder
         */
        placeholder: {
            type: String,
            default: ''
        },
        /**
         * Text to be displayed above the input as title
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * Whether or not this field is required
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * Whether or not this field is optional
         */
        optional: {
            type: Boolean,
            default: false
        },
        /**
         * Text to be displayed in a tooltip while hovering over the info icon
         */
        tooltip: {
            type: String,
            default: ''
        },
        /**
         * Type "password" will mask the characters
         */
        type: {
            type: String,
            default: 'text'
        },
        /**
         * Message displayed above the input
         */
        topMessage: {
            type: String,
            default: ''
        },
        /**
         * Input will have a red asterisk
         */
        redAsterisk: {
            type: Boolean,
            default: false
        },
        /**
         * Message to be displayed when in info mode
         */
        infoMessage: {
            type: String,
            default: ''
        },
        /**
         * Message to be displayed when in error mode
         */
        errorMessage: {
            type: String,
            default: ''
        },
        /**
         * Input will be in error mode
         */
        error: {
            type: Boolean,
            default: false
        },
        /**
         * Message to be displayed when in warning mode
         */
        warningMessage: {
            type: String,
            default: ''
        },
        /**
         * Input will be in warning mode
         */
        warning: {
            type: Boolean,
            default: false
        },
        /**
         * Input will be disabled
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Input will be readonly
         */
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * Maximum amount of characters the user can type
         */
        maxLength: {
            type: Number,
            default: null
        },
        /**
         * Input will show a counter for how many characters have been typed
         */
        showCounter: {
            type: Boolean,
            default: false
        },
        /**
         * Input will be in dense mode
         */
        dense: Boolean,
        /**
         * Input will not have a clear text button
         */
        hideClearButton: {
            type: Boolean,
            default: false
        },
        /**
         * Count the characters backwards
         */
        counterReverse: {
            type: Boolean,
            default: false
        },
        /**
         * An array of InputSuggestion objects containing the suggestions the input will show while typing
         */
        autoSuggestItems: {
            type: Array as PropType<DlInputSuggestion[]>,
            default: (): DlInputSuggestion[] => []
        },
        /**
         * Highlight when a suggestion is matched
         */
        highlightMatches: {
            type: Boolean,
            default: false
        },
        /**
         * Width of the suggestion menu
         */
        suggestMenuWidth: {
            type: String,
            default: 'auto'
        },
        /**
         * Tooltip showed when hovering over the clear button
         */
        clearButtonTooltip: {
            type: Boolean,
            default: false
        },
        /**
         * Input will be  in fit-content mode
         */
        fitContent: Boolean,
        /**
         * CSS margin for input
         */
        margin: {
            type: String,
            default: null
        },
        /**
         * The color of the highlighted text
         */
        syntaxHighlightColor: {
            type: String,
            default: 'var(--dl-color-secondary)'
        },
        /**
         * Debounce time for input
         */
        debounce: {
            type: Number,
            default: 100
        },
        /**
         * Auto trim input value after debounce time
         */
        autoTrim: {
            type: Boolean,
            default: false
        },
        /**
         * Debounce time for input
         */
        trimDebounce: {
            type: Number,
            default: 500
        },
        styleAppend: {
            type: String,
            default: ''
        },
        stylesInput: {
            type: String,
            default: ''
        }
    },
    emits: [
        'input',
        'focus',
        'blur',
        'clear',
        'enter',
        'file-update',
        'update:model-value',
        'suggestion-click',
        'keydown'
    ],
    setup(props, { emit }) {
        const mouseOverClear = ref(false)
        const highlightedIndex = ref(-1)
        const isMenuOpen = ref(false)
        const {
            modelValue,
            autoSuggestItems,
            maxLength,
            files,
            syntaxHighlightColor,
            placeholder,
            readonly,
            disabled,
            autoTrim,
            debounce,
            trimDebounce,
            type
        } = toRefs(props)

        const isInternalChange = ref(false)

        const suggestItems = computed<DlInputSuggestion[]>(() => {
            if (!modelValue.value) return []
            return getSuggestItems(
                autoSuggestItems.value,
                modelValue.value?.toString()
            ) as DlInputSuggestion[]
        })
        const input = ref(null)

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value
        }
        const handleSelectedItem = (value: any) => {
            onAutoSuggestClick(null, value)
        }

        const handleValueTrim = () => {
            const trimmed = String(modelValue.value).trim()
            if (trimmed !== String(modelValue.value)) {
                isInternalChange.value = true

                input.value.innerHTML = trimmed
                    .toString()
                    .replace(/ /g, '&nbsp;')
                updateSyntax()
                setCaretAtTheEnd(input.value)

                const toEmit = trimmed.replace(new RegExp('&nbsp;', 'g'), ' ')
                emit('input', toEmit)
                emit('update:model-value', toEmit)
            }
        }

        const debouncedHandleValueTrim = computed<Function>(() => {
            if (stateManager.disableDebounce) {
                return handleValueTrim.bind(this)
            }
            const debounced = debounceFunc(
                handleValueTrim.bind(this),
                trimDebounce.value ?? 50
            )
            return debounced
        })

        const isValidNumber = (input: string | number) => {
            const parsedNumber = Number(String(input))
            return (
                !isNaN(parsedNumber) &&
                isFinite(parsedNumber) &&
                !/[eE]/.test(String(input)) &&
                parsedNumber >= Number.MIN_SAFE_INTEGER &&
                parsedNumber <= Number.MAX_SAFE_INTEGER
            )
        }

        const onChange = (e: KeyboardEvent | Event) => {
            isInternalChange.value = true
            isMenuOpen.value = true

            const target = e.target as HTMLElement
            let toEmit: string | number = target.innerText.replace(
                new RegExp('&nbsp;|\u00A0', 'g'),
                ' '
            )

            if (type.value === 'number') {
                if (toEmit === '') {
                    toEmit = '0'
                }

                const isValid = isValidNumber(toEmit)
                if (!isValid) {
                    const trimmed = String(modelValue.value).trim()
                    input.value.innerHTML = trimmed
                        .toString()
                        .replace(/ /g, '&nbsp;')
                    setCaretAtTheEnd(input.value)
                } else if (
                    /**
                     * if the number ends with a dot followed by multiple zeros
                     * then we should not replace the inputs value with the parsed number
                     */
                    !toEmit.endsWith('.') &&
                    !new RegExp(/\.\d*0+$/, 'g').test(toEmit)
                ) {
                    input.value.innerHTML = String(Number(toEmit))
                        .toString()
                        .replace(/ /g, '&nbsp;')
                    setCaretAtTheEnd(input.value)
                }

                toEmit = Number(toEmit)
            }

            updateSyntax()

            emit('input', toEmit, e)
            emit('update:model-value', toEmit)
            if (autoTrim.value) {
                debouncedHandleValueTrim.value()
            }
        }

        const onAutoSuggestClick = (e: Event, item: string): void => {
            const newValue = clearSuggestion(modelValue.value.toString(), item)
            if (!maxLength.value || newValue.length < maxLength.value) {
                const toEmit = newValue.replace(new RegExp('&nbsp;', 'g'), ' ')
                emit('input', toEmit, e)
                emit('update:model-value', toEmit)
                input.value.innerHTML = toEmit.replace(/ /g, '&nbsp;')
                setCaretAtTheEnd(input.value)
                isInternalChange.value = true
            }
        }

        const emitAddFile = (file: DlInputFile) => {
            const newFiles = cloneDeep(files.value)
            newFiles.push(file)
            emit('file-update', newFiles)
        }
        const emitRemoveFile = (fileId: string) => {
            emit(
                'file-update',
                files.value.filter((file) => file.id !== fileId)
            )
        }

        const isSpecialWord = (word: string) => {
            return (
                word.startsWith('@') ||
                autoSuggestItems.value.some(
                    (s) => s.suggestion?.trim() === word?.trim()
                )
            )
        }

        const updateSyntax = () => {
            setInnerHTMLWithCursor(input.value, (text) => {
                const words = text.split(' ').map((word) => {
                    if (isSpecialWord(word)) {
                        return `<span class="clickable" style="color: ${syntaxHighlightColor.value}">${word}</span>`
                    }
                    if (word.startsWith('<')) {
                        return `<span>${word
                            .replace('<', '&lt;')
                            .replace('>', '&gt;')}</span>`
                    }
                    return word
                })
                input.value.innerHTML = words.join(' ')
            })
            Array.from(input.value.children).forEach((el: any) => {
                if (!isSpecialWord(el.innerText)) return
                addEventListenersToElement(el, {
                    click: () => {
                        emit('suggestion-click', el.innerText)
                    }
                })
            })
        }

        const stringSuggestions = computed<string[]>(() => {
            return suggestItems.value.map((item) => item.suggestion)
        })

        const showPlaceholder = computed<boolean>(
            () =>
                modelValue.value === null ||
                modelValue.value === undefined ||
                !String(modelValue.value)?.length
        )

        const spanText = computed<string>(() => {
            if (showPlaceholder.value) {
                return placeholder.value
            }
            return modelValue.value?.toString()
        })

        const onModelValueChange = (val: string | number) => {
            if (val !== null && val !== undefined) {
                if (val === input.value.innerHTML) {
                    return
                }

                input.value.innerHTML = val.toString().replace(/ /g, '&nbsp;')
            }
            isInternalChange.value = false
        }

        const debouncedOnModelValueChange = computed<Function>(() => {
            if (stateManager.disableDebounce) {
                return onModelValueChange
            }
            const debounced = debounceFunc(
                onModelValueChange,
                debounce.value ?? 50
            )
            return debounced
        })

        const firstTime = ref(true)

        watch(
            modelValue,
            (val: string | number) => {
                if (isInternalChange.value) {
                    isInternalChange.value = false
                    return
                }

                nextTick(() => {
                    if (firstTime.value) {
                        if (readonly.value || disabled.value) {
                            prevInputValue.value = String(val)
                            input.value.innerHTML = placeHolderHTML.value
                        } else {
                            onModelValueChange(val)
                        }

                        firstTime.value = false
                        return
                    }
                    debouncedOnModelValueChange.value(val)
                })
            },
            { immediate: true }
        )

        const placeHolderHTML = computed<string>(() => {
            let classes = ''
            if (showPlaceholder.value) {
                classes += 'placeholder-string'
            }
            if (disabled.value) {
                classes += ' placeholder-string--disabled'
            }

            return `<span class="${classes}">${spanText.value}</span>`
        })

        const contenteditable = computed<boolean>(() => {
            return !disabled.value && !readonly.value
        })

        const prevInputValue = ref('')
        watch([disabled, readonly], (value) => {
            if (!input.value) {
                return
            }

            if (value[0] || value[1]) {
                prevInputValue.value = input.value.innerHTML
                input.value.innerHTML = placeHolderHTML.value
            } else {
                input.value.innerHTML = prevInputValue.value
            }
        })

        return {
            suggestItems,
            highlightedIndex,
            onAutoSuggestClick,
            onChange,
            isMenuOpen,
            setHighlightedIndex,
            handleSelectedItem,
            mouseOverClear,
            input,
            emitAddFile,
            emitRemoveFile,
            updateSyntax,
            stringSuggestions,
            showPlaceholder,
            spanText,
            handleValueTrim: debouncedHandleValueTrim,
            onModelValueChange: debouncedOnModelValueChange,
            isInternalChange,
            contenteditable
        }
    },
    data() {
        return {
            uuid: `dl-input-${v4()}`,
            showPass: false,
            zoomImageModel: false,
            renameFileModel: false,
            currentZoomImage: null,
            currentFile: null,
            newFileName: null,
            focused: false,
            showTooltip: false
        }
    },
    computed: {
        bottomMessage(): boolean {
            return (
                !!this.infoMessage?.length ||
                !!this.errorMessage?.length ||
                !!this.warningMessage?.length ||
                this.showCounter
            )
        },
        rootContainerClasses(): string[] {
            const classes = ['dl-input']
            if (this.isSmall) {
                classes.push('dl-input--s')
            }
            if (this.dense) {
                classes.push('dl-input--dense')
            }
            return classes
        },
        getBorderColor(): string {
            if (this.error) {
                return `var(--dell-red-500)`
            } else if (this.warning) {
                return `var(--dell-yellow-500)`
            } else {
                return `var(--dell-blue-500)`
            }
        },
        cssVars(): Record<string, any> {
            let inputMargin = this.margin

            if (!this.margin && this.isSmall) {
                inputMargin = '0px 20px 0px 0px'
            }
            return {
                '--dl-input-margin': inputMargin,
                '--dl-input-border-color-hover': this.getBorderColor,
                '--dl-input-height': this.height ? this.height : null,
                '--dl-input-align-items':
                    this.expandable || this.height ? 'flex-start' : 'center',
                '--dl-input-max-width': this.maxWidth,
                '--dl-input-width': this.width,
                '--dl-input-max-height': this.maxHeight,
                '--dl-input-white-space': this.expandable ? 'normal' : 'nowrap'
            }
        },
        inputClasses(): string[] {
            const classes = ['dl-input__input', `dl-input__input--${this.size}`]

            if (this.hasPrepend) {
                classes.push('dl-input__input--prepend')
            }
            if (
                this.hasAppend ||
                this.showClearButton ||
                this.showShowPassButton
            ) {
                classes.push('dl-input__input--append')
            }
            if (this.hasPrepend && this.hasAppend) {
                classes.push('dl-input__input--both-adornments')
            }
            if (this.type === 'password' && !this.showPass) {
                classes.push('dl-input__input--password')
            }

            if (this.disabled) {
                classes.push('dl-input__input--disabled')
            }

            if (this.inputLength) {
                classes.push('dl-input__input--text-color')
            } else {
                classes.push('dl-input__input--placeholder-color')
            }

            return classes
        },
        asteriskClasses(): string[] {
            const classes = ['dl-input__asterisk']

            if (this.redAsterisk) {
                classes.push('dl-input__asterisk--red')
            }

            return classes
        },
        adornmentClasses(): string[] {
            return [
                'dl-input__adornment-container',
                `dl-input__adornment-container--${this.size}`,
                `dl-input__adornment-container--${
                    this.expandable ? 'expandable' : ''
                }`
            ]
        },
        isSmall(): boolean {
            return (
                this.size === (InputSizes.s as TInputSizes) ||
                this.size === (InputSizes.small as TInputSizes)
            )
        },
        hasPrepend(): boolean {
            return !!this.$slots.prepend
        },
        hasAppend(): boolean {
            return !!this.$slots.append && !this.isSmall
        },
        hasAction(): boolean {
            return !!this.$slots.action && !this.isSmall
        },
        clearIconSize(): string {
            if (this.isSmall) return 'xs'
            return 'm'
        },
        passShowIcon(): string {
            return this.showPass ? 'icon-dl-hide' : 'icon-dl-show'
        },
        showClearButton(): boolean {
            return (
                !this.hideClearButton &&
                this.type !== 'password' &&
                !this.disabled &&
                !this.readonly &&
                !!this.modelValue
            )
        },
        showShowPassButton(): boolean {
            return !this.$slots.append && this.type === 'password'
        },
        showSuggestItems(): boolean {
            return !!this.suggestItems?.length && !!this.modelValue
        },
        debouncedBlur(): any {
            if (stateManager.disableDebounce) {
                return this.onBlur.bind(this)
            }
            const debounced = debounceFunc(
                this.onBlur.bind(this),
                this.debounce ?? 50
            )
            return debounced
        },
        inputLength(): number {
            return `${this.modelValue}`.length
        },
        isWithinMaxLength(): boolean {
            return !this.maxLength || this.inputLength < this.maxLength
        },
        characterCounter(): string {
            if (!this.maxLength) {
                return ''
            }

            const chars = this.counterReverse
                ? this.maxLength - this.inputLength
                : this.inputLength

            return `${chars}/${this.maxLength}`
        },
        wrapperClasses(): string[] {
            const classes = [
                'dl-input__wrapper',
                `dl-input__wrapper--${this.size}`
            ]
            if (this.disabled) {
                classes.push('dl-input__wrapper--disabled')
            }
            if (this.error) {
                classes.push('dl-input__wrapper--error')
            } else if (this.warning) {
                classes.push('dl-input__wrapper--warning')
            }
            if (this.readonly) {
                classes.push('dl-input__wrapper--readonly')
            }

            return classes
        }
    },
    methods: {
        onHover() {
            const inputRef = this.$refs.input as HTMLInputElement
            if (!inputRef) {
                return
            }

            if (inputRef?.scrollWidth > inputRef?.clientWidth) {
                this.showTooltip = true
            } else {
                this.showTooltip = false
            }
        },
        onKeydown(e: KeyboardEvent) {
            if (this.readonly || this.disabled) {
                return
            }

            this.$emit('keydown', e)

            if (e.key !== 'Backspace') {
                /**
                 * Allow only numbers
                 * Allow decimal point
                 * Allow arrow keys
                 * Allow delete
                 * Allow control/meta keys
                 * Allow select all
                 */
                if (
                    this.type === 'number' &&
                    !/^[\d.]$/.test(e.key) &&
                    ![
                        'ArrowLeft',
                        'ArrowRight',
                        'Backspace',
                        'Delete',
                        'Control',
                        'Meta',
                        'a'
                    ].includes(e.key) &&
                    !(e.ctrlKey || e.metaKey)
                ) {
                    e.preventDefault()
                    return
                }
                if (!this.isWithinMaxLength) {
                    e.preventDefault()
                    return
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    return
                }
            }
        },
        onClick(e: Event, item: DlInputSuggestion) {
            this.onAutoSuggestClick(e, item.suggestion)
        },
        async handlePaste() {
            const content = await readClipboard()

            for (const item of content) {
                if (item.type === 'text/plain') {
                    return
                }
            }

            for (const item of content) {
                const data = await readBlob(item.data)
                if (isArrayBufferImage(data)) {
                    const objectUrl = URL.createObjectURL(item.data)
                    this.emitAddFile({
                        id: v4(),
                        name: `new_image_${this.files.length + 1}`,
                        image: objectUrl,
                        data
                    })
                }
            }
        },
        handleZoomImage(file: DlInputFile) {
            this.currentZoomImage = file.image
            this.zoomImageModel = true
        },
        handleRenameFileModal(file: DlInputFile) {
            this.currentFile = file
            this.renameFileModel = true
        },
        handleRenameFile() {
            const newFiles = cloneDeep(this.files)
            const fileToRenameIndex = newFiles.findIndex(
                (file) => file.id === this.currentFile.id
            )
            newFiles[fileToRenameIndex].name = this.newFileName
            this.$emit('file-update', newFiles)
            this.renameFileModel = false
        },
        focus(): void {
            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.focus()
        },
        onFocus(e: InputEvent): void {
            this.handleValueTrim()
            const el = e.target as HTMLElement
            if (this.modelValue) {
                el.scroll(el.scrollWidth, 0)
            }
            this.focused = true
            this.$emit('focus', e)
        },
        blur(): void {
            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.blur()
        },
        onBlur(e: InputEvent): void {
            const el = e.target as HTMLElement
            el.innerText = (el.innerText ?? '').endsWith('.')
                ? el.innerText.slice(0, -1)
                : el.innerText
            el.scroll(0, 0)
            this.focused = false
            this.$emit('blur', e)
            this.handleValueTrim()
        },
        onEnterPress(e: any): void {
            this.$emit('enter', e.target.innerText, e)
        },
        onClear(e: any): void {
            this.$emit('clear', this.modelValue)
            const clearValue = this.type === 'number' ? null : ''
            this.$emit('input', clearValue, e)
            this.$emit('update:model-value', clearValue)

            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.innerHTML = ''
            inputRef.focus()
        },
        onPassShowClick(): void {
            this.showPass = !this.showPass
        },
        onMenuShow(): void {
            this.focus()
        },
        getSuggestWords(
            item: string,
            keyword: string | number
        ): { value: string; highlighted: boolean }[] {
            const words: { value: string; highlighted: boolean }[] = []
            const key = `${keyword}`

            if (!key.length || !this.highlightMatches) {
                return [
                    {
                        value: item,
                        highlighted: false
                    }
                ]
            }

            const regex = new RegExp(key, 'g')

            const matches = [...item.matchAll(regex)]

            if (!matches.length) {
                return [
                    {
                        value: item,
                        highlighted: false
                    }
                ]
            }

            if (matches[0].index !== 0) {
                words.push({
                    value: item.split('').slice(0, matches[0].index).join(''),
                    highlighted: false
                })
            }

            matches.forEach(
                (match: RegExpMatchArray, iterationIndex: number) => {
                    const matchIndex = match.index ?? 0
                    const wordEndIndex = matchIndex + key.length

                    words.push({
                        value: item
                            .split('')
                            .slice(matchIndex, key.length + matchIndex)
                            .join(''),
                        highlighted: true
                    })

                    if (iterationIndex + 1 === matches.length) {
                        words.push({
                            value: item
                                .split('')
                                .slice(wordEndIndex, item.length)
                                .join(''),
                            highlighted: false
                        })
                    }

                    if (iterationIndex + 1 < matches.length) {
                        words.push({
                            value: item
                                .split('')
                                .slice(
                                    wordEndIndex,
                                    matches[iterationIndex + 1].index
                                )
                                .join(''),
                            highlighted: false
                        })
                    }
                }
            )

            return words
        }
    }
})
</script>

<style scoped lang="scss">
[contenteditable='true']:empty:before {
    content: attr(placeholder);
    display: inline;
    opacity: 1;
    -webkit-text-security: none;
}

.dl-input {
    display: flex;
    align-items: center;
    margin: var(--dl-input-margin);

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }

    &--dense {
        padding: 0;
    }

    &__title-container {
        margin-bottom: 6px;
        display: flex;
        align-items: center;

        &--small,
        &--s {
            margin-bottom: 0;
            margin-right: 4px;
        }
    }

    &__title {
        color: var(--dl-color-medium);
        font-size: var(--dl-font-size-body);
        text-align: left;
        margin-right: 5px;
        white-space: nowrap;
    }

    &__asterisk {
        color: var(--dl-color-medium);
        font-size: var(--dl-font-size-body);
        user-select: none;

        &--red {
            color: var(--dl-color-negative);
        }
    }

    &__tooltip-icon {
        color: var(--dl-color-medium);
    }

    &__top-message-container {
        display: flex;
        margin-bottom: 10px;
        text-align: start;

        &--s {
            padding: 0px 10px;
        }
        &--small {
            padding: 0px 10px;
        }
    }

    &__wrapper {
        // flex-grow: 1;
        position: relative;
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--dell-gray-500);
        min-width: var(--dl-input-width);
        max-width: var(--dl-input-max-width);
        max-height: var(--dl-input-max-height);
        height: var(--dl-input-height);

        &--readonly {
            border-color: var(--dell-gray-500) !important;
        }

        &:hover {
            border-color: var(--dell-gray-800);
        }
        &--error {
            border-color: var(--dl-color-negative);
        }
        &--warning {
            border-color: var(--dl-input-border-color-hover);
        }
        &--disabled {
            border-color: var(--dell-gray-500);
            color: var(--dl-color-disabled);
            cursor: not-allowed;
        }
        &--s {
            height: 18px;
        }
        &--m {
            height: 26px;
        }
    }

    &__input {
        display: inline-block;
        font-family: Arial, Helvetica, sans-serif;
        border-right: none;
        border-radius: 0px;
        white-space: var(--dl-input-white-space);
        font-size: var(--dl-font-size-body);
        overflow: hidden scroll;
        text-overflow: ellipsis;
        box-sizing: content-box;
        word-wrap: break-word;
        outline: none;
        background: none;
        transition: border 0.3s;
        min-height: 10px;
        padding: 10px;
        position: relative;
        line-height: 10px;
        width: 100%;

        &--text-color {
            color: var(--dell-gray-800);
        }
        &--placeholder-color {
            color: var(--dell-gray-500);
        }

        &--prepend {
            width: calc(100% - 10px - 28px);
        }

        &--append {
            margin-right: 10px;
        }

        &--both-adornments {
            width: calc(100% - 28px - 28px);
        }

        &--l {
            min-height: 16px;
            line-height: 16px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        &--large {
            line-height: 16px;
            padding-top: 10px;
            padding-bottom: 10px;
        }

        &--m {
            height: 12px;
            line-height: 12px;
            padding-top: 7px;
            padding-bottom: 7px;
        }
        &--medium {
            padding-top: 7px;
            padding-bottom: 7px;
        }

        &--s {
            padding-top: 4px;
            padding-bottom: 4px;
            padding-right: 5px;
        }
        &--small {
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 5px;
            padding-right: 5px;
        }

        &--password {
            -webkit-text-security: disc;
        }

        .placeholder-string,
        &::placeholder {
            color: var(--dl-color-lighter);
            opacity: 1;
        }

        &:hover {
            border-color: var(--dl-input-border-color-hover);
        }

        &:focus {
            border-color: var(--dl-input-border-color-hover);
            text-overflow: clip;
        }

        &:read-only {
            border-color: var(--dl-color-separator);
            cursor: text;
            &:hover {
                border-color: var(--dl-color-separator) !important;
            }
        }

        .placeholder-string--disabled,
        &--disabled {
            color: var(--dl-color-disabled);
            cursor: not-allowed;
        }
    }

    &__adornment-container {
        display: flex;
        justify-content: flex-end;
        align-items: var(--dl-input-align-items);
        flex: 0 0 22px;
        &--expandable {
            margin-top: 3px;
            margin-right: 3px;
            &.dl-input__adornment-container--l {
                margin-top: 5px;
                margin-right: 5px;
            }
        }

        &--s {
            height: 100%;
        }
    }

    &__bottom-message-container {
        display: flex;
        justify-content: space-between;
        text-align: left;
        padding-top: 3px;
    }

    &__counter {
        margin-left: 10px;
        font-size: var(--dl-font-size-body);
        color: var(--dl-color-darker);
    }

    &__suggestion {
        &--highlighted {
            background-color: var(--dl-color-warning);
            border-radius: 2px;
            color: var(--dl-color-text-darker-buttons);
        }
        &--image {
            margin-right: 5px;
            border-radius: 50%;
            height: 30px;
            width: 30px;
        }
    }

    &__files {
        display: flex;
        gap: 16px;
        overflow-y: scroll;
    }

    &__zoom-image {
        width: 100%;
        object-fit: contain;
    }

    &__action {
        width: fit-content;
        display: flex;
        align-items: center;
        margin-left: 10px;
    }

    .clickable:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>
