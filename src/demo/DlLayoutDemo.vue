<template>
    <div style="width: 90%; height: 100%">
        <DlLayout :has-navbar-toggle="true">
            <template #navbar-content>
                <div style="background-color: #999999; height: 100%">
                    Navbar content slot
                </div>
            </template>
            <template #left-side>
                <div
                    style="
                        color: var(--dl-color-lighter);
                        background-color: var(--dl-color-side-panel);
                        height: 100%;
                    "
                >
                    Left side content slot
                </div>
            </template>
            <template #right-side>
                <div
                    style="
                        color: var(--dl-color-lighter);
                        background-color: white;
                    "
                >
                    Right side content slot
                </div>
            </template>
            <template #default>
                <div
                    class="flex items-center"
                    style="
                        height: 100%;
                        background-color: var(--dl-color-body-background);
                    "
                >
                    <ul>
                        <li>
                            You need to develop the layouts as you can see here
                            with option to enter different kinds of component in
                            the future
                        </li>
                        <li>this layout need to be responsive,</li>
                        <li>
                            Our components should be able to be applied to this
                            layout
                        </li>
                        <li>its would be our design QA</li>
                        <li>
                            We will explain where and how to apply the
                            components
                        </li>
                        <li>
                            After we apply the components, we could simulate the
                            behavior and see how it works
                        </li>
                    </ul>
                </div>
            </template>
            <template #footer>
                <div
                    style="
                        color: var(--dl-color-lighter);
                        background-color: red;
                        height: 100%;
                    "
                >
                    Footer slot
                </div>
            </template>
        </DlLayout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlLayout from '../components/essential/DlLayout/DlLayout.vue'

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlLayout
    }
})
</script>

<style scoped lang="scss">
.navbar-demo-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>
