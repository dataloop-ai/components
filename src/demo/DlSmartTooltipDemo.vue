<template>
    <span>
        Show smart tooltip
        <dl-smart-tooltip
            :image="image"
            :delay="delay"
            :text="text"
            :title="title"
            :keyboard-shortcut="keyboardShortcut"
        />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import DlSmartTooltip from '../components/essential/DlSmartTooltip/DlSmartTooltip.vue'
export default defineComponent({
    name: 'DlSmartTooltipDemo',
    components: { DlSmartTooltip },
    data: () => ({
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
        icon: {
            src: 'icon-dl-search'
        },
        image: {
            src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
        },
        delay: 200000,
        title: 'lorem ipsum',
        keyboardShortcut: 'Shift + E',
        links: []
    })
})
</script>

<style scoped></style>
