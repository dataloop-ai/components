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

<style lang="scss">
.spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
.dl-spinner {
    vertical-align: middle;
}

.dl-spinner-mat {
    animation: spinCircle 2s linear infinite;
    transform-origin: center center;
}
.spinner-path {
    stroke-dasharray: 1, 200 #{'/* rtl:ignore */'};
    stroke-dashoffset: 0 #{'/* rtl:ignore */'};
    animation: dash 1.5s ease-in-out infinite;
}

.spinner {
    position: relative;
}

.spin-loader,
.spin-bg {
    width: var(--dl-spinner-size);
    height: var(--dl-spinner-size);
    top: 0;
    left: 0;
}

.spin-loader {
    position: absolute;
    animation: spin 2s linear infinite;
}

.dl-spinner-icon {
    top: var(--icon-top);
    left: var(--icon-top);
    position: absolute;
    width: var(--dl-spinner-icon-size);
    height: var(--dl-spinner-icon-size);
    opacity: 1;
    animation: pulse 2s infinite;
}

.dl-svg {
    fill: var(--dl-spinner-border-color);
}

.spinner-color-bg {
    fill: none;
}

.spinner-color {
    fill: url(#linear-gradient);
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}

@keyframes spinCircle {
    0% {
        transform: rotate3d(0, 0, 1, 0deg) #{'/* rtl:ignore */'};
    }
    25% {
        transform: rotate3d(0, 0, 1, 90deg) #{'/* rtl:ignore */'};
    }
    50% {
        transform: rotate3d(0, 0, 1, 180deg) #{'/* rtl:ignore */'};
    }
    75% {
        transform: rotate3d(0, 0, 1, 270deg) #{'/* rtl:ignore */'};
    }
    100% {
        transform: rotate3d(0, 0, 1, 359deg) #{'/* rtl:ignore */'};
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
