<template>
    <div>
        <DlCard
            :image="image"
            :text="text"
            :title="title"
            :keyboard-shortcut="keyboardShortcut"
            :links="links"
        />
        <div>Card (Shopify)</div>
        <div style="display: flex; flex-direction: row; gap: 10px">
            <DlCard
                shopify
                zoom-mode
                :card-id="1"
                :image="orangeImage"
                :shopify-title="shopifyTitle"
                :icon-link="iconLink"
                :chips-items="chipsItemsEmpty"
                :shopify-description="shopifyDescription"
                @onUpdateDescription="updateDescription"
                @onCardActive="onCardActive"
            />
            <DlCard
                shopify
                zoom-mode
                :card-id="2"
                :image="appleImage"
                :icon-link="iconLink"
                :shopify-title="shopifyTitle"
                :chips-items="chipsItems"
                :inner-icons="classificationItems"
                :shopify-description="shopifyDescriptionSecond"
                colored-strip="dl-color-negative"
                @onUpdateDescription="updateDescription"
                @onCardActive="onCardActive"
            />
        </div>

        <DlCard
            is-empty
            :empty-state-props="{
                responsive: false,
                style: 'min-height: 350px;',
                bgSize: '130px',
                bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                title: 'Lorem ipsum',
                subtitle:
                    'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                info: 'To learn more about this analytics, read our documentation.'
            }"
        >
            <template #links="">
                <div
                    style="
                        display: flex;
                        gap: 5px;
                        flex-wrap: wrap;
                        padding: 0 20px;
                    "
                >
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </DlCard>
    </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { DlCard, DlButton } from '../components'

export default defineComponent({
    name: 'DlCardDemo',
    components: {
        DlCard,
        DlButton
    },
    data() {
        return {
            shopifyDescription: '',
            shopifyDescriptionSecond: 'Shopify Description',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
            image: {
                src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
            },
            orangeImage: {
                src: 'https://www.shutterstock.com/image-photo/ripe-orange-isolated-on-white-260nw-606022676.jpg',
                styles: 'width: 200px; height: 112px'
            },
            parisImage: {
                src: 'https://blmparis.files.wordpress.com/2014/07/day.jpg',
                styles: 'width: 200px; height: 100px; object-fit: contain; padding: 4px'
            },
            appleImage: {
                src: 'https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg'
            },
            habitatImage: {
                src: 'https://m.media-amazon.com/images/I/819oV4YkM9L._AC_UF350,350_QL80_.jpg'
            },
            treeImage: {
                src: 'https://images.freeimages.com/images/previews/19f/the-manor-1642006.jpg'
            },
            title: 'Lorem ipsum',
            keyboardShortcut: 'Shift + E',
            links: [
                {
                    icon: 'icon-dl-list-view',
                    href: 'https://www.google.md/?hl=ru',
                    title: 'Lorem',
                    newtab: true,
                    external: true
                },
                {
                    href: '#test',
                    title: 'Developers',
                    icon: 'icon-dl-code'
                }
            ],
            iconLink: {
                icon: 'icon-dl-link',
                color: 'black',
                backgroundColor: 'grey',
                size: '12px',
                link: 'https://dataloop.ai/',
                circle: {
                    size: '20px',
                    // color: 'rgba(255, 0, 0, 0.8)'
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            chipsItems: [
                {
                    label: 'A',
                    color: '#BECB5D',
                    textColor: 'black'
                },
                {
                    label: 'Lemon',
                    color: '#FFDA3A',
                    textColor: 'black'
                },
                {
                    label: 'Strawba',
                    color: '#FF2F7A',
                    textColor: 'black'
                },
                {
                    label: 'Apple',
                    color: '#FFDA3A',
                    textColor: 'black'
                },
                {
                    label: 'Banana',
                    color: '#FFDA3A',
                    textColor: 'black'
                },
                {
                    label: 'Banana',
                    color: '#FFDA3A',
                    textColor: 'black'
                }
            ],
            shopifyTitle: {
                label: 'Classification',
                count: 6
            },
            chipsItemsEmpty: [],
            classificationItems: [
                {
                    icon: 'icon-dl-related-filled',
                    color: ''
                },
                {
                    icon: 'icon-dl-alert-filled',
                    color: 'red'
                }
            ]
        }
    },
    methods: {
        updateDescription(card) {
            switch (card.cardId) {
                case 1:
                    this.shopifyDescription = card.description
                    break
                case 2:
                    this.shopifyDescriptionSecond = card.description
                    break
            }

            console.log('update description: ', card)
        },
        onCardActive(card) {
            console.log('Card Active: ', card)
        }
    }
})
</script>
