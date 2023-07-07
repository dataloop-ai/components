<template>
    <div
        :id="uuid"
        class="dl-label"
        :style="styles"
        @mouseleave="handleMouseleave"
        @mouseenter="handleMouseenter"
    >
        <div class="dl-label__prefix">
            <slot name="prefix">
                <div
                    v-if="labelColor"
                    class="dl-label__line"
                />
            </slot>
        </div>
        <div class="dl-label__text">
            <dl-ellipsis :text="text" />
            <div
                class="dl-label__suffix"
                v-on="hasSuffix ? { mouseenter: handleMouseenterSuffix } : {}"
            >
                <div class="dl-label__suffix-slot">
                    <slot
                        v-if="isExpanded && hasSuffix"
                        name="suffix"
                    >
                        <slot name="actions" />
                    </slot>
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
import { DlEllipsis } from '../../basic/DlEllipsis'
import { DlIcon, DlTooltip } from '../../essential'
import { defineComponent } from 'vue-demi'
import { getColor } from '../../../utils'

export default defineComponent({
    name: 'DlTextHolder',
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
        }
    },
    data() {
        return {
            uuid: `dl-text-holder-${v4()}`,
            isExpanded: false,
            timer: null
        }
    },
    computed: {
        styles() {
            return {
                '--dl-label-color': getColor(this.labelColor),
                '--dl-label-slot-visibility': this.isExpanded
                    ? 'visible'
                    : 'hidden'
            }
        },
        hasSuffix() {
            return !!this.$slots.suffix
        }
    },
    methods: {
        handleMouseleave() {
            this.timer = window.setTimeout(() => {
                this.isExpanded = false
                this.timer = null
            }, 800)
        },
        handleMouseenter() {
            if (this.timer) {
                window.clearTimeout(this.timer)
            }
        },
        handleMouseenterSuffix() {
            this.isExpanded = true
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
        width: 16px;
        margin-left: 5px;
        position: relative;
        &-icon {
            cursor: pointer;
        }
        &-slot {
            border-radius: 3px;
            visibility: var(--dl-label-slot-visibility);
            background: var(--dl-color-tooltip-text);
            right: 20px;
            position: absolute;
            // padding: 5px;
        }
    }
    &__text {
        width: 95%;
        display: flex;
    }
}
</style>
