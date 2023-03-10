<template>
    <div
        :id="uuid"
        class="dl-button-container"
        style="pointer-events: none"
    >
        <button
            v-if="hasContent || hasIcon"
            :tabindex="tabIndex"
            :aria-disabled="disabled ? 'true' : 'false'"
            :disabled="disabled"
            :style="cssButtonVars"
            style="pointer-events: auto"
            class="dl-button"
            @click="onClick"
            @mousedown="onMouseDown"
        >
            <dl-tooltip
                v-if="!tooltip && overflow && isOverflowing && hasLabel"
            >
                {{ btnLabel }}
            </dl-tooltip>
            <span class="dl-btn-content dl-anchor--skip">
                <dl-icon
                    v-if="hasIcon"
                    :size="iconSizePX"
                    :color="iconColor || textColor"
                    :class="{ 'dl-btn-icon': hasContent }"
                    :icon="icon"
                    :style="cssButtonVars"
                />
                <span
                    v-if="hasLabel"
                    ref="btnLabelRef"
                    class="dl-btn-label"
                    :class="{ 'dl-button-no-wrap': noWrap }"
                >
                    {{ btnLabel }}
                </span>
                <slot />
            </span>
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
import DlIcon from '../DlIcon.vue'
import DlTooltip from '../DlTooltip.vue'
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
import { textTransform } from '../../utils/string'
import { defineComponent, PropType, ref } from 'vue-demi'
import { colorNames } from '../../utils/css-color-names'
import { useSizeObserver } from '../../hooks/use-size-observer'
import { v4 } from 'uuid'

export enum ButtonState {
    Active = 'ACTIVE',
    Hover = 'HOVER',
    Pressed = 'PRESSED',
    Disabled = 'DISABLED'
}

export enum ButtonPart {
    Text = 'TEXT',
    Background = 'BACKGROUND',
    Border = 'BORDER'
}

export type ButtonColors = Record<ButtonState, Record<ButtonPart, string>>

export default defineComponent({
    name: 'DlButton',
    components: {
        DlIcon,
        DlTooltip
    },

    props: {
        disabled: Boolean,
        color: {
            type: String! as PropType<keyof typeof colorNames>,
            default: ''
        },
        dense: { type: Boolean, default: false },
        label: { type: String, default: '' },
        textColor: { type: String!, default: '' },
        colorsObject: {
            type: Object as PropType<ButtonColors>,
            default: null
        },
        iconColor: { type: String!, default: '' },
        padding: { type: String, default: '' },
        size: { type: String! as PropType<ButtonSizes>, default: 'm' },
        filled: { type: Boolean, default: true },
        round: { type: Boolean, default: false },
        fluid: Boolean,
        flat: Boolean,
        uppercase: Boolean,
        outlined: Boolean,
        noWrap: Boolean,
        icon: { type: String, default: '' },
        overflow: { type: Boolean, default: false, required: false },
        tooltip: { type: String, default: null, required: false }
    },
    emits: ['click', 'mousedown'],
    setup() {
        const btnLabelRef = ref(null)
        const { hasEllipsis } = useSizeObserver(btnLabelRef)

        return {
            uuid: `dl-button-${v4()}`,
            btnLabelRef,
            isOverflowing: hasEllipsis
        }
    },
    computed: {
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
        btnLabel(): string {
            return textTransform(this.label)
        },
        hasIcon(): boolean {
            return typeof this.icon === 'string' && this.icon !== ''
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
                        textColor: this.textColor
                    }),
                    '--dl-button-bg': setBgColor({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        flat: this.flat,
                        color: this.color
                    }),
                    '--dl-button-border': setBorder({
                        disabled: this.disabled,
                        flat: this.flat,
                        color: this.color
                    }),
                    '--dl-button-text-color-hover': setColorOnHover({
                        disabled: this.disabled,
                        outlined: this.outlined,
                        flat: this.flat,
                        color: this.textColor
                    }),
                    '--dl-button-border-hover': setBorderOnHover({
                        disabled: this.disabled,
                        flat: this.flat,
                        color: this.color
                    }),
                    '--dl-button-bg-hover': setBgOnHover({
                        disabled: this.disabled,
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
                '--dl-button-padding': this.dense
                    ? '0'
                    : this.padding
                    ? this.padding
                    : this.hasIcon && !this.hasContent
                    ? setIconPadding(this.size)
                    : setPadding(this.size),
                '--dl-button-font-size': setFontSize(this.size),
                '--dl-button-text-transform': this.uppercase
                    ? 'uppercase'
                    : 'none',
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
        & .dl-btn-label {
            transition: all ease-in 0.15s;
            color: var(--dl-button-color-hover);
        }
    }
}
.dl-btn-content {
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
    min-width: 1.5em;
}

.dl-btn-icon {
    margin-right: 7px;
}

.dl-button-container {
    display: inline-block;
}
</style>
