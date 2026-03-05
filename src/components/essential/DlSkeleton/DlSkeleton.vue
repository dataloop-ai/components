<template>
    <div
        :id="uuid"
        class="skeleton-box"
        :style="`width: ${width}; height: ${height}; margin: ${margin};`"
    />
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlSkeleton',
    props: {
        width: { required: false, default: '100%', type: String },
        height: { required: false, default: '100%', type: String },
        margin: { required: false, default: '0 auto', type: String }
    },
    setup: () => {
        return {
            uuid: `dl-skeleton-${v4()}`
        }
    },
    template: 'dl-skeleton'
})
</script>

<style scoped lang="css">
.skeleton-box {
    position: relative;
    overflow: hidden;
    background-color: var(--dell-gray-200);
}
.skeleton-box::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
}
@-moz-keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
@-webkit-keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
@-o-keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
