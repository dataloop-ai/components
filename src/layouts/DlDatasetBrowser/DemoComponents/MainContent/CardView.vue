<template>
    <div class="card-view">
        <DlCard
            v-for="(image, imageIndex) in items"
            :key="imageIndex"
            :image="{ src: image.url }"
            text="text"
            title="title"
            :keyboard-shortcut="keyboardShortcut"
            :links="{
                title: 'title',
                href: image.url
            }"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { ImageMetadata } from '../types/imageMetadata'
import { DlCard } from '../../../../components'

export default defineComponent({
    name: 'CardView',
    components: {
        DlCard
    },
    props: {
        items: {
            type: Array,
            default: () => Array as PropType<ImageMetadata[]>
        }
    },
    setup() {
        const imageStyles = (url: string) => {
            return {
                backgroundImage: `url(${url})`,
                width: '127px',
                height: '135px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                marginRight: '10px'
            }
        }

        return {
            imageStyles
        }
    }
})
</script>

<style scoped lang="scss">
.card-view {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
    align-content: center;
    text-align: center;
}
</style>
