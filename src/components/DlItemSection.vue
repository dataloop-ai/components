<template>
    <div
        :id="uuid"
        :style="cssVars"
        :class="classes"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, ref, computed } from 'vue-demi'
import { getColor } from '../utils'

export default defineComponent({
    name: 'DlItemSection',
    props: {
        color: {
            type: String,
            default: null
        },
        side: Boolean,
        noWrap: Boolean
    },
    setup(props) {
        const uuid = `dl-item-section-${v4()}`

        const classes = computed(() => {
            return {
                'dl-item__section': true,
                'dl-item__section--side': props.side,
                'dl-item__section--nowrap': props.noWrap,
                'dl-item__section--main': !props.side
            }
        })
        const cssVars = computed(() => {
            return {
                '--dl-item-color': props.color
                    ? getColor(props.color)
                    : 'inherit'
            }
        })

        return {
            uuid,
            classes,
            cssVars
        }
    }
})
</script>

<style scoped lang="scss">
.dl-item__section {
    padding-left: 0;
    padding-right: 0;
    font-size: var(--dl-font-size-body);
    color: var(--dl-item-color);
    min-width: 0;
    justify-content: flex-start;
    &--nowrap {
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow-middle: ellipsis;
        & > * {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    &--side {
        align-items: flex-start;
        padding-right: 10px;
        width: auto;
        min-width: 0;
        max-width: 100%;
    }
    &--main {
        width: auto;
        min-width: 0;
        max-width: 100%;
        flex: 10000 1 0%;
        & + & {
            margin-left: 8px;
        }
        ~ .dl-item__section--side {
            align-items: flex-end;
            padding-right: 0;
            padding-left: 10px;
        }
    }
}
</style>
