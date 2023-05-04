<template>
    <div class="spinner-wrapper">
        <svg
            class="dl-spinner"
            :fill="color"
            :width="size"
            :height="size"
            viewBox="0 0 120 30"
        >
            <circle
                cx="15"
                cy="15"
                r="15"
            >
                <animate
                    attributeName="r"
                    from="15"
                    to="15"
                    begin="0s"
                    dur="0.8s"
                    values="15;9;15"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from="1"
                    to="1"
                    begin="0s"
                    dur="0.8s"
                    values="1;.5;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>

            <circle
                cx="60"
                cy="15"
                r="9"
                fill-opacity=".3"
            >
                <animate
                    attributeName="r"
                    from="9"
                    to="9"
                    begin="0s"
                    dur="0.8s"
                    values="9;15;9"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from=".5"
                    to=".5"
                    begin="0s"
                    dur="0.8s"
                    values=".5;1;.5"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>

            <circle
                cx="105"
                cy="15"
                r="15"
                fill-opacity=".3"
            >
                <animate
                    attributeName="r"
                    from="15"
                    to="15"
                    begin="0s"
                    dur="0.8s"
                    values="15;9;15"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from="1"
                    to="1"
                    begin="0s"
                    dur="0.8s"
                    values="1;.5;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
            </circle>
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
