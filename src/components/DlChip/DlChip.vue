<template>
    <div
        :id="uuid"
        ref="dlChipRef"
        :tabindex="tabIndex"
        class="dl-chip"
        :style="cssChipVars"
    >
        <slot name="prefix" />
        <span
            v-if="hasIcon"
            class="dl-chip-left-icon-container"
        >
            <dl-icon
                class="dl-chip-left-icon"
                size="12px"
                :icon="icon"
            />
        </span>
        <slot>
            {{ hasLabel ? label : null }}
        </slot>
        <dl-tooltip v-if="overflow && isOverflowing">
            {{ label }}
        </dl-tooltip>
        <span
            v-if="removable"
            class="dl-chip-remove-icon-container"
            @click="onRemove"
        >
            <dl-icon
                class="dl-chip-remove-icon"
                size="7px"
                icon="icon-dl-close"
            /></span>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlTooltip from '../../components/DlTooltip.vue'
import DLIcon from '../../components/DlIcon.vue'
import { useSizeObserver } from '../../hooks/use-size-observer'
import {
    setTextColor,
    setBgColor,
    setBorder,
    setPadding,
    setLeftIconColor,
    setMaxWidth,
    setRemoveIconWidth
} from './utils'
import { v4 } from 'uuid'

const transformOptions: string[] = [
    'none',
    'capitalize',
    'uppercase',
    'lowercase',
    'full-width',
    'full-size-kana',
    'inherit',
    'initial',
    'revert',
    'revert-layer',
    'unset'
]

export default defineComponent({
    name: 'DlChip',
    components: {
        'dl-tooltip': DlTooltip,
        'dl-icon': DLIcon
    },
    props: {
        disabled: Boolean,
        filled: { type: Boolean, default: true },
        outlined: Boolean,
        color: { type: String, default: 'dl-color-secondary' },
        textColor: { type: String, default: '' },
        icon: { type: String, default: '' },
        iconColor: { type: String, default: '' },
        label: { type: [String, Number], default: '' },
        maxWidth: { type: [String, Number], default: '' },
        removable: Boolean,
        tabIndex: { type: [String, Number], default: '' },
        transform: {
            type: String,
            default: 'lowercase',
            validator: (value: string): boolean =>
                transformOptions.includes(value)
        },
        overflow: { type: Boolean, default: false }
    },
    emits: ['remove'],
    setup() {
        const dlChipRef = ref(null)
        const { hasEllipsis } = useSizeObserver(dlChipRef)

        return {
            uuid: `dl-chip-${v4()}`,
            dlChipRef,
            isOverflowing: hasEllipsis
        }
    },
    computed: {
        hasLabel(): boolean {
            return (
                this.label !== void 0 &&
                this.label !== null &&
                this.label !== ''
            )
        },
        hasIcon(): boolean {
            return typeof this.icon === 'string' && this.icon !== ''
        },
        computedIconColor(): string {
            if (this.outlined && !this.iconColor) {
                return 'dl-color-secondary'
            }

            if (this.filled && !this.iconColor) {
                return 'dl-color-white'
            }

            return this.iconColor
        },
        cssChipVars(): Record<string, string | number> {
            return {
                '--dl-chip-max-width': setMaxWidth(this.maxWidth),
                '--dl-chip-remove-icon-width': setRemoveIconWidth({
                    hasLabel: this.hasLabel,
                    removable: this.removable,
                    hasIcon: this.hasIcon
                }),
                '--dl-chip-text-color': setTextColor({
                    outlined: this.outlined,
                    filled: this.filled,
                    disabled: this.disabled,
                    textColor: this.textColor
                }),
                '--dl-chip-bg-color': setBgColor({
                    outlined: this.outlined,
                    disabled: this.disabled,
                    color: this.color
                }),
                '--dl-chip-border': setBorder({
                    disabled: this.disabled,
                    color: this.color
                }),
                '--dl-chip-padding': setPadding({
                    hasLabel: this.hasLabel,
                    removable: this.removable,
                    hasIcon: this.hasIcon
                }),
                '--dl-chip-left-icon-color': setLeftIconColor({
                    color: this.computedIconColor,
                    disabled: this.disabled
                }),
                '--dl-chip-left-icon-active-opacity': this.disabled ? 1 : 0.5,
                '--dl-chip-left-icon-hover-opacity': this.disabled ? 1 : 0.8,
                '--dl-chip-left-icon-cursor': this.disabled
                    ? 'not-allowed'
                    : 'pointer',
                '--dl-chip-text-transform': this.transform
            }
        }
    },
    methods: {
        onRemove(e: Event) {
            if (!this.disabled) {
                this.$emit('remove', this.label)
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-chip {
    position: relative;
    vertical-align: middle;
    text-transform: var(--dl-chip-text-transform);
    font-size: var(--dl-font-size-body);
    line-height: 12px;
    border-radius: 2px;
    padding: var(--dl-chip-padding);
    outline: 0;
    min-width: 18px; // +2px from borders
    max-height: 18px; // +2px from borders
    min-height: 12px;
    height: fit-content;
    max-width: var(--dl-chip-max-width);
    width: fit-content;
    color: var(--dl-chip-text-color);
    background-color: var(--dl-chip-bg-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: var(--dl-chip-border);
    &::first-letter,
    & > *::first-letter {
        text-transform: capitalize;
    }
}
.dl-chip-remove-icon-container {
    cursor: var(--dl-chip-left-icon-cursor);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--dl-chip-remove-icon-width); // +2px from borders
    top: 0;
    bottom: 0;
    right: 0;
    &:active {
        opacity: var(--dl-chip-left-icon-active-opacity);
    }
    &:hover:not(:disabled) {
        opacity: var(--dl-chip-left-icon-hover-opacity);
    }
}

.dl-chip-left-icon-container {
    @extend .dl-chip-remove-icon-container;
    cursor: text;
    left: 0;
    width: 18px;
    &:active {
        opacity: 1;
    }
    &:hover:not(:active) {
        opacity: 1;
    }
}

.dl-chip-left-icon {
    color: var(--dl-chip-left-icon-color);
}

.dl-chip-remove-icon {
    color: var(--dl-chip-text-color);
}
</style>
