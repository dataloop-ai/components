<template>
    <div class="wrapper">
        <svg
            class="dl-spinner dl-spinner-mat"
            :width="size"
            :height="size"
            viewBox="25 25 50 50"
        >
            <circle
                class="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                :stroke="color"
                :stroke-width="thickness"
                stroke-miterlimit="10"
            />
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        color: {
            type: String,
            default: 'var(--dl-color-secondary)'
        },
        size: {
            type: String,
            default: '40px'
        },
        thickness: {
            type: String,
            default: '5px'
        }
    },
    computed: {
        svgStyles() {
            return {
                width: this.size,
                height: this.size,
                viewBox: '25 25 50 50'
            }
        },
        circleStyles() {
            return {
                cy: '50',
                cx: '50',
                r: '20',
                fill: 'none',
                stroke: this.color,
                strokeWidth: this.thickness,
                strokeMiterlimit: '10'
            }
        }
    }
})
</script>

<style lang="scss">
.wrapper {
    padding: 5px;
    display: flex;
    justify-content: center;
}
.dl-spinner {
    vertical-align: middle;
}

.dl-spinner-mat {
    animation: spin 2s linear infinite;
    transform-origin: center center;
}
.path {
    stroke-dasharray: 1, 200 #{'/* rtl:ignore */'};
    stroke-dashoffset: 0 #{'/* rtl:ignore */'};
    animation: dash 1.5s ease-in-out infinite;
}
@keyframes spin {
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
</style>
