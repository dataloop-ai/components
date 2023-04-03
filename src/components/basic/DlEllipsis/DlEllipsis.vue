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
        tooltip: {
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
            props.middleEllipsis
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
