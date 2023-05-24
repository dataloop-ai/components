<template>
    <div class="container">
        <dl-grid>
            <img
                v-for="(a, index) in 10"
                :key="index"
                class="grid-image"
                :src="getRandomImg()"
            >
        </dl-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlGrid } from '../components/'

const getRandomImg = () => {
    const random = Math.floor(Math.random() * 3) + 1
    const link = `https://picsum.photos/${random * 100}/${
        random * 100
    }?random=${random}`
    return link
}
export default defineComponent({
    components: {
        DlGrid
    },
    setup() {
        return { getRandomImg }
    }
})
</script>

<style lang="scss" scoped>
.grid-image {
    border: 2px solid var(--dl-color-darker);
    margin: 5px;
}
</style>
