<template>
    <div class="card-view">
        <DlCard
            v-for="(image, imageIndex) in items"
            :key="imageIndex"
            interactive
            zoom
            :image="{
                src: image.url,
                link: {
                    icon: 'icon-dl-link',
                    color: 'black',
                    size: '12px',
                    href: 'https://dataloop.ai/'
                }
            }"
            description="text"
            title="title"
            :links="getLinks(image)"
            :tags="[
                {
                    label: 'A',
                    color: '#FFBBFF',
                    textColor: 'black'
                },
                {
                    label: 'Lemon',
                    color: '#7000FF',
                    textColor: 'black'
                },
                {
                    label: 'B',
                    color: '#FFDA3A',
                    textColor: 'black'
                },
                {
                    label: 'D',
                    color: '#00A0FF',
                    textColor: 'black'
                },
                {
                    label: 'X',
                    color: '#AADC3A',
                    textColor: 'black'
                }
            ]"
            indicator-color="red"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { ImageMetadata } from '../types/imageMetadata'
import { DlCard } from '../../../../components'
import { DlCardLinkType } from '../../../../types'

export default defineComponent({
    name: 'CardView',
    components: {
        DlCard
    },
    props: {
        items: {
            type: Array as PropType<ImageMetadata[]>,
            default: (): ImageMetadata[] => [] as ImageMetadata[]
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
            imageStyles,
            getLinks: (image: ImageMetadata): DlCardLinkType[] => {
                return [
                    {
                        title: 'title',
                        href: image.url
                    }
                ] as DlCardLinkType[]
            }
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
