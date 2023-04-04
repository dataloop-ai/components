<template>
    <!--    <ul>-->
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
    <!--    </ul>-->
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
    background-color: #f1f1f1;
    /*position: fixed;*/
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
