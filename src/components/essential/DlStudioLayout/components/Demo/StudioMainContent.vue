<template>
    <div
        class="flex items-center"
        style="height: 100%; background-color: var(--dl-color-body-background)"
    >
        <ul>
            <li>
                You need to develop the layouts as you can see here with option
                to enter different kinds of component in the future
            </li>
            <li>this layout need to be responsive,</li>
            <li>Our components should be able to be applied to this layout</li>
            <li>its would be our design QA</li>
            <li>We will explain where and how to apply the components</li>
            <li>
                After we apply the components, we could simulate the behavior
                and see how it works
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'StudioMainContent'
})
</script>

<style scoped></style>
