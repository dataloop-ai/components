<template>
    <div class="dl-ellipsis">
        <span
            ref="dlEllipsisRef"
            class="dl-ellipsis__left"
        >
            <slot
                v-if="!!$slots.default"
                name="default"
            />
            <span v-else>
                {{ leftText }}
            </span>
        </span>
        <span
            v-if="rightText"
            class="dl-ellipsis__right"
        >
            {{ rightText }}
        </span>
        <dl-tooltip
            v-if="hasEllipsis && tooltip"
            max-width="max-content"
            :self="tooltipPosition"
            :anchor="tooltipPosition"
            :offset="tooltipOffset"
        >
            <slot
                v-if="!!$slots.default"
                name="default"
            />
            <span v-else>
                {{ fullText }}
            </span>
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRef } from 'vue-demi'
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
            default: '',
            required: false
        },
        /**
         * Allows to split the text in two parts
         */
        split: {
            type: Boolean,
            default: false,
            required: false
        },
        /**
         * Position of the split in the text, % of the text length
         */
        splitPosition: {
            type: Number,
            required: false,
            default: 0.5,
            validator: (value: number) => value >= 0 && value <= 1
        },
        /**
         * Tooltip to be displayed when the text is truncated
         */
        tooltip: {
            type: Boolean,
            default: true,
            required: false
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
    setup(props) {
        const textProp = computed(() => props.text)
        const splitPositionProp = computed(() => props.splitPosition)
        const splitPositionsRef = computed(() => {
            if (!textProp.value?.length) return 0
            return Math.min(Math.max(splitPositionProp.value, 1), 0)
        })

        const dlEllipsisRef = ref(null)
        const splitIndex = computed(() => {
            if (!props.text?.length) return null
            return props.split
                ? Math.round(props.text.length * splitPositionsRef.value)
                : props.text.length
        })

        const leftText = computed(() => {
            if (!splitIndex.value) return
            return props.text.slice(0, splitIndex.value)
        })
        const rightText = computed(() => {
            if (!splitIndex.value) return
            return props.text.slice(splitIndex.value)
        })

        const { hasEllipsis } = useSizeObserver(dlEllipsisRef)
        const fullText = computed(() => props.text)

        return {
            leftText,
            rightText,
            fullText,
            dlEllipsisRef,
            hasEllipsis
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
