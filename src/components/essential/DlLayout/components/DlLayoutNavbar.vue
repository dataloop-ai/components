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
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}

li {
    float: left;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

li a:hover:not(.active) {
    background-color: #111;
}

.active {
    background-color: #04aa6d;
}
</style>
