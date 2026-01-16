<template>
    <div
        class="dl-ellipsis"
        :class="multiline ? 'dl-ellipsis__multiline' : ''"
        :style="cssVars"
    >
        <p
            v-if="multiline"
            ref="dlEllipsisRef"
            :class="`dl-ellipsis__multiline-text ${textClass}`"
            @click="onClick"
        >
            {{ fullText }}
        </p>
        <span
            v-if="!multiline"
            ref="dlEllipsisRef"
            :class="`dl-ellipsis__left ${textClass}`"
        >
            <slot v-if="hasDefaultSlot" name="default" />
            <span v-else style="white-space: nowrap" @click="onClick">{{
                leftText
            }}</span>
        </span>
        <span
            v-if="!multiline && rightText"
            :class="`dl-ellipsis__right ${textClass}`"
            @click="onClick"
        >
            {{ rightText }}
        </span>
        <dl-tooltip
            v-if="shouldShowTooltip"
            :max-width="'30vw'"
            :self="tooltipPosition"
            :anchor="tooltipPosition"
            :offset="tooltipOffset"
        >
            <span v-if="tooltipText">{{ tooltipText }}</span>
            <slot v-else-if="hasDefaultSlot" name="default" />
            <span v-else>{{ fullText }}</span>
        </dl-tooltip>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    onMounted,
    getCurrentInstance
} from 'vue-demi'
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
        },
        tooltipText: {
            type: String,
            default: ''
        },
        /**
         * Allows to display multiline text
         */
        multiline: {
            type: Boolean,
            default: false
        },
        /**
         * Number of lines to display
         * must be used with multiline
         */
        maxLines: {
            type: Number,
            default: 3
        },
        textClass: {
            type: String,
            default: ''
        }
    },
    emits: ['click'],
    // TODO: fix type issue here
    setup(props: any, { slots }: any) {
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
            () => props.tooltip && (hasEllipsis.value || !!props.tooltipText)
        )
        const fullText = computed(() => props.text)

        const cssVars = computed<Record<string, string | number>>(() => {
            return {
                '--max-lines': props.maxLines
            }
        })

        onMounted(() => {
            const vm = getCurrentInstance()
            // @ts-ignore
            window.vm = vm
        })

        return {
            hasDefaultSlot,
            leftText,
            rightText,
            shouldShowTooltip,
            fullText,
            dlEllipsisRef,
            hasEllipsis,
            cssVars
        }
    },
    methods: {
        onClick(e: Event) {
            this.$emit('click', e)
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

    &__multiline {
        /* Set the number of lines to display */
        display: -webkit-box;
        /* Enable text ellipsis */
        overflow: hidden;
        /* Allow text to break into multiple lines */
        -webkit-box-orient: vertical;
        /* Enable vertical scrolling if necessary */
        overflow-y: auto;
        /* Hide the horizontal scrollbar */
        overflow-x: hidden;

        &-text {
            /* Set the number of lines to display */
            display: -webkit-box;
            -webkit-line-clamp: var(
                --max-lines,
                3
            ); /* Adjust this value as needed */
            /* Enable text ellipsis */
            overflow: hidden;
            /* Allow text to break into multiple lines */
            -webkit-box-orient: vertical;
            white-space: normal;
        }
    }
}
</style>
