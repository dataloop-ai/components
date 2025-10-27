<template>
    <div :id="uuid" :style="cssVars" :class="rootContainerClasses">
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
                        'dl-text-input__title-container': true,
                        'dl-text-input__title-container--s': isSmall
                    }"
                >
                    <label
                        v-if="!!title.length"
                        class="dl-text-input__title"
                        :style="`${isSmall ? 'width: 90%' : 'width: 100%'}`"
                    >
                        <dl-ellipsis>
                            {{ title
                            }}<span v-if="required" :class="asteriskClasses">
                                *</span
                            >
                            {{ !required && optional ? ' (Optional)' : null }}
                        </dl-ellipsis>
                    </label>
                    <span v-if="!!tooltip.length">
                        <dl-icon
                            class="dl-text-input__tooltip-icon"
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
                        'dl-text-input__top-message-container': true,
                        'dl-text-input__top-message-container--s': isSmall
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
                    <div style="flex-grow: 1; height: 100%; position: relative">
                        <input
                            ref="input"
                            :value="modelValue"
                            :class="inputClasses"
                            :placeholder="placeholder"
                            :maxlength="maxLength"
                            :type="showPass ? 'text' : type"
                            :disabled="disabled"
                            :readonly="readonly"
                            @input="debouncedInput"
                            @focus="onFocus"
                            @blur="debouncedBlur"
                            @keyup.enter="onKeyPress"
                        />
                        <dl-tooltip v-if="disabled && disabledTooltip">
                            {{ disabledTooltip }}
                        </dl-tooltip>
                        <div
                            v-if="hasPrepend"
                            :class="[
                                ...adornmentClasses,
                                'dl-text-input__adornment-container--pos-left'
                            ]"
                        >
                            <slot name="prepend" />
                        </div>
                        <div
                            v-if="hasAppend"
                            :class="[
                                ...adornmentClasses,
                                'dl-text-input__adornment-container--pos-right'
                            ]"
                        >
                            <slot name="append" />
                            <span
                                v-if="showClearButton"
                                v-show="focused || mouseOverClear"
                                @mouseenter="mouseOverClear = true"
                                @mouseleave="mouseOverClear = false"
                            >
                                <dl-button
                                    ref="input-clear-button"
                                    icon="icon-dl-close"
                                    size="m"
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
                        :arrow-nav-items="suggestItems"
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
                                :key="item"
                                clickable
                                style="font-size: 12px"
                                :highlighted="suggestIndex === highlightedIndex"
                                @click="onClick($event, item)"
                            >
                                <span
                                    v-for="(word, index) in getSuggestWords(
                                        item,
                                        modelValue
                                    )"
                                    :key="JSON.stringify(word) + index"
                                    :class="{
                                        'dl-text-input__suggestion--highlighted':
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
                <div class="row bottom full-width full-height">
                    <div
                        v-if="bottomMessage"
                        class="row full-width dl-text-input__bottom-message-container"
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
                                class="dl-text-input__counter"
                            >
                                {{ characterCounter }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent, PropType, ref } from 'vue-demi'
import { DlInfoErrorMessage, DlTooltip } from '../../shared'
import { DlListItem } from '../../basic'
import { DlMenu, DlIcon, DlList, DlEllipsis } from '../../essential'
import { DlButton } from '../../basic'
import { InputSizes, TInputSizes } from '../../../utils/input-sizes'
import { v4 } from 'uuid'
import { stateManager } from '../../../StateManager'

