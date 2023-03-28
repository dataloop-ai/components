<template>
    <div
        class="dl-thumb"
        :style="rootStyles"
        v-bind="$attrs"
    >
        <dl-icon
            v-if="icon"
            :color="iconColor"
            :icon="icon"
            :size="iconSize"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue-demi'
import { getColor } from '../../../utils'
import { DlIcon } from '../../essential'

export default defineComponent({
    name: 'DlBrushThumb',
    components: {
        DlIcon
    },
    props: {
        icon: {
            type: String,
            default: null
        },
        iconSize: {
            type: String,
            default: '18px'
        },
        iconColor: {
            type: String,
            default: null
        },
        bgColor: {
            type: String,
            default: 'dl-color-secondary'
        },
        hoverBgColor: {
            type: String,
            default: 'dl-color-hover'
        }
    },
    setup(props, { emit }) {
        const rootStyles = computed(() => {
            return {
                '--icon-color': getColor(
                    props.iconColor,
                    'dl-color-text-buttons'
                ),
                '--bg-color': getColor(props.bgColor),
                '--bg-color-hover': getColor(props.hoverBgColor)
            }
        })

        return {
            rootStyles
        }
    }
})
</script>

<style scoped lang="scss">
.dl-thumb {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-color);
    & > div {
        display: flex !important;
        justify-content: center;
        align-items: center;
    }
    &:hover {
        background-color: var(--bg-color-hover);
    }
}
</style>
