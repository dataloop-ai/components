<template>
    <div class="spinner-wrapper">
        <svg
            class="dl-spinner"
            :width="size"
            :height="size"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke-width="4"
                stroke-miterlimit="10"
                :stroke="color"
            />
            <line
                stroke-linecap="round"
                stroke-width="4"
                stroke-miterlimit="10"
                :stroke="color"
                x1="50"
                y1="50"
                x2="85"
                y2="50.5"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </line>

            <line
                stroke-linecap="round"
                stroke-width="4"
                stroke-miterlimit="10"
                :stroke="color"
                x1="50"
                y1="50"
                x2="49.5"
                y2="74"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="15s"
                    repeatCount="indefinite"
                />
            </line>
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        size: {
            type: String,
            default: '40px'
        },
        color: {
            type: String,
            default: 'var(--dl-color-secondary)'
        }
    }
})
</script>

<style lang="scss" src="../styles/spinnerStyles.scss" />
