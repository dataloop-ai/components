<template>
    <ul
        class="dl-layout-left-side"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <li>
            <a
                class="active"
                href="#home"
            >
                <span> icon </span>
                <span v-if="isVisible"> Home </span>
            </a>
        </li>
        <li>
            <a href="#news">
                <span> icon </span>
                <span v-if="isVisible"> News </span>
            </a>
        </li>
        <li>
            <a href="#contact">
                <span> icon </span>
                <span v-if="isVisible"> Contact </span>
            </a>
        </li>
        <li>
            <a href="#about">
                <span> icon </span>
                <span v-if="isVisible"> About </span>
            </a>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutLeftSide',
    props: {
        isExpanded: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const isVisible = ref(true)
        const leftSideWidth = ref('')
        const onMouseEnter = () => {
            if (isExpandedProp.value) return
            leftSideWidth.value = '300px'
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpandedProp.value) return
            leftSideWidth.value = '100%'
            isVisible.value = false
        }
        const isExpandedProp = computed(() => props.isExpanded)

        onMounted(() => {
            leftSideWidth.value = '300px'
        })
        watch(isExpandedProp, (value) => {
            isVisible.value = value
            leftSideWidth.value = value ? '300px' : '100%'
        })
        const cssVars = computed(() => {
            return {
                '--dl-layout-left-side-width': leftSideWidth.value
            }
        })
        return {
            cssVars,
            onMouseEnter,
            leftSideWidth,
            onMouseLeave,
            isVisible
        }
    }
})
</script>

<style scoped lang="scss">
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: var(--dl-layout-left-side-width);
    background-color: #f1f1f1;
    height: 100%;
    overflow: auto;
}

li a {
    display: block;
    color: #000;
    padding: 8px 16px;
    text-decoration: none;
}

li a.active {
    background-color: #04aa6d;
    color: white;
}

li a:hover:not(.active) {
    background-color: #555;
    color: white;
}
</style>
