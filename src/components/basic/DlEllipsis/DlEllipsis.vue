<template>
    <div class="dl-ellipsis">
        <span
            ref="dlEllipsisRef"
            class="dl-ellipsis__left"
        >
            {{ leftText }}
        </span>
        <span
            v-if="rightText"
            class="dl-ellipsis__right"
        >
            {{ rightText }}
        </span>
        <dl-tooltip v-if="hasEllipsis && tooltip">
            {{ fullText }}
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
            required: true
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
        }
    },
    setup(props) {
        const { text, split } = props

        const splitPositionsRef = toRef(props, 'splitPosition')
        splitPositionsRef.value = Math.min(
            Math.max(splitPositionsRef.value, 1),
            0
        )

        const dlEllipsisRef = ref(null)
        const splitIndex = computed(() =>
            split
                ? Math.round(text.length * splitPositionsRef.value)
                : text.length
        )

        const leftText = computed(() => text.slice(0, splitIndex.value))
        const rightText = computed(() => text.slice(splitIndex.value))

        const { hasEllipsis } = useSizeObserver(dlEllipsisRef)
        const fullText = computed(() => text)

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
