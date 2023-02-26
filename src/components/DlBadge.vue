<template>
    <div
        :id="uuid"
        :class="classes"
        :style="style"
        role="status"
    >
        <slot v-if="hasSlot" />
        <span v-else>{{ label }}</span>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { computed } from 'vue-demi'
import { defineComponent } from 'vue-demi'

const alignValues = ['top', 'middle', 'bottom']

export default defineComponent({
    props: {
        color: { type: String, default: 'var(--dl-color-negative)' },
        textColor: { type: String, default: 'var(--dl-color-text-buttons)' },

        floating: { type: Boolean, default: false },
        transparent: { type: Boolean, default: false },
        multiline: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        rounded: { type: Boolean, default: true },

        label: { type: String, default: null },

        align: {
            type: String,
            default: null,
            validator: (v: string) => alignValues.includes(v)
        }
    },

    setup(props, { slots }) {
        const hasSlot = computed(() => slots.default)

        const style = computed(() => {
            return {
                verticalAlign: props.align !== void 0 ? props.align : null,
                aspectRatio: hasSlot.value || props.label ? '' : '1/1',
                padding:
                    hasSlot.value || props.label
                        ? `3px ${props.multiline ? '8px' : ''}`
                        : '',
                '--dl-color-badge': props.color,
                '--dl-color-badge-text': props.textColor
            }
        })

        const classes = computed(() => {
            const text =
                props.outline === true
                    ? props.color || props.textColor
                    : props.textColor

            return (
                'dl-badge flex inline items-center no-wrap' +
                ` dl-badge--${
                    props.multiline === true ? 'multi' : 'single'
                }-line` +
                (props.outline === true
                    ? ' dl-badge--outline'
                    : props.color !== void 0
                    ? ` bg-${props.color}`
                    : '') +
                (text !== void 0 ? ` text-${text}` : '') +
                (props.floating === true ? ' dl-badge--floating' : '') +
                (props.rounded === true ? ' dl-badge--rounded' : '') +
                (props.transparent === true ? ' dl-badge--transparent' : '')
            )
        })

        return {
            uuid: `dl-badge-${v4()}`,
            classes,
            style,
            hasSlot
        }
    }
})
</script>

<style scoped lang="scss">
.dl-badge {
    background-color: var(--dl-color-badge);
    color: var(--dl-color-badge-text);
    border-radius: 2px;
    font-size: 12px;
    line-height: 12px;
    min-height: 12px;
    font-weight: normal;
    vertical-align: baseline;

    &--single-line {
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    &--multi-line {
        word-break: break-all;
        word-wrap: break-word;
    }
    &--floating {
        position: absolute;
        top: -4px;
        right: -3px;
        cursor: inherit;
    }
    &--transparent {
        opacity: 0.8;
    }
    &--outline {
        background-color: transparent;
        border: 1px solid var(--dl-color-badge);
    }
    &--rounded {
        border-radius: 1em;
    }
}
</style>
