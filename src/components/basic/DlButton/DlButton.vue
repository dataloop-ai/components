<template>
    <div
        :id="uuid"
        class="dl-button-container"
        style="pointer-events: none"
        :style="[cssButtonVars, containerStyles, capitalizeFirst]"
    >
        <button
            v-if="hasContent || hasIcon"
            :tabindex="tabIndex"
            :aria-disabled="disabled ? 'true' : 'false'"
            :disabled="disabled"
            :style="[computedStyles]"
            style="pointer-events: auto"
            :class="buttonClass"
            @click="onClick"
            @mousedown="onMouseDown"
        >
            <dl-tooltip
                v-if="!tooltip && overflow && isOverflowing && hasLabel"
            >
                {{ label }}
            </dl-tooltip>
            <div class="dl-button-content dl-anchor--skip">
                <dl-icon
                    v-if="hasIcon"
                    :size="iconSizePX"
                    :color="iconColor || textColor"
                    :icon="icon"
                    :style="cssButtonVars"
                />
                <span
                    v-if="hasLabel"
                    ref="buttonLabelRef"
                    class="dl-button-label"
                    :class="{
                        'dl-button-no-wrap': noWrap
                    }"
                >
                    {{ label }}
                </span>
                <slot />
            </div>
        </button>
        <dl-tooltip
            v-if="tooltip"
            style="pointer-events: auto"
        >
            {{ tooltip }}
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { DlTooltip, DlIcon } from '../../essential'
import {
    setPadding,
    setFontSize,
    setTextColor,
    setBgColor,
    setBorder,
    setColorOnHover,
    setBorderOnHover,
    setBgOnHover,
    setIconSize,
    setIconPadding,
    setMaxHeight
} from './utils'
import type { ButtonSizes } from './utils'
import { defineComponent, PropType, ref } from 'vue-demi'
import { colorNames } from '../../../utils/css-color-names'
import { useSizeObserver } from '../../../hooks/use-size-observer'
import { v4 } from 'uuid'
import { ButtonColors } from './types'
import { transformOptions } from '../../shared/types'
import { stringStyleToRecord } from '../../../utils'
import { textTransform } from '../../../utils/string'
import { isString } from 'lodash'

