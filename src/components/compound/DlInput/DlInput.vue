<template>
    <div
        :id="uuid"
        :style="cssVars"
        :class="rootContainerClasses"
    >
        <div class="row">
            <div
                :class="`${
                    isSmall ? 'col' : 'row  full-width  full-height'
                } top`"
                :style="`${isSmall ? 'flex-grow: 0; max-width: 25%;' : ''}`"
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
                                *</span>
                            {{ !required && optional ? ' (Optional)' : null }}
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
                <div
                    v-if="!!topMessage.length && !isSmall"
                    class="break"
                />
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
            >
                <div class="row center full-width full-height">
                    <div
                        :class="wrapperClasses"
                        :disabled="disabled"
                    >
                        <div
                            ref="input"
                            :contenteditable="!readonly"
                            :class="inputClasses"
                            :placeholder="placeholder"
                            @input="onChange"
                            @focus="onFocus"
                            @blur="onBlur"
                            @keydown="onKeydown"
                            @keyup.enter="onEnterPress"
                            @paste="handlePaste"
                        >
                            <span v-if="readonly">{{ modelValue }}</span>
                        </div>
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
                            v-if="hasAppend"
                            :class="[
                                ...adornmentClasses,
                                'dl-input__adornment-container--pos-right'
                            ]"
                        >
                            <slot name="append" />
                            <span
                                v-if="showClearButton"
                                v-show="focused || mouseOverClear"
                                class="dl-input__adornment-container--clear"
                                @mouseenter="mouseOverClear = true"
                                @mouseleave="mouseOverClear = false"
                            >
                                <dl-button
                                    ref="input-clear-button"
                                    icon="icon-dl-close"
                                    size="s"
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
                    <div
                        v-if="hasAction"
                        style="
                            width: fit-content;
                            display: flex;
                            align-items: center;
                            margin-left: 10px;
                        "
                    >
                        <slot name="action" />
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
                        @highlightedIndex="setHighlightedIndex"
                        @handleSelectedItem="handleSelectedItem"
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
                                :highlighted="suggestIndex === highlightedIndex"
                                @click="onClick($event, item.suggestion)"
                            >
                                <img
                                    v-if="item.image"
                                    :src="item.image"
                                    class="dl-input__suggestion--image"
                                >
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
                                    <span v-if="word.value[0] === ' '">&nbsp;</span>
                                    {{ word.value }}
                                    <span
                                        v-if="
                                            word.value[
                                                word.value.length - 1
                                            ] === ' '
                                        "
                                    >&nbsp;</span>
                                </span>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </div>
                <div class="row bottom full-width full-height">
                    <div
                        v-if="bottomMessage"
                        class="row full-width dl-input__bottom-message-container"
                        style="justify-content: space-between"
                    >
                        <div>
                            <dl-info-error-message
                                v-if="
                                    !!infoMessage.length && !error && !warning
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
                                v-if="showCounter && maxLength && maxLength > 0"
                                class="dl-input__counter"
                            >
                                {{ characterCounter }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="files.length"
            class="dl-input__files"
        >
            <input-file-element
                v-for="file in files"
                :key="file.id"
                :file="file"
                @remove-file="emitRemoveFile"
                @zoom-image="handleZoomImage"
                @rename-file="handleRenameFileModal"
            />
        </div>
        <dl-dialog-box
            v-if="currentZoomImage"
            v-model="zoomImageModel"
            volatile
            width="60vw"
            style="--dl-dialog-box-content-padding: 0"
        >
            <template #body>
                <img
                    class="dl-input__zoom-image"
                    :src="currentZoomImage"
                >
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
    </div>
</template>

<script lang="ts">
import { debounce, cloneDeep } from 'lodash'
import { computed, defineComponent, PropType, ref } from 'vue-demi'
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
    clearSuggestion,
    getSuggestItems,
    isArrayBufferImage,
    readBlob,
    readClipboard,
    setInnerHTMLWithCursor
} from './utils'
import { v4 } from 'uuid'
import { setCaretAtTheEnd } from '../../../utils'
import { InputFile, InputSuggestion } from './types'
import InputFileElement from './components/InputFileElement.vue'

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
        modelValue: {
            type: [String, Number],
            default: null
        },
        files: {
            type: Array as PropType<InputFile[]>,
            default: (): InputFile[] => []
        },
        height: {
            type: String,
            default: null
        },
        maxHeight: {
            type: String,
            default: '100px'
        },

        expandable: {
            type: Boolean,
            default: false
        },
        maxWidth: {
            type: String,
            default: '200px'
        },
        minWidth: {
            type: String,
            default: '200px'
        },
        size: {
            type: String as PropType<TInputSizes>,
            default: InputSizes.l
        },
        placeholder: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        optional: {
            type: Boolean,
            default: false
        },
        tooltip: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        topMessage: {
            type: String,
            default: ''
        },
        redAsterisk: {
            type: Boolean,
            default: false
        },
        infoMessage: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        error: {
            type: Boolean,
            default: false
        },
        warningMessage: {
            type: String,
            default: ''
        },
        warning: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number,
            default: null
        },
        showCounter: {
            type: Boolean,
            default: false
        },
        dense: Boolean,
        hideClearButton: {
            type: Boolean,
            default: false
        },
        counterReverse: {
            type: Boolean,
            default: false
        },
        autoSuggestItems: {
            type: Array as PropType<InputSuggestion[]>,
            default: (): InputSuggestion[] => []
        },
        highlightMatches: {
            type: Boolean,
            default: false
        },
        suggestMenuWidth: {
            type: String,
            default: 'auto'
        },
        clearButtonTooltip: {
            type: Boolean,
            default: false
        },
        fitContent: Boolean,
        margin: {
            type: String,
            default: null
        },
        debounce: {
            type: Number,
            default: 100
        },
        syntaxHighlightColor: {
            type: String,
            default: 'var(--dl-color-secondary)'
        }
    },
    emits: [
        'input',
        'focus',
        'blur',
        'clear',
        'enter',
        'file-update',
        'update:model-value'
    ],
    setup(props, { emit }) {
        const mouseOverClear = ref(false)
        const highlightedIndex = ref(-1)
        const isMenuOpen = ref(false)
        const suggestItems = computed<InputSuggestion[]>(() => {
            if (!props.modelValue) return []
            return getSuggestItems(
                props.autoSuggestItems,
                props.modelValue?.toString()
            )
        })
        const input = ref(null)

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value
        }
        const handleSelectedItem = (value: any) => {
            onAutoSuggestClick(null, value)
        }
        const onAutoSuggestClick = (e: Event, item: string): void => {
            const newValue = clearSuggestion(props.modelValue.toString(), item)
            if (!props.maxLength || newValue.length < props.maxLength) {
                emit('input', newValue, e)
                emit('update:model-value', newValue)
                input.value.innerHTML = newValue
                setCaretAtTheEnd(input.value)
            }
        }

        const emitAddFile = (file: InputFile) => {
            const newFiles = cloneDeep(props.files)
            newFiles.push(file)
            emit('file-update', newFiles)
        }
        const emitRemoveFile = (fileId: string) => {
            emit(
                'file-update',
                props.files.filter((file) => file.id !== fileId)
            )
        }

        const updateSyntax = () => {
            setInnerHTMLWithCursor(input.value, (text) => {
                const words = text.split(' ').map((word) => {
                    if (word.startsWith('@')) {
                        return `<span style="color: ${props.syntaxHighlightColor}">${word}</span>`
                    }
                    return word
                })
                input.value.innerHTML = words.join(' ')
            })
        }

        return {
            suggestItems,
            highlightedIndex,
            onAutoSuggestClick,
            isMenuOpen,
            setHighlightedIndex,
            handleSelectedItem,
            mouseOverClear,
            input,
            emitAddFile,
            emitRemoveFile,
            updateSyntax
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
            focused: false
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
                return `var(--dl-color-negative)`
            } else if (this.warning) {
                return `var(--dl-color-warning)`
            } else {
                return `var(--dl-color-secondary)`
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
                '--dl-input-min-width': this.minWidth,
                '--dl-input-max-height': this.maxHeight,
                '--dl-input-white-space': this.expandable ? 'normal' : 'nowrap'
            }
        },
        inputClasses(): string[] {
            const classes = ['dl-input__input', `dl-input__input--${this.size}`]

            if (this.hasPrepend) {
                classes.push('dl-input__input--prepend')
            }
            if (this.hasAppend) {
                classes.push('dl-input__input--append')
            }
            if (this.hasPrepend && this.hasAppend) {
                classes.push('dl-input__input--both-adornments')
            }
            if (this.type === 'password' && !this.showPass) {
                classes.push('dl-input__input--password')
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
                `dl-input__adornment-container--${this.size}`
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
            return (
                (!!this.$slots.append ||
                    !this.hideClearButton ||
                    this.type === 'password') &&
                !this.isSmall
            )
        },
        hasAction(): boolean {
            return !!this.$slots.action && !this.isSmall
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
            const debounced = debounce(this.onBlur.bind(this), 50)
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
            const classes = ['dl-input__wrapper']
            if (this.disabled) {
                classes.push('dl-input__wrapper--disabled')
            }
            if (this.error) {
                classes.push('dl-input__wrapper--error')
            } else if (this.warning) {
                classes.push('dl-input__wrapper--warning')
            }

            return classes
        },
        stringSuggestions() {
            return this.suggestItems.map((item) => item.suggestion)
        }
    },
    methods: {
        onKeydown(e: KeyboardEvent) {
            if (!this.isWithinMaxLength && e.key !== 'Backspace') {
                e.preventDefault()
                return
            }
        },
        onClick(e: Event, item: string) {
            this.onAutoSuggestClick(e, item)
        },
        onChange(e: InputEvent): void {
            this.isMenuOpen = true
            const input = this.$refs.input as HTMLElement
            this.updateSyntax()
            const target = e.target as HTMLElement
            this.$emit('input', target.innerText, e)
            this.$emit('update:model-value', target.innerText)
        },
        handlePaste() {
            readClipboard().then((items) => {
                if (items.some((item) => item.type === 'text/plain')) return 0
                items.forEach((item) => {
                    readBlob(item.data).then((blobData) => {
                        if (isArrayBufferImage(blobData)) {
                            const objectUrl = URL.createObjectURL(item.data)
                            this.emitAddFile({
                                id: v4(),
                                name: `new_image_${this.files.length + 1}`,
                                image: objectUrl,
                                data: blobData
                            })
                        }
                    })
                })
            })
        },
        handleZoomImage(file: InputFile) {
            this.currentZoomImage = file.image
            this.zoomImageModel = true
        },
        handleRenameFileModal(file: InputFile) {
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
            this.focused = true
            this.$emit('focus', e)
        },
        blur(): void {
            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.blur()
        },
        onBlur(e: InputEvent): void {
            this.focused = false
            this.$emit('blur', e)
        },
        onEnterPress(e: any): void {
            this.$emit('enter', e.target.innerText, e)
        },
        onClear(e: any): void {
            this.$emit('clear', this.modelValue)
            this.$emit('input', '', e)
            this.$emit('update:model-value', '')

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
    pointer-events: none;
    display: block;
    opacity: 0.5;
    -webkit-text-security: none;
}

.dl-input {
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

        &--s {
            margin: 4px auto auto;
        }
        &--small {
            margin: 4px auto auto;
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
        flex-grow: 1;
        position: relative;
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--dl-color-separator);
        min-width: var(--dl-input-min-width);
        max-width: var(--dl-input-max-width);
        max-height: var(--dl-input-max-height);
        height: var(--dl-input-height);
        &:hover {
            border-color: var(--dl-input-border-color-hover);
        }
        &--error {
            border-color: var(--dl-color-negative);
        }
        &--warning {
            border-color: var(--dl-input-border-color-hover);
        }
        &--disabled {
            border-color: var(--dl-color-separator);
            color: var(--dl-color-disabled);
            pointer-events: none;
            cursor: not-allowed;
        }
    }

    &__input {
        display: inline-block;
        font-family: Arial, Helvetica, sans-serif;
        border-right: none;
        border-radius: 2px;
        color: var(--dl-color-darker);
        white-space: var(--dl-input-white-space);
        font-size: var(--dl-font-size-body);
        overflow: hidden scroll;
        text-overflow: clip;
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

        &--prepend {
            padding-left: 28px;
            width: calc(100% - 10px - 28px);
        }

        &--append {
            margin-right: 10px;
        }

        &--both-adornments {
            width: calc(100% - 28px - 28px);
        }

        &--m {
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

        &::placeholder {
            color: var(--dl-color-lighter);
            opacity: 1;
        }

        &:hover {
            border-color: var(--dl-input-border-color-hover);
        }

        &:focus {
            border-color: var(--dl-input-border-color-hover);
        }

        &:read-only {
            border-color: var(--dl-color-separator);
            cursor: text;
            &:hover {
                border-color: var(--dl-color-separator) !important;
            }
        }
    }

    &__adornment-container {
        display: flex;
        justify-content: center;
        align-items: var(--dl-input-align-items);
        width: 30px;
        &--l {
            margin-top: 3px;
            margin-right: 5px;
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
}
</style>
