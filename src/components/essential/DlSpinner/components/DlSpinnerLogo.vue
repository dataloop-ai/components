<template>
    <div class="dl-spinner-wrapper">
        <svg
            :width="size"
            :height="size"
            viewBox="0 0 50 50"
            shape-rendering="geometricPrecision"
        >
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="var(--dell-white)"
                stroke="none"
            />
            <circle
                class="spinner-arc"
                cx="25"
                cy="25"
                r="16.5"
                fill="none"
                stroke="var(--dell-blue-500)"
                stroke-width="1.39"
                stroke-linecap="round"
            />
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlSpinnerLogo',
    props: {
        size: {
            type: String,
            default: '64px'
        }
    }
})
</script>

<style lang="scss" scoped>
@import '../styles/spinnerStyles.scss';

@keyframes dell-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dell-dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}

svg {
    animation: dell-spin 1.4s linear infinite;
}

.spinner-arc {
    animation: dell-dash 1.4s ease-in-out infinite;
    transform-origin: center;
}
</style>
