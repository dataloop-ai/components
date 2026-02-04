<template>
    <div
        :id="uuid"
        :class="containerClasses"
        style="pointer-events: none"
        :style="[cssButtonVars, containerStyles]"
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
            @dblclick="onDblClick"
            @mousedown="onMouseDown"
            @mouseup="mouseDown = false"
            @mouseenter="mouseOver = true"
            @mouseleave="onMouseLeave"
        >
            <dl-tooltip
                v-if="!tooltip && overflow && isOverflowing && hasLabel"
            >
                {{ label }}
            </dl-tooltip>
            <div class="dl-button-content dl-anchor--skip">
                <dl-icon
                    v-if="hasIcon"
                    class="dl-button-icon"
                    :size="iconSizePX"
                    :color="getIconColor"
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
            v-if="tooltip || hasTooltipSlot"
            style="pointer-events: auto"
            :trigger-percentage="tooltipTriggerPercentage"
        >
            <slot name="tooltip">
                {{ tooltip }}
            </slot>
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { DlTooltip } from '../../shared'
import { DlIcon } from '../../essential'
import {
    setPadding,
    setFontSize,
    setTextColor,
    setBgColor,
    setBorder,
    setColorOnHover,
    setBorderOnHover,
    setBgOnHover,
    setBgOnPressed,
    setBorderOnPressed,
    setTextOnPressed,
    setIconSize,
    setIconPadding,
    setMaxHeight
} from './utils'
import type { ButtonSizes } from './utils'
import { computed, defineComponent, PropType, ref, toRefs } from 'vue-demi'
import { colorNames } from '../../../utils/css-color-names'
import { useSizeObserver } from '../../../hooks/use-size-observer'
import { v4 } from 'uuid'
import { ButtonColors } from './types'
import { DlTextTransformOptions } from '../../shared/types'
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
            type: String! as PropType<keyof typeof colorNames | string>,
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
        size: { type: String! as PropType<ButtonSizes | string>, default: 'm' },
        /**
         * The assigned color will fill the entirety of the button
         */
        filled: { type: Boolean, default: true },
        /** Makes the button rounded */
        round: { type: Boolean, default: false },
        /**
         * The width of the button will take that of its container
         */
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
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },
        /**
         * Doesn't allow the button's text to be wrapped along multiple rows
         */
        noWrap: Boolean,
        /**
         * The name of the icon to go inside the button
         */
        icon: { type: String, default: '' },
        /**
         * The size of the icon inside the button. If not provided, will be calculated based on button size
         */
        iconSize: { type: String, default: null, required: false },
        overflow: { type: Boolean, default: false, required: false },
        /**
         * The tooltip displayed when hovering over the button
         */
        tooltip: { type: String, default: null, required: false },
        /**
         * The percentage of the button's width that will trigger the tooltip
         */
        tooltipTriggerPercentage: {
            type: Number,
            default: 1
        },
        /**
         * The button will maintain the styles it has when it's pressed if this prop is active
         */
        active: { type: Boolean, default: false, required: false },
        styles: { type: [Object, String], default: null },
        shaded: { type: Boolean, default: false },
        outlined: Boolean,
        /**
         * Overwrite default background color on hover
         */
        hoverBgColor: { type: String, default: null },
        /**
         * Overwrite default background color on mouse press
         */
        pressedBgColor: { type: String, default: null, required: false },
        /**
         * Overwrite default border color on hover
         */
        hoverBorderColor: { type: String, default: null },
        /**
         * Overwrite default text color on hover
         */
        hoverTextColor: { type: String, default: null },
        /**
         * Override icon color when button is disabled
         */
        disabledIconColor: { type: String, default: null }
    },
    emits: ['click', 'mousedown', 'dblclick'],
    setup(props) {
        const { active } = toRefs(props)
        const buttonLabelRef = ref(null)
        const { hasEllipsis } = useSizeObserver(buttonLabelRef)
        const mouseOver = ref(false)
        const mouseDown = ref(false)

        const buttonClass = computed(() => {
            const classes = ['dl-button']
            if (active.value) {
                classes.push('active-class')
            }
            if (props.dense) {
                classes.push('dl-button--dense')
            }
            return classes
        })

        const buttonTimeout = ref<any>(null)

        return {
            uuid: `dl-button-${v4()}`,
            buttonLabelRef,
            isOverflowing: hasEllipsis,
            buttonClass,
            mouseOver,
            mouseDown,
            buttonTimeout
        }
    },
    computed: {
        containerClasses(): string[] {
            return [
                'dl-button-container',
                `dl-text-transform--${this.transform}`
            ]
        },
        getIconColor(): string {
            if (this.flat && this.hasIcon && !this.hasContent && this.icon === 'icon-dl-info') {
                return null
            }
            if (this.disabled) {
                if (this.disabledIconColor) {
                    return this.disabledIconColor
                }
                return setTextColor({
                    disabled: this.disabled,
                    outlined: this.outlined,
                    flat: this.flat,
                    color: this.color,
                    filled: this.filled,
                    shaded: this.shaded,
                    textColor: this.iconColor || this.textColor
                })
            }

            if (this.mouseDown) {
                if (this.colorsObject?.PRESSED?.TEXT) {
                    return this.colorsObject.PRESSED.TEXT
                }
                if (!this.flat) {
                    return 'var(--dl-button-text-color)'
                }
                return setTextOnPressed({
                    disabled: this.disabled,
                    flat: this.flat,
                    textColor: this.iconColor || this.textColor
                })
            }

            if (this.mouseOver) {
                return (
                    this.hoverTextColor ??
                    setColorOnHover({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        shaded: this.shaded,
                        flat: this.flat,
                        color: this.iconColor || this.textColor
                    })
                )
            }

            if (this.iconColor) {
                return this.iconColor
            }

            if (this.textColor) {
                return this.textColor
            }

            return setTextColor({
                disabled: this.disabled,
                outlined: this.outlined,
                flat: this.flat,
                color: this.color,
                filled: this.filled,
                shaded: this.shaded,
                textColor: this.textColor
            })
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
            return this.iconSize || setIconSize(this.$props.size)
        },
        hasLabel(): boolean {
            return !!this.label
        },
        buttonLabel(): string {
            return textTransform(this.label)
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
        hasTooltipSlot(): boolean {
            return !!this.$slots.tooltip
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
                            this.hoverTextColor ?? this.colorsObject.HOVER.TEXT,
                        '--dl-button-bg-hover':
                            this.hoverBgColor ??
                            this.colorsObject.HOVER.BACKGROUND,
                        '--dl-button-border-hover':
                            this.hoverBorderColor ??
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
                        color: this.color,
                        outlined: this.outlined
                    }),
                    '--dl-button-text-color-hover':
                        this.hoverTextColor ??
                        setColorOnHover({
                            disabled: this.disabled,
                            outlined: this.outlined,
                            shaded: this.shaded,
                            flat: this.flat,
                            color: this.textColor
                        }),
                    '--dl-button-border-hover':
                        this.hoverBorderColor ??
                        setBorderOnHover({
                            disabled: this.disabled,
                            flat: this.flat,
                            shaded: this.shaded,
                            outlined: this.outlined,
                            color: this.color
                        }),
                    '--dl-button-bg-hover':
                        this.hoverBgColor ??
                        setBgOnHover({
                            disabled: this.disabled,
                            shaded: this.shaded,
                            outlined: this.outlined,
                            flat: this.flat,
                            filled: this.filled,
                            color: this.color
                        }),
                    '--dl-button-text-color-pressed': setTextOnPressed({
                        disabled: this.disabled,
                        flat: this.flat,
                        color: this.color,
                        textColor: this.textColor
                    }),
                    '--dl-button-bg-pressed':
                        this.pressedBgColor ??
                        setBgOnPressed({
                            disabled: this.disabled,
                            flat: this.flat,
                            shaded: this.shaded,
                            outlined: this.outlined,
                            filled: this.filled,
                            color: this.color
                        }),

                    '--dl-button-border-pressed': setBorderOnPressed({
                        disabled: this.disabled,
                        flat: this.flat,
                        shaded: this.shaded,
                        outlined: this.outlined,
                        filled: this.filled,
                        color: this.color
                    })
                }
            }

            return {
                '--dl-button-transition-duration': 'all ease 0.15s',
                '--dl-button-text-transition-duration': 'all ease 0.05s',
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

                clearTimeout(this.buttonTimeout)
                this.buttonTimeout = setTimeout(() => {
                    this.$emit('click', e)
                }, 50)
            }
        },
        onDblClick(e: Event) {
            if (this.isActionable) {
                if (!e) {
                    if (e.defaultPrevented === true) {
                        return
                    }
                }

                clearTimeout(this.buttonTimeout)
                this.$emit('dblclick', e)
            }
        },
        onMouseDown(e: Event) {
            if (this.isActionable) {
                if (e) {
                    if (e.defaultPrevented === true) {
                        return
                    }
                }

                this.mouseDown = true
                this.$emit('mousedown', e)
            }
        },
        onMouseLeave() {
            this.mouseOver = false
            this.mouseDown = false
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
    transition: var(--dl-button-transition-duration);
    justify-content: center;

    &:active {
        transition: var(--dl-button-transition-duration);
        color: var(--dl-button-text-color-pressed) !important;
        background-color: var(--dl-button-bg-pressed) !important;
        border-color: var(--dl-button-border-pressed) !important;

        & > span > i {
            transition: var(--dl-button-text-transition-duration);
        }
    }
    outline: none;

    &--dense {
        border: none;
        padding: 0;
    }

    &:hover:enabled:not(:active) {
        transition: var(--dl-button-transition-duration);
        color: var(--dl-button-text-color-hover);
        background-color: var(--dl-button-bg-hover);
        border-color: var(--dl-button-border-hover);

        & .dl-button-label {
            transition: var(--dl-button-text-transition-duration);
            color: var(--dl-button-color-hover);
        }
        .dl-icon {
            color: var(--dl-button-text-color-hover) !important;
        }
    }
    &:focus-visible {
        outline: 1px solid var(--dell-blue-500);
        outline-offset: 2px;
        border-radius: var(--dl-button-border-radius);
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

.dl-button-icon {
    transition: var(--dl-button-text-transition-duration);
    transition-property: color;
}

.dl-button-container {
    display: inline-block;
    width: var(--dl-button-container-width);
    height: fit-content;
}

.active-class {
    color: var(--dl-button-text-color-hover);
    background-color: var(--dl-button-bg-hover);
    border-color: var(--dl-button-border-hover);
    transition: var(--dl-button-transition-duration);

    & .dl-button-label {
        color: var(--dl-button-color-hover);
        transition: var(--dl-button-text-transition-duration);
    }
}
</style>