export default defineComponent({
    name: 'DlButton',
    components: {
        DlIcon,
        DlTooltip
    },

    props: {
        /**
         * The user will not be able to press on the button
         */
        disabled: Boolean,
        /**
         * The color of the button
         */
        color: {
            type: String! as PropType<keyof typeof colorNames>,
            default: ''
        },
        /**
         * The button's padding is lowered and the white space shrinks
         */
        dense: { type: Boolean, default: false },
        /**
         * The text content of the button
         */
        label: { type: String, default: '' },
        /**
         * The color of the button's text
         */
        textColor: { type: String!, default: '' },
        colorsObject: {
            type: Object as PropType<ButtonColors>,
            default: null
        },
        /**
         * The color of the icon inside the button
         */
        iconColor: { type: String!, default: '' },
        /** Padding inside the button */
        padding: { type: String, default: '' },
        /**
         * The size of the button, it can be s,m,l or xl
         */
        margin: { type: String, default: '0 auto' },
        size: { type: String! as PropType<ButtonSizes>, default: 'm' },
        /**
         * The assigned color will fill the entirety of the button
         */
        filled: { type: Boolean, default: true },
        /** Makes the button rounded */
        round: { type: Boolean, default: false },
        /**
         * The width of the button will take that of its container
         */
        shaded: { type: Boolean, default: false },
        fluid: Boolean,
        /**
         * The button will not have an outline
         */
        flat: Boolean,
        /**
         * All the characters inside the button will be uppercase
         */
        uppercase: Boolean,
        /**
         * The button will be transparent with a colored outline
         */
        transform: {
            type: String,
            default: 'default',
            validator: (value: string): boolean =>
                transformOptions.includes(value)
        },
        outlined: Boolean,
        /**
         * Doesn't allow the button's text to be wrapped along multiple rows
         */
        noWrap: Boolean,
        /**
         * The name of the icon to go inside the button
         */
        icon: { type: String, default: '' },
        overflow: { type: Boolean, default: false, required: false },
        /**
         * The tooltip displayed when hovering over the button
         */
        tooltip: { type: String, default: null, required: false },
        /**
         * The button will mentain the styles it has when it's pressed if this prop is active
         */
        active: { type: Boolean, default: false, required: false },
        styles: { type: [Object, String], default: null }
    },
    emits: ['click', 'mousedown'],
    setup() {
        const buttonLabelRef = ref(null)
        const { hasEllipsis } = useSizeObserver(buttonLabelRef)

        return {
            uuid: `dl-button-${v4()}`,
            buttonLabelRef,
            isOverflowing: hasEllipsis
        }
    },
    computed: {
        capitalizeFirst(): string {
            if (this.transform === 'default') {
                return 'first-letter-capitalized'
            }
            return null
        },
        computedStyles(): Record<string, string> {
            return isString(this.styles)
                ? stringStyleToRecord(this.styles)
                : this.styles
        },
        isActionable(): boolean {
            return this.disabled !== true
        },
        tabIndex(): number {
            return this.isActionable ? 0 : -1
        },
        iconSizePX(): string {
            return setIconSize(this.$props.size)
        },
        hasLabel(): boolean {
            return (
                this.label !== void 0 &&
                this.label !== null &&
                this.label !== ''
            )
        },
        buttonLabel(): string {
            return textTransform(this.label)
        },
        buttonClass() {
            return this.active ? 'dl-button active-class' : 'dl-button'
        },
        hasIcon(): boolean {
            return typeof this.icon === 'string' && this.icon !== ''
        },
        containerStyles(): object {
            return this.fluid ? { width: '100%' } : {}
        },
        hasContent(): boolean {
            return !!this.$slots.default || this.hasLabel
        },
        cssButtonVars(): Record<string, string> {
            let colors: Record<string, string> = {}

            if (this.colorsObject) {
                if (this.disabled) {
                    colors = {
                        '--dl-button-text-color':
                            this.colorsObject.DISABLED.TEXT,
                        '--dl-button-bg': this.colorsObject.DISABLED.BACKGROUND,
                        '--dl-button-border': this.colorsObject.DISABLED.BORDER,
                        '--dl-button-text-color-hover':
                            this.colorsObject.DISABLED.TEXT,
                        '--dl-button-bg-hover':
                            this.colorsObject.DISABLED.BACKGROUND,
                        '--dl-button-border-hover':
                            this.colorsObject.DISABLED.BORDER,
                        '--dl-button-text-color-pressed':
                            this.colorsObject.DISABLED.TEXT,
                        '--dl-button-bg-pressed':
                            this.colorsObject.DISABLED.BACKGROUND,
                        '--dl-button-border-pressed':
                            this.colorsObject.DISABLED.BORDER
                    }
                } else {
                    colors = {
                        '--dl-button-text-color': this.colorsObject.ACTIVE.TEXT,
                        '--dl-button-bg': this.colorsObject.ACTIVE.BACKGROUND,
                        '--dl-button-border': this.colorsObject.ACTIVE.BORDER,
                        '--dl-button-text-color-hover':
                            this.colorsObject.HOVER.TEXT,
                        '--dl-button-bg-hover':
                            this.colorsObject.HOVER.BACKGROUND,
                        '--dl-button-border-hover':
                            this.colorsObject.HOVER.BORDER,
                        '--dl-button-text-color-pressed':
                            this.colorsObject.PRESSED.TEXT,
                        '--dl-button-bg-pressed':
                            this.colorsObject.PRESSED.BACKGROUND,
                        '--dl-button-border-pressed':
                            this.colorsObject.PRESSED.BORDER
                    }
                }
            } else {
                colors = {
                    '--dl-button-text-color': setTextColor({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        flat: this.flat,
                        color: this.color,
                        filled: this.filled,
                        shaded: this.shaded,
                        textColor: this.textColor
                    }),
                    '--dl-button-bg': setBgColor({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        shaded: this.shaded,
                        flat: this.flat,
                        color: this.color
                    }),
                    '--dl-button-border': setBorder({
                        disabled: this.disabled,
                        flat: this.flat,
                        shaded: this.shaded,
                        color: this.color
                    }),
                    '--dl-button-text-color-hover': setColorOnHover({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        shaded: this.shaded,
                        flat: this.flat,
                        color: this.textColor
                    }),
                    '--dl-button-border-hover': setBorderOnHover({
                        disabled: this.disabled,
                        flat: this.flat,
                        shaded: this.shaded,
                        color: this.color
                    }),
                    '--dl-button-bg-hover': setBgOnHover({
                        disabled: this.disabled,
                        shaded: this.shaded,
                        outlined: this.outlined,
                        flat: this.flat,
                        filled: this.filled,
                        color: this.color
                    }),
                    '--dl-button-text-color-pressed':
                        'var(--dl-button-text-color)',
                    '--dl-button-bg-pressed': 'var(--dl-button-bg)',
                    '--dl-button-border-pressed': 'var(--dl-button-border)'
                }
            }

            return {
                '--dl-button-container-width': this.fluid ? '100%' : 'auto',
                '--dl-button-padding': this.dense
                    ? '0'
                    : this.padding
                    ? this.padding
                    : this.hasIcon && !this.hasContent
                    ? setIconPadding(this.size)
                    : setPadding(this.size),
                '--dl-button-margin': this.margin,
                '--dl-button-font-size': setFontSize(this.size),
                '--dl-button-text-transform': this.capitalizeFirst
                    ? null
                    : this.transform,
                '--dl-button-cursor': this.isActionable
                    ? 'pointer'
                    : 'not-allowed',

                '--dl-button-width': '100%',
                '--dl-button-border-radius':
                    !this.hasContent && this.hasIcon && this.round
                        ? '50%'
                        : '2px',
                '--dl-button-max-height': this.padding
                    ? '100%'
                    : setMaxHeight(this.size),
                ...colors
            }
        }
    },
    methods: {
        onClick(e: Event) {
            if (this.isActionable) {
                if (!e) {
                    if (e.defaultPrevented === true) {
                        return
                    }
                }

                this.$emit('click', e)
            }
        },
        onMouseDown(e: Event) {
            if (this.isActionable) {
                if (e !== void 0) {
                    if (e.defaultPrevented === true) {
                        return
                    }
                }

                this.$emit('mousedown', e)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-button-no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dl-button {
    padding: var(--dl-button-padding);
    margin: var(--dl-button-margin);
    border-radius: var(--dl-button-border-radius);
    text-transform: var(--dl-button-text-transform);
    font-family: 'Roboto', sans-serif;
    font-size: var(--dl-button-font-size);
    cursor: var(--dl-button-cursor);
    color: var(--dl-button-text-color);
    background-color: var(--dl-button-bg);
    border: 1px solid var(--dl-button-border);
    width: var(--dl-button-width);
    max-height: var(--dl-button-max-height);
    height: auto;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    vertical-align: middle;
    transition: all ease-in 0.15s;
    justify-content: center;

    &:active {
        transition: all ease-in 0.15s;
        color: var(--dl-button-text-color-pressed) !important;
        background-color: var(--dl-button-bg-pressed) !important;
        border-color: var(--dl-button-border-pressed) !important;

        & > span > i {
            transition: all ease-in 0.15s;
        }
    }

    &:hover:enabled:not(:active) {
        color: var(--dl-button-text-color-hover);
        background-color: var(--dl-button-bg-hover);
        border-color: var(--dl-button-border-hover);

        & .dl-button-label {
            transition: all ease-in 0.15s;
            color: var(--dl-button-color-hover);
        }
    }
}

.dl-button-content {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding: 0;
    flex: 10000 1 0%;
    flex-wrap: nowrap;
    line-height: 1;
    z-index: 0;
    user-select: none !important;
    gap: var(--dl-button-content-gap, 7px);
}

.dl-button-container.first-letter-capitalized {
    &::first-letter,
    & > *::first-letter {
        text-transform: capitalize;
    }
}

.dl-button-container {
    display: inline-block;
    width: var(--dl-button-container-width);
}

.active-class {
    color: var(--dl-button-text-color-hover);
    background-color: var(--dl-button-bg-hover);
    border-color: var(--dl-button-border-hover);
    & .dl-button-label {
        transition: all ease-in 0.15s;
        color: var(--dl-button-color-hover);
    }
}
</style>
