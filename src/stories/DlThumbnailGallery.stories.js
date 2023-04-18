import { DlThumbnailGallery } from '../'
import { ref, computed, watch } from 'vue-demi'

const images = []
for (let i = 1; i < 20; i++) {
    images.push({
        name: `Image ${i}`,
        src: `https://picsum.photos/1000/800?random=${i}`,
        status: ''
    })
}

export default {
    title: 'Library/Components/DlThumbnailGallery',
    component: DlThumbnailGallery,
    argTypes: {
        images: {
            name: 'images',
            type: { name: 'array', required: true },
            defaultValue: images,
            description: 'An array of image sources for the gallery',
            table: {
                type: { summary: 'array' },
                defaultValue: { summary: images }
            }
        },
        visibleThumbnails: {
            name: 'visibleThumbnails',
            type: { name: 'number', required: false },
            defaultValue: 10,
            description: 'The number of thumbnails visible at once',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 10 }
            }
        },
        invalidImage: {
            name: 'invalidImage',
            type: { name: 'text', required: false },
            defaultValue: 'https://picsum.photos/20/20',
            description: 'The image to display when theres an error',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'https://picsum.photos/20/20' }
            }
        },
        aspectRatio: {
            options: ['default', 'full', 'full-with-padding'],
            control: 'select',
            description: 'The aspect ratio of the thumbnails',
            defaultValue: 'default'
        }
    }
}

const Template = (args) => ({
    components: { DlThumbnailGallery },
    setup() {
        const selectedImage = ref()
        const imageContainerStyles = computed(() => {
            return {
                backgroundImage: `url(${
                    selectedImage.value?.src || images[0].src
                })`,
                userSelect: 'none',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '800px'
            }
        })

        return {
            selectedImage,
            imageContainerStyles,
            args
        }
    },
    template: `
    <div style="display: flex;
                flex-direction: column;">
    <div
        :style="imageContainerStyles"
    >
        <dl-thumbnail-gallery
            v-model="selectedImage"
            v-bind="args"
        />
    </div>
</div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    modelValue: '',
    images,
    visibleThumbnails: 10,
    invalidImage: 'https://picsum.photos/20/20',
    aspectRatio: 'default'
}
