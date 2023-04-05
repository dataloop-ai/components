<template>
    <div class="dl-layout-navbar">
        <ul>
            <li>
                <a
                    href="#home"
                    @click="toggleLeftSideBar"
                >|||</a>
            </li>
            <li><a href="#home">Home</a></li>
            <li><a href="#news">News</a></li>
            <li><a href="#contact">Contact</a></li>
            <li style="float: right">
                <a
                    class="active"
                    href="#about"
                >About</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
    name: 'DlLayoutNavbar',
    emits: ['toggle'],
    setup(props, context) {
        const isExpandedLeftSide = ref(true)
        const toggleLeftSideBar = () => {
            isExpandedLeftSide.value = !isExpandedLeftSide.value
            context.emit('toggle', isExpandedLeftSide.value)
        }
        return {
            toggleLeftSideBar
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-navbar {
    width: 100%;
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--dl-color-bg);
}

li {
    float: left;
}

li a {
    display: block;
    color: var(--dl-color-darker);
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

li a:hover:not(.active) {
    background-color: var(--dl-color-fill);
}

.active {
    background-color: var(--dl-color-fill);
}
</style>
