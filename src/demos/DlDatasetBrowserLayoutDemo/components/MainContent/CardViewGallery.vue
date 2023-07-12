<template>
    <div
        ref="cardViewGalleryWrapper"
        style="padding-top: 10px"
    >
        <dl-virtual-scroll
            :items="itemsToDisplay"
            :virtual-scroll-item-size="295"
            :virtual-scroll-sticky-size-start="20"
            :virtual-scroll-sticky-size-end="20"
            separator
            @virtual-scroll="log"
        >
            <template #default="{ item, index }">
                <dl-list-item
                    :key="index"
                    dense
                >
                    <dl-item-section>
                        <div
                            class="row custom-element"
                            :style="`gap: ${imagesGap}px; margin-bottom: 20px`"
                        >
                            <div
                                v-for="(col, i) in item.items"
                                :key="`${index}-${i}`"
                                :style="imageStyles(col.url)"
                            />
                        </div>
                    </dl-item-section>
                </dl-list-item>
            </template>
        </dl-virtual-scroll>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    PropType,
    ref
} from 'vue-demi'
import { ImageMetadata } from '../types/imageMetadata'
import { DlVirtualScroll } from '../../../../components'

export default defineComponent({
    name: 'CardViewGallery',
    components: {
        DlVirtualScroll
    },
    props: {
        items: {
            type: Array,
            default: () => Array as PropType<ImageMetadata[]>
        }
    },
    setup(props, { emit }) {
        const imageStyles = (url: string): Record<string, string> => ({
            backgroundImage: `url(${url})`,
            width: '140px',
            height: '135px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            marginRight: '10px'
        })
        const log = console.log

        const cardViewGalleryWrapper = ref(null)
        const resizeObserver = ref(null)
        const itemsToDisplay = ref(props.items)
        const imageWidth = 150
        const imagesGap = ref(0)

        const restructureData = (width: number) => {
            if (!props.items.length) return

            const cols = Math.floor(width / imageWidth) || 1
            const remaningPixels = width - cols * imageWidth
            imagesGap.value =
                cols !== 1 ? Math.floor(remaningPixels / (cols - 1)) : 0
            const rows = Math.ceil(props.items.length / cols)
            const toDisplay = []

            for (let i = 0; i < rows; ++i) {
                const items = []
                for (
                    let j = 0;
                    j < cols &&
                    toDisplay.length * cols + j !== props.items.length;
                    ++j
                ) {
                    items.push(props.items[i * cols + j])
                }
                toDisplay.push({ items })
            }

            itemsToDisplay.value = toDisplay.slice(0, props.items.length - 1)
        }

        onMounted(() => {
            restructureData(cardViewGalleryWrapper.value.offsetWidth)

            resizeObserver.value = new ResizeObserver((elems) => {
                const elem = elems[0]
                if (!elem) return
                const width = elem.contentRect.width
                restructureData(width)
            })

            resizeObserver.value.observe(cardViewGalleryWrapper.value)
        })

        onUnmounted(() => {
            resizeObserver.value?.disconnect()
        })

        return {
            cardViewGalleryWrapper,
            itemsToDisplay,
            imageStyles,
            log,
            imagesGap
        }
    }
})
</script>

<style scoped lang="scss">
.card-view-gallery {
    display: flex;
    gap: 1vw;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: 10px;
    align-content: center;
    text-align: center;
}
</style>
