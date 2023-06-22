<template>
    <div class="main-content-images">
        <layout-empty-state v-if="!emptyImages.length" />
        <component
            :is="cardView"
            :items="emptyImages"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue-demi'
import { ImageMetadata, MediaTypeEnum } from '../types/imageMetadata'
import CardViewGallery from './CardViewGallery.vue'
import CardViewTable from './CardViewTable.vue'
import CardView from './CardView.vue'
import LayoutEmptyState from './EmptyState/LayoutEmptyState.vue'

export default defineComponent({
    name: 'MainContentImages',
    components: {
        CardViewGallery,
        CardViewTable,
        CardView,
        LayoutEmptyState
    },
    props: {
        viewMode: {
            type: String,
            default: 'gallery',
            validator: (val: string) =>
                ['gallery', 'table', 'card'].includes(val)
        }
    },
    setup(props) {
        const currentDate = computed(() => new Date())
        const cardView = computed(() => {
            switch (props.viewMode) {
                case 'gallery':
                    return 'CardViewGallery'
                case 'table':
                    return 'CardViewTable'
                case 'card':
                    return 'CardView'
                default:
                    return 'CardViewGallery'
            }
        })
        const emptyImages = ref<ImageMetadata[]>([])
        const images = ref<ImageMetadata[]>([
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'file Name screen shot very long text file Name screen shot very long text file Name screen shot very long text file Name screen shot very long text',
                mediaType: MediaTypeEnum.image,
                state: 'Anno'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.video,
                state: 'Anno'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.lidar
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg',
                createdAt: currentDate.value,
                updatedAt: currentDate.value,
                extension: '.png',
                name: 'name',
                mediaType: MediaTypeEnum.image,
                state: 'Sta'
            }
        ])

        onMounted(() => {
            setTimeout(() => {
                emptyImages.value = images.value
            }, 2000)
        })

        return {
            emptyImages,
            images,
            cardView
        }
    }
})
</script>

<style scoped lang="scss">
.main-content-images {
    width: 100%;
}
</style>
