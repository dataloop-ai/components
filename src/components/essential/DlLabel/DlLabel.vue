<template>
    <div
        :id="uuid"
        class="dl-label"
        :style="styles"
        @mouseenter="mouseOver = true"
        @mouseleave="mouseOver = false"
    >
        <div class="dl-label__prefix">
            <slot name="prefix">
                <div v-if="indicatorColor" class="dl-label__line" />
            </slot>
        </div>
        <div class="dl-label__content">
            <span v-if="prefix">{{ prefixPreview }}</span>
            <dl-ellipsis
                v-if="text"
                class="dl-label__text"
                :class="!suffix && fluid ? 'dl-label__fluid' : ''"
                :text="text"
            />
            <dl-ellipsis v-else class="dl-label__text">
                <slot name="default" />
            </dl-ellipsis>
            <span
                v-if="suffix || hasSuffixSlot"
                class="dl-label__suffix-content"
                :class="{ 'dl-label__fluid': fluid }"
            >
                <slot name="suffix">
                    <dl-ellipsis :text="suffixPreview" />
                </slot>
            </span>
            <div
                v-if="hint || hasHintSlot || hasActions"
                class="dl-label__suffix"
            >
                <div class="dl-label__suffix-slot">
                    <slot v-if="mouseOver" name="actions" />
                </div>
                <slot name="hint">
                    <dl-icon
                        v-if="hint"
                        class="dl-label__suffix-icon"
                        icon="icon-dl-info"
                    >
                        <dl-tooltip>{{ hint }}</dl-tooltip>
                    </dl-icon>
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { DlTooltip } from '../../shared'
// todo: this will cause issues
import { DlIcon, DlEllipsis } from '../../essential'
import { computed, defineComponent, ref, toRef, toRefs } from 'vue-demi'
import { getColor } from '../../../utils'

export default defineComponent({
    name: 'DlLabel',
    components: { DlEllipsis, DlIcon, DlTooltip },
    props: {
        /**
         * Text to be displayed
         */
        text: {
            type: String,
            default: ''
        },
        /**
         * Prefix to be displayed
         */
        prefix: {
            type: String,
            default: null
        },
        /**
         * Suffix to be displayed
         */
        suffix: {
            type: String,
            default: null
        },
        /**
         * Color of the left side line
         */
        indicatorColor: {
            type: String,
            default: null
        },
        /**
         * Text to be displayed inside the info tooltip
         */
        hint: {
            type: String,
            default: null
        },
        /**
         * Label text color
         */
        color: {
            type: String,
            default: 'dell-gray-800'
        },
        /**
         * Will fill the container size its given
         */
        fluid: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit, slots }) {
        const mouseOver = ref(false)
        const { indicatorColor, color, prefix, suffix } = toRefs(props)

        const styles = computed<Record<string, any>>(() => {
            return {
                '--dl-label-color': getColor(indicatorColor.value),
                '--dl-label-text-color': getColor(color.value)
            }
        })

        const hasActions = computed(() => {
            return !!slots['actions']
        })

        const hasSuffixSlot = computed(() => {
            return !!slots['suffix']
        })

        const hasHintSlot = computed(() => {
            return !!slots['hint']
        })

        const prefixPreview = computed(() => {
            return prefix.value?.trim() ?? ''
        })
        const suffixPreview = computed(() => {
            return suffix.value?.trim() ?? ''
        })

        return {
            uuid: `dl-text-holder-${v4()}`,
            mouseOver,
            styles,
            hasActions,
            hasSuffixSlot,
            hasHintSlot,
            prefixPreview,
            suffixPreview
        }
    }
})
</script>

<style scoped lang="scss">
.dl-label {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    white-space: nowrap;
    position: relative;
    &__line {
        border-radius: 2px;
        background-color: var(--dl-label-color);
        width: 2px;
        height: 100%;
        margin-right: 5px;
    }
    &__suffix {
        height: 100%;
        margin-left: 5px;
        display: flex;
        align-items: center;
        &-icon {
            cursor: pointer;
        }
        &-content {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1 0 auto;
        }
    }
    &__content {
        color: var(--dl-label-text-color);
        display: flex;
        width: 100%;
    }
    &__text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__fluid {
        flex-grow: 100;
        max-width: 100%;
    }
}
</style>
