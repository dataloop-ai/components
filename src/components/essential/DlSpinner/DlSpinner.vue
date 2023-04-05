<template>
    <div>
        <component
            :is="spinnerType"
            :size="size"
            :color="color"
            :thickness="thickness"
            :border-color="borderColor"
            :icon-size="iconSize"
            :icon-color="iconColor"
        />
        <div
            v-if="text"
            class="spinner-text"
            :style="textStyles"
        >
            <span>{{ text }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlSpinnerGrid,
    DlSpinnerCircle,
    DlSpinnerClock,
    DlSpinnerDots,
    DlSpinnerLogo
} from './index'

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
            type: String,
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
                case 'grid':
                    return 'DlSpinnerGrid'
                case 'circle':
                    return 'DlSpinnerCircle'
                case 'dots':
                    return 'DlSpinnerDots'
                case 'clock':
                    return 'DlSpinnerClock'
                default:
                    return 'DlSpinnerLogo'
            }
        }
    }
})
</script>