export default defineComponent({
    name: 'DlTextInput',
    components: {
        DlButton,
        DlIcon,
        DlTooltip,
        DlInfoErrorMessage,
        DlMenu,
        DlList,
        DlListItem,
        DlEllipsis
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
            type: Array as PropType<string[]>,
            default: (): string[] => []
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
        disabledTooltip: {
            type: String,
            default: ''
        }
    },
    emits: ['input', 'focus', 'blur', 'clear', 'enter', 'update:model-value'],
    setup(props, { emit }) {
        const mouseOverClear = ref(false)
        const highlightedIndex = ref(-1)
        const isMenuOpen = ref(false)
        const suggestItems = computed<string[]>(() => {
            return props.autoSuggestItems.filter((item) =>
                item.includes(`${props.modelValue}`)
            )
        })

        const setHighlightedIndex = (value: any) => {
            highlightedIndex.value = value
        }
        const handleSelectedItem = (value: any) => {
            onAutoSuggestClick(null, value)
        }
        const inputRef = ref<HTMLInputElement>(null)
        const onAutoSuggestClick = (
            e: Event,
            item: string | HTMLInputElement
        ): void => {
            emit('input', item, e)
            emit('update:model-value', item)
            inputRef.value = item as HTMLInputElement
        }

        return {
            suggestItems,
            highlightedIndex,
            onAutoSuggestClick,
            isMenuOpen,
            setHighlightedIndex,
            handleSelectedItem,
            mouseOverClear
        }
    },
    data() {
        return {
            uuid: `dl-text-input-${v4()}`,
            showPass: false,
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
            const classes = ['dl-text-input']
            if (this.isSmall) {
                classes.push('dl-text-input--s')
            }
            if (this.dense) {
                classes.push('dl-text-input--dense')
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
                '--dl-input-border-color-hover': this.getBorderColor
            }
        },
        inputClasses(): string[] {
            const classes = [
                'dl-text-input__input',
                `dl-text-input__input--${this.size}`
            ]

            if (this.hasPrepend) {
                classes.push('dl-text-input__input--prepend')
            }
            if (this.hasAppend) {
                classes.push('dl-text-input__input--append')
            }
            if (this.hasPrepend && this.hasAppend) {
                classes.push('dl-text-input__input--both-adornments')
            }
            if (this.error) {
                classes.push('dl-text-input__input--error')
            } else if (this.warning) {
                classes.push('dl-text-input__input--warning')
            }

            return classes
        },
        asteriskClasses(): string[] {
            const classes = ['dl-text-input__asterisk']

            if (this.redAsterisk) {
                classes.push('dl-text-input__asterisk--red')
            }

            return classes
        },
        adornmentClasses(): string[] {
            return [
                'dl-text-input__adornment-container',
                `dl-text-input__adornment-container--${this.size}`
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
            return !!this.suggestItems.length && !!this.modelValue
        },
        debouncedBlur(): any {
            if (stateManager.disableDebounce) {
                return this.onBlur.bind(this)
            }
            const debounced = debounce(this.onBlur.bind(this), 50)
            return debounced
        },
        inputLength(): number {
            return `${this.modelValue}`.length
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
        wrapperClasses(): string {
            let classes = 'flex items-center'

            if (this.isSmall) {
                classes += ' no-wrap'
            }

            return classes
        },
        debouncedInput(): any {
            if (stateManager.disableDebounce) {
                return this.onChange.bind(this)
            }
            const debounced = debounce(this.onChange.bind(this), this.debounce)
            return debounced
        }
    },
    methods: {
        onClick(e: Event, item: string) {
            this.onAutoSuggestClick(e, item)
        },
        onChange(e: any): void {
            this.isMenuOpen = true
            const trimmedValue = e.target.value.trim()
            this.$emit('input', trimmedValue, e)
            this.$emit('update:model-value', trimmedValue)
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
        onKeyPress(e: any): void {
            this.$emit('enter', e.target.value, e)
        },
        onClear(e: any): void {
            this.$emit('clear', this.modelValue)
            this.$emit('input', '', e)
            this.$emit('update:model-value', '')

            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.value = ''
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
.dl-text-input {
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

    &__input {
        border: 1px solid var(--dl-color-separator);
        border-radius: 2px;
        color: var(--dl-color-darker);
        width: calc(100% - 20px);
        box-sizing: content-box;
        height: 12px;
        padding: 10px;
        outline: none;
        background: none;
        transition: border 0.3s;
        font-size: var(--dl-font-size-body);
        position: relative;

        &--prepend {
            padding-left: 28px;
            width: calc(100% - 10px - 28px);
        }

        &--append {
            padding-right: 28px;
            width: calc(100% - 10px - 28px);
        }

        &--both-adornments {
            width: calc(100% - 28px - 28px);
        }

        &--l {
            height: 16px;
            line-height: 16px;
        }

        &--large {
            height: 16px;
            line-height: 16px;
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
            padding-top: 4px;
            padding-bottom: 3px;
            padding-right: 5px;
        }
        &--small {
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 5px;
            padding-right: 5px;
        }

        &--error {
            border-color: var(--dl-color-negative);
            &:hover {
            }
        }

        &--warning {
            border-color: var(--dl-input-border-color-hover);
            &:hover {
            }
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

        &:disabled {
            border-color: var(--dl-color-separator);
            color: var(--dl-color-disabled);
            cursor: not-allowed;
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
        align-items: center;
        position: absolute;
        width: 28px;

        &--l {
            height: 38px;
        }

        &--large {
            height: 38px;
        }

        &--m {
            height: 28px;
        }

        &--medium {
            height: 28px;
        }

        &--s {
            margin-top: 1px;
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
        }
        &--pos-right-out {
            top: 0;
            right: -30px;
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
    }
}
</style>
