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
        <dl-tooltip v-if="hasEllipsis && hasTooltip">
            {{ fullText }}
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import DlTooltip from '../components/DlTooltip.vue'
import { useSizeObserver } from '../hooks/use-size-observer'

export default defineComponent({
    name: 'DlEllipsis',
    components: {
        DlTooltip
    },
    props: {
        text: {
            type: String,
            default: '',
            required: true
        },
        hasEllipsisInMiddle: {
            type: Boolean,
            default: false,
            required: false
        },
        hasTooltip: {
            type: Boolean,
            default: true,
            required: false
        }
    },
    setup(props) {
        const dlEllipsisRef = ref(null)
        const leftText = ref('')
        const rightText = ref('')
        const { hasEllipsis } = useSizeObserver(dlEllipsisRef)

        const splitIndex = computed(() =>
            props.hasEllipsisInMiddle
                ? Math.round(props.text.length * 0.75)
                : props.text.length
        )

        const fullText = computed(() => props.text)
        leftText.value = props.text.slice(0, splitIndex.value)
        rightText.value = props.text.slice(splitIndex.value)

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
        // The left side CANNOT GROW, it can ONLY SHRINK (and add an ellipsis at the end).
        flex: 0 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__right {
        // The right side can grow, but NOT SHRINK.
        flex: 1 0 auto;
        overflow: hidden;
    }
}
</style>
