import { DlThumbnailGallery } from '..'
import { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed, watch } from 'vue-demi'

type Story = StoryObj<typeof DlThumbnailGallery>

const meta: Meta<typeof DlThumbnailGallery> = {
    title: 'Library/Components/DlThumbnailGallery',
    component: DlThumbnailGallery
}

interface DlThumbnail {
    name: string
    src: string
    status: string
}

const images: DlThumbnail[] = []
for (let i = 1; i < 20; i++) {
    images.push({
        name: `Image ${i}`,
        src: `https://picsum.photos/1000/800?random=${i}`,
        status: ''
    })
}

export default meta

export const ThumbnailGallery: Story = {
    args: {
        modelValue: '',
        images,
        visibleThumbnails: 10,
        invalidImage: 'https://picsum.photos/20/20',
        aspectRatio: 'default'
    },
    render: (args, { argTypes }) => {
        return {
            components: { DlThumbnailGallery },
            setup() {
                const selectedImage = ref()
                const selectedIndex = ref(0)
                const imageContainerStyles = computed(() => {
                    return {
                        backgroundImage: `url(${
                            selectedImage.value?.src || images[0].src
                        })`
                    }
                })
                watch(selectedImage, (val) => {
                    selectedIndex.value =
                        images.findIndex(
                            (element: DlThumbnail) => element.src === val.src
                        ) + 1
                })

                return {
                    images,
                    selectedImage,
                    imageContainerStyles,
                    selectedIndex
                }
            },
            template: ` 
            <div style=" width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;">
            <div
                style="
                  user-select: none;
                  height: 100%;
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                "
                class="image-container"
            >
                <dl-thumbnail-gallery
                    v-model="selectedImage"
                    :images="images"
                    invalid-image="/src/demo/DlThumbnailGallery/images/error.png"
                />
            </div>
            <div class="menu">
                <div class="menu__pagination">
                    {{ selectedIndex }} / {{ images.length }} Items
                </div>
            </div>
        </div>
            `
        }
    }
}
