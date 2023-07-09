<template>
    <div class="dl-ellipsis">
        <span
            ref="dlEllipsisRef"
            class="dl-ellipsis__left"
        >
            <slot>
                <span>{{ leftText }}</span>
            </slot>
        </span>
        <span
            v-if="rightText"
            class="dl-ellipsis__right"
        >
            {{ rightText }}
        </span>
        <dl-tooltip
            v-if="shouldShowTooltip"
            :max-width="'max-content'"
            :self="tooltipPosition"
            :anchor="tooltipPosition"
            :offset="tooltipOffset"
        >
            <slot>
                <span>{{ fullText }}</span>
            </slot>
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRef } from 'vue-demi'
import { DlTooltip } from '../../shared'
import { useSizeObserver } from '../../../hooks/use-size-observer'

export default defineComponent({
    name: 'DlEllipsis',
    components: {
        DlTooltip
    },
    props: {
        /**
         * Text to be displayed
         */
        text: {
            type: String,
            default: ''
        },
        /**
         * Allows to split the text in two parts
         */
        split: {
            type: Boolean,
            default: false
        },
        /**
         * Position of the split in the text, % of the text length
         */
        splitPosition: {
            type: Number,
            default: 0.5,
            validator: (value: number) => value >= 0 && value <= 1
        },
        /**
         * Tooltip to be displayed when the text is truncated
         */
        tooltip: {
            type: Boolean,
            default: true
        },
        tooltipPosition: {
            type: String,
            default: 'top middle'
        },
        tooltipOffset: {
            type: Array,
            default: () => [0, 25]
        }
    },
    // TODO: fix type issue here
    setup(props: any, { slots }: any) {
        const dlEllipsisRef = ref(null)
        const textRef = toRef(props, 'text')
        const { hasEllipsis } = useSizeObserver(dlEllipsisRef)
        const hasDefaultSlot = computed(() => !!slots.default)
        const splitIndex = computed(() => {
            if (!textRef.value.length) return null
            return props.split
                ? Math.round(textRef.value.length * props.splitPosition)
                : textRef.value.length
        })
        const leftText = computed(() => {
            if (splitIndex.value !== null) {
                return textRef.value.slice(0, splitIndex.value)
            }
            return ''
        })
        const rightText = computed(() => {
            if (splitIndex.value !== null) {
                return textRef.value.slice(splitIndex.value)
            }
            return ''
        })
        const shouldShowTooltip = computed(
            () => hasEllipsis.value && props.tooltip
        )
        const fullText = computed(() => textRef.value)

        return {
            hasDefaultSlot,
            leftText,
            rightText,
            shouldShowTooltip,
            fullText,
            dlEllipsisRef
        }
    }
})
</script>

<style scoped lang="scss">
.dl-ellipsis {
    display: flex;
    overflow: hidden;

    &__left {
        flex: 0 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__right {
        flex: 1 0 auto;
        overflow: hidden;
    }
}
</style>
