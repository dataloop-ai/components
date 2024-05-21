<template>
    <div class="dl-spinner-wrapper">
        <svg
            :width="size"
            :height="size"
            viewBox="0 0 64 64"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
        >
            <g class="first-rect">
                <rect />
            </g>
            <g class="second-rect">
                <rect />
            </g>
            <g class="third-rect">
                <rect />
            </g>
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

@keyframes moveFirstRect {
    0% {
        transform: translate(2px, 2px);
    }
    25%,
    75% {
        transform: translate(38px, 2px);
    }
    95%,
    100% {
        transform: translate(38px, 38px);
    }
}

@keyframes moveSecondRect {
    0%,
    25% {
        transform: translate(2px, 38px);
    }
    45%,
    100% {
        transform: translate(2px, 2px);
    }
}

@keyframes moveThirdRect {
    0%,
    50% {
        transform: translate(38px, 38px);
    }
    70%,
    100% {
        transform: translate(2px, 38px);
    }
}

rect {
    width: 24px;
    height: 24px;
    fill: #ffd7e2;
    stroke: #ef6284;
    stroke-width: 4;
}

.first-rect {
    animation: moveFirstRect 2s ease-out infinite;
}

.second-rect {
    animation: moveSecondRect 2s ease-out infinite;
}

.third-rect {
    animation: moveThirdRect 2s ease-out infinite;
}
</style>
