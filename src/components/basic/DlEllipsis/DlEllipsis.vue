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
import { defineComponent, ref, computed } from 'vue-demi'
import DlTooltip from '../../essential/DlTooltip/DlTooltip.vue'
import { useSizeObserver } from '../../../hooks/use-size-observer'

export default defineComponent({
    name: 'DlEllipsis',
    components: {
        DlTooltip
    },
    props: {
        text: {
            type: String,
            required: true
        },
        middleEllipsis: {
            type: Boolean,
            default: false,
            required: false
        },
        splitLength: {
            type: Number,
            required: false,
            default: 0.75
        },
        tooltip: {
            type: Boolean,
            default: true,
            required: false
        }
    },
    setup(props) {
        const { text, middleEllipsis, splitLength } = props

        const dlEllipsisRef = ref(null)
        const splitIndex = computed(() =>
            middleEllipsis ? Math.round(text.length * splitLength) : text.length
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
