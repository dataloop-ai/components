<template>
    <div class="dl-ellipsis">
        <span
            ref="dlEllipsisRef"
            class="dl-ellipsis__left"
        >
            <slot
                v-if="hasDefaultSlot"
                name="default"
            />
            <span v-else>{{ leftText }}</span>
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
            <slot
                v-if="hasDefaultSlot"
                name="default"
            />
            <span v-else>{{ fullText }}</span>
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import DlTooltip from '../../essential/DlTooltip/DlTooltip.vue'
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
            validator: (value) => value >= 0 && value <= 1
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
    setup(props: any, { slots }) {
        const dlEllipsisRef = ref(null)
        const { hasEllipsis } = useSizeObserver(dlEllipsisRef)

        const hasDefaultSlot = computed(() => !!slots.default)
        const splitIndex = computed(() => {
            if (!props.text.length) return null
            return props.split
                ? Math.round(props.text.length * props.splitPosition)
                : props.text.length
        })
        const leftText = computed(() => {
            if (splitIndex.value !== null) {
                return props.text.slice(0, splitIndex.value)
            }
            return ''
        })
        const rightText = computed(() => {
            if (splitIndex.value !== null) {
                return props.text.slice(splitIndex.value)
            }
            return ''
        })
        const shouldShowTooltip = computed(
            () => hasEllipsis.value && props.tooltip
        )
        const fullText = computed(() => props.text)

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
