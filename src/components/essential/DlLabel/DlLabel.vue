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
                <div
                    v-if="labelColor"
                    class="dl-label__line"
                />
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
            <dl-ellipsis
                v-else
                class="dl-label__text"
            >
                <slot name="default" />
            </dl-ellipsis>
            <span
                v-if="suffix"
                :class="fluid ? 'dl-label__fluid' : ''"
            >
                {{ suffixPreview }}</span>
            <div class="dl-label__suffix">
                <div class="dl-label__suffix-slot">
                    <slot
                        v-if="mouseOver"
                        name="actions"
                    />
                </div>
                <dl-icon
                    v-if="hint"
                    class="dl-label__suffix-icon"
                    icon="icon-dl-info"
                >
                    <dl-tooltip>{{ hint }}</dl-tooltip>
                </dl-icon>
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
        labelColor: {
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
            default: 'dl-color-darker'
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
        const { labelColor, color, prefix, suffix } = toRefs(props)

        const styles = computed<Record<string, any>>(() => {
            return {
                '--dl-label-color': getColor(labelColor.value),
                '--dl-label-text-color': getColor(color.value)
            }
        })

        const hasActions = computed(() => {
            return !!slots['actions']
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
    }
    &__content {
        color: var(--dl-label-text-color);
        display: flex;
        width: 95%;
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
