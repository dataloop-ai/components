<template>
    <div
        :id="uuid"
        :class="rootContainerClasses"
    >
        <div
            v-show="!!title.length || !!tooltip.length"
            :class="{
                'dl-text-input__title-container': true,
                'dl-text-input__title-container--s': isSmall
            }"
        >
            <label
                v-show="!!title.length"
                class="dl-text-input__title"
            >
                {{ title
                }}<span
                    v-show="required"
                    :class="asteriskClasses"
                > *</span>
                {{ !required && optional ? ' (Optional)' : null }}
            </label>
            <span v-show="!!tooltip.length">
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
        <div
            v-show="!!topMessage.length && !isSmall"
            class="dl-text-input__top-message-container"
        >
            <dl-info-error-message
                v-show="!!topMessage.length"
                position="above"
                :value="topMessage"
            />
        </div>
        <div class="dl-text-input__input-wrapper">
            <input
                ref="input"
                :value="modelValue"
                :class="inputClasses"
                :placeholder="placeholder"
                :maxlength="maxLength"
                :type="showPass ? 'text' : type"
                :disabled="disabled"
                @input="onChange"
                @focus="onFocus"
                @blur="debouncedBlur()"
                @keyup.enter="onKeyPress"
            >
            <div
                v-show="hasPrepend"
                :class="[
                    ...adornmentClasses,
                    'dl-text-input__adornment-container--pos-left'
                ]"
            >
                <slot name="prepend" />
            </div>
            <div
                v-show="hasAppend"
                :class="[
                    ...adornmentClasses,
                    'dl-text-input__adornment-container--pos-right'
                ]"
            >
                <slot name="append" />
                <span v-show="showClearBtn">
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
                <span v-show="showShowPassBtn">
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
            <div
                v-show="hasAction"
                :class="[
                    ...adornmentClasses,
                    'dl-text-input__adornment-container--pos-right-out'
                ]"
            >
                <slot name="action" />
            </div>
            <dl-menu
                v-if="showSuggestItems"
                v-model="isMenuOpen"
                auto-close
                no-focus
                :offset="[0, 3]"
                fit
                @click="onMenuShow"
            >
                <dl-list
                    bordered
                    :style="{ maxWidth: suggestMenuWidth }"
                >
                    <dl-list-item
                        v-for="item in suggestItems"
                        :key="item"
                        clickable
                        style="font-size: 12px"
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
                            <span v-show="word.value[0] === ' '">&nbsp;</span>
                            {{ word.value }}
                            <span
                                v-show="
                                    word.value[word.value.length - 1] === ' '
                                "
                            >&nbsp;</span>
                        </span>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </div>
        <div
            v-if="!isSmall && bottomMessage"
            class="dl-text-input__bottom-message-container"
        >
            <dl-info-error-message
                v-if="!!infoMessage.length && !error && !warning"
                position="below"
                :value="infoMessage"
            />
            <dl-info-error-message
                v-if="error && !!errorMessage && !!errorMessage.length"
                position="below"
                error
                :value="errorMessage"
            />
            <dl-info-error-message
                v-if="
                    warning &&
                        !!warningMessage &&
                        !!warningMessage.length &&
                        !error
                "
                position="below"
                warning
                :value="warningMessage"
            />
            <span
                v-if="showCounter && maxLength && maxLength > 0"
                class="dl-text-input__counter"
            >
                {{ characterCounter }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { defineComponent, PropType } from 'vue-demi'
import { DlButton } from './DlButton'
import DlIcon from './DlIcon.vue'
import DlInfoErrorMessage from './DlInfoErrorMessage.vue'
import DlList from './DlList.vue'
import { DlListItem } from './DlListItem'
import { DlMenu } from './DlMenu'
import DlTooltip from './DlTooltip.vue'
import { InputSizes, TInputSizes } from '../utils/input-sizes'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlTextInput',
    components: {
        DlButton,
        DlIcon,
        DlTooltip,
        DlInfoErrorMessage,
        DlMenu,
        DlList,
        DlListItem
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
        maxLength: {
            type: Number,
            default: null
        },
        showCounter: {
            type: Boolean,
            default: false
        },
        withoutRootPadding: {
            type: Boolean,
            default: false
        },
        disableClearBtn: {
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
        }
    },
    emits: ['input', 'focus', 'blur', 'clear', 'enter', 'update:model-value'],
    data() {
        return {
            uuid: `dl-text-input-${v4()}`,
            showPass: false,
            focused: false,
            isMenuOpen: false
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
            if (this.withoutRootPadding) {
                classes.push('dl-text-input--without-root-padding')
            }
            return classes
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
            return this.size === InputSizes.s
        },
        hasPrepend(): boolean {
            return !!this.$slots.prepend && !this.isSmall
        },
        hasAppend(): boolean {
            return (
                (!!this.$slots.append ||
                    !this.disableClearBtn ||
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
        showClearBtn(): boolean {
            return (
                !this.$slots.append &&
                !this.disableClearBtn &&
                this.type !== 'password' &&
                !this.disabled &&
                !!this.modelValue
                // this.focused
            )
        },
        showShowPassBtn(): boolean {
            return !this.$slots.append && this.type === 'password'
        },
        showSuggestItems(): boolean {
            return !!this.suggestItems.length && !!this.modelValue
        },
        suggestItems(): string[] {
            return this.autoSuggestItems.filter((item) =>
                item.includes(`${this.modelValue}`)
            )
        },
        debouncedBlur(): any {
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
        }
    },
    methods: {
        onClick(e: Event, item: string) {
            this.onAutoSuggestClick(e, item)
        },
        onChange(e: any): void {
            this.isMenuOpen = true
            this.$emit('input', e.target.value, e)
            this.$emit('update:model-value', e.target.value)
        },
        onFocus(e: InputEvent): void {
            this.focused = true
            this.$emit('focus', e)
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
        },
        onPassShowClick(): void {
            this.showPass = !this.showPass
        },
        onAutoSuggestClick(e: Event, item: string): void {
            this.$emit('input', item, e)
            this.$emit('update:model-value', item)

            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.value = item
        },
        onMenuShow(): void {
            const inputRef = this.$refs.input as HTMLInputElement
            inputRef.focus()
        },
        getSuggestWords(
            item: string,
            keyword: string
        ): { value: string; highlighted: boolean }[] {
            const words: { value: string; highlighted: boolean }[] = []

            if (!keyword.length || !this.highlightMatches) {
                return [
                    {
                        value: item,
                        highlighted: false
                    }
                ]
            }

            const regex = new RegExp(keyword, 'g')

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
                    const wordEndIndex = matchIndex + keyword.length

                    words.push({
                        value: item
                            .split('')
                            .slice(matchIndex, keyword.length + matchIndex)
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
    padding: 20px 20px 20px 0px;

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

    &--without-root-padding {
        padding: 0;
    }

    &--s {
        display: flex;
        align-items: center;
    }

    &__title-container {
        margin-bottom: 6px;
        display: flex;
        align-items: center;

        &--s {
            margin-right: 5px;
            margin-bottom: 0px;
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
    }

    &__input-wrapper {
        position: relative;
        width: 100%;
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

        &--m {
            padding-top: 7px;
            padding-bottom: 7px;
        }

        &--s {
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 5px;
            padding-right: 5px;
            width: 100%;
        }

        &--error {
            border-color: var(--dl-color-negative);
            &:hover {
                border-color: var(--dl-color-separator) !important;
            }
        }

        &--warning {
            border-color: var(--dl-color-warning);
            &:hover {
                border-color: var(--dl-color-separator) !important;
            }
        }

        &::placeholder {
            color: var(--dl-color-lighter);
            opacity: 1;
        }

        &:hover {
            border-color: var(--dl-color-secondary);
        }

        &:focus {
            border-color: var(--dl-color-secondary);
        }

        &:disabled {
            border-color: var(--dl-color-separator);
            color: var(--dl-color-disabled);
            cursor: not-allowed;
        }
    }

    &__adornment-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 28px;

        &--l {
            height: 34px;
        }

        &--m {
            height: 28px;
        }

        &--s {
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
