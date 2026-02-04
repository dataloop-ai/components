<template>
    <div
        v-if="isVisible"
        :id="uuid"
        :tabindex="tabIndex"
        class="dl-chip"
        :class="chipClass"
        :style="cssChipVars"
        @click="$emit('click')"
    >
        <slot name="prefix" />
        <span v-if="hasIcon" class="dl-chip-left-icon-container">
            <dl-icon class="dl-chip-left-icon" size="12px" :icon="icon" />
        </span>
        <dl-tooltip v-if="overflow && isOverflowing">
            {{ label }}
        </dl-tooltip>
        <div v-if="hasLabelSlot || hasLabel" class="dl-chip--content">
            <div
                ref="dlChipRef"
                :class="{
                    'dl-chip--ellipsis': overflow,
                    'dl-chip--no-overflow': !overflow,
                    'dl-chip--clickable': clickable
                }"
            >
                <slot>
                    {{ hasLabel ? label : null }}
                </slot>
            </div>
        </div>
        <slot name="suffix" />
        <span
            v-if="removable"
            class="dl-chip-remove-icon-container"
            @click="remove"
        >
            <dl-icon
                class="dl-chip-remove-icon"
                size="12px"
                icon="icon-dl-close"
            /></span>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue-demi'
import { DlTooltip } from '../../shared'
import { DlIcon } from '../../essential'
import { useSizeObserver } from '../../../hooks/use-size-observer'
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
import { DlTextTransformOptions } from '../../shared/types'

export default defineComponent({
    name: 'DlChip',
    components: {
        'dl-tooltip': DlTooltip,
        'dl-icon': DlIcon
    },
    props: {
        disabled: Boolean,
        filled: { type: Boolean, default: true },
        noBorder: { type: Boolean, default: false },
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
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },
        overflow: { type: Boolean, default: false },
        fit: { type: Boolean, default: false },
        clickable: { type: Boolean, default: false }
    },
    emits: ['remove', 'ellipsis', 'click'],
    setup(props, ctx) {
        const isVisible = ref(true)
        const dlChipRef = ref(null)
        const label = ref(props.label)
        const { hasEllipsis } = useSizeObserver(dlChipRef, label)

        watch(hasEllipsis, () => {
            ctx.emit('ellipsis', hasEllipsis.value)
        })

        return {
            isVisible,
            uuid: `dl-chip-${v4()}`,
            dlChipRef,
            isOverflowing: hasEllipsis
        }
    },
    computed: {
        hasLabel(): boolean {
            return !!this.label
        },
        hasLabelSlot(): boolean {
            return !!this.$slots['default']
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
        chipClass(): string {
            let classes = `dl-text-transform--${this.transform}`
            if (this.clickable) {
                classes += ' dl-chip--clickable'
            }
            return classes
        },
        cssChipVars(): Record<string, string | number> {
            return {
                '--dl-chip-max-width': this.fit
                    ? 'fit-content'
                    : setMaxWidth(this.maxWidth),
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
                    noBorder: this.noBorder,
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
                    : 'pointer'
            }
        }
    },
    methods: {
        remove(e: Event) {
            if (!this.disabled) {
                this.isVisible = false
                this.$emit('remove')
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-chip {
    position: relative;
    display: flex;
    vertical-align: middle;
    font-size: var(--dl-font-size-body);
    line-height: 12px;
    border-radius: 2px !important;
    padding: var(--dl-chip-padding);
    outline: 0;
    min-width: 18px;
    min-height: 12px;
    max-width: var(--dl-chip-max-width);
    color: var(--dl-chip-text-color);
    background-color: var(--dl-chip-bg-color);
    border: var(--dl-chip-border);

    &--content {
        cursor: default;
        width: auto;
        min-width: 0;
        max-width: 100%;
        display: flex;
        align-items: center;
    }

    &--ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    &--no-overflow {
        overflow-wrap: break-word;
    }

    &--clickable {
        cursor: pointer;
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
    cursor: default;
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
    display: flex !important;
}
</style>
