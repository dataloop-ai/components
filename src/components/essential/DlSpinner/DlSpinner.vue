<template>
    <div class="non-selectable">
        <component
            :is="spinnerType"
            :size="size"
            :color="color"
            :thickness="thickness"
            :border-color="borderColor"
            :icon-size="iconSize"
            :icon-color="iconColor"
        />
        <div v-if="text" class="dl-spinner-text" :style="textStyles">
            <span>{{ text }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import DlSpinnerGrid from './components/DlSpinnerGrid.vue'
import DlSpinnerCircle from './components/DlSpinnerCircle.vue'
import DlSpinnerClock from './components/DlSpinnerClock.vue'
import DlSpinnerDots from './components/DlSpinnerDots.vue'
import DlSpinnerLogo from './components/DlSpinnerLogo.vue'
import { DlSpinnerTypes } from './types'

export default defineComponent({
    components: {
        DlSpinnerGrid,
        DlSpinnerCircle,
        DlSpinnerClock,
        DlSpinnerDots,
        DlSpinnerLogo
    },
    props: {
        text: {
            type: String,
            default: null
        },
        textStyles: {
            type: Object,
            default: null
        },
        type: {
            type: String as PropType<DlSpinnerTypes>,
            default: 'default'
        },
        size: {
            type: String,
            default: '60px'
        },
        color: {
            type: String,
            default: 'var(--dl-color-secondary)'
        },
        iconColor: {
            type: String,
            default: 'var(--dl-color-tooltip-background)'
        },
        iconSize: {
            type: String,
            default: '25px'
        },
        borderColor: {
            type: String,
            default: 'var(--dl-color-separator)'
        },
        thickness: {
            type: String,
            default: '3px'
        }
    },
    computed: {
        spinnerType() {
            switch (this.type.toLowerCase()) {
                case DlSpinnerTypes.GRID:
                    return 'DlSpinnerGrid'
                case DlSpinnerTypes.CIRCLE:
                    return 'DlSpinnerCircle'
                case DlSpinnerTypes.DOTS:
                    return 'DlSpinnerDots'
                case DlSpinnerTypes.CLOCK:
                    return 'DlSpinnerClock'
                default:
                    return 'DlSpinnerLogo'
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-spinner-text {
    color: var(--dell-white);
    margin-top: 12px;
}
</style>
