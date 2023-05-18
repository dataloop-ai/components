<template>
    <div class="main-content-images">
        <img
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            :src="image.url"
            alt="Paris"
        >
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
    name: 'MainContentImages',
    setup() {
        const images = ref([
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg'
            },
            {
                url: 'https://blog.feedingwestchester.org/hubfs/blog-14-the-most-affordable-fruits-and-vegetables.jpg'
            },
            {
                url: 'https://i2.wp.com/ghfruit.com/wp-content/uploads/2022/05/apple-green.png?fit=574%2C516&ssl=1'
            },
            {
                url: 'https://hips.hearstapps.com/hmg-prod/images/cherries-royalty-free-image-1656341880.jpg?crop=0.668xw:1.00xh;0.111xw,0&resize=1200:*'
            },
            {
                url: 'https://hosstools.com/wp-content/uploads/2020/10/athena-cantaloupe.jpg'
            },
            {
                url: 'https://static.sscontent.com/thumb/500/500/products/124/v1164303_prozis_crunchy-red-apple-slices-20-g_2.jpg'
            },
            {
                url: 'https://static9.depositphotos.com/1325564/1170/i/950/depositphotos_11700802-stock-photo-still-life-multifruit.jpg'
            },
            {
                url: 'https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg'
            },
            {
                url: 'https://www.tasteofhome.com/wp-content/uploads/2023/01/GettyImages-542323318.jpg'
            },
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pitaya_cross_section_ed2.jpg'
            },
            {
                url: 'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg'
            },
            {
                url: 'https://i.simpalsmedia.com/point.md/news/809x456/76cd818643211d78586933f152f98e60.jpg'
            },
            {
                url: 'https://www.romaldo.ro/wp-content/uploads/2018/03/Page-2-Image-20.png'
            },
            {
                url: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L._SX522_.jpg'
            }
        ])

        return {
            images
        }
    }
})
</script>

<style scoped lang="scss">
.main-content-images {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 10px;
    align-content: center;
    text-align: center;

    img {
        width: 135px;
        height: 135px;
        object-fit: cover;
        border-radius: 2px;
    }
}
</style>
