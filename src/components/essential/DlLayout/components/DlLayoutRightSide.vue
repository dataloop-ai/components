<template>
    <ul>
        <li>
            <a
                class="active"
                href="#home"
            >Home</a>
        </li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
    </ul>
</template>

<script>
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutRightSide'
})
</script>

<style scoped lang="scss">
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 300px;
    height: 100%;
    overflow: auto;
    background-color: var(--dl-color-side-panel);
}

li a {
    display: block;
    color: var(--dl-color-text-buttons);
    padding: 8px 16px;
    text-decoration: none;
}

li a.active {
    background: rgba(255, 255, 255, 0.25);
    color: white;
}

li a:hover:not(.active) {
    background: rgba(255, 255, 255, 0.25);
    color: white;
}
</style>
