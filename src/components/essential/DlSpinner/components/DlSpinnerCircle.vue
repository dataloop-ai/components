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
    }
})
</script>

<style src="../styles/spinnerStyles.scss" />
