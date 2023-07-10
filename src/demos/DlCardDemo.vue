<template>
    <div>
        <DlCard
            :image="image"
            :text="text"
            :title="title"
            :links="interactiveProps.links"
        />
        <div>Card (icon)</div>
        <div style="display: flex; flex-direction: row; gap: 10px">
            <DlCard
                :icon="icon"
                :text="text"
                :title="title"
                @onUpdateDescription="updateDescription"
                @onCardActive="onCardActive"
            />
        </div>
        <div>Card (interactive)</div>
        <div style="display: flex; flex-direction: row; gap: 10px">
            <DlCard
                v-bind="interactiveProps"
                interactive
                zoom
                @onUpdateDescription="updateDescription"
                @onCardActive="onCardActive"
            />
        </div>
        <div>Card empty state</div>
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
            image: {
                src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
            },

            title: 'Lorem ipsum',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',

            icon: {
                icon: 'icon-dl-alert-filled',
                color: 'red'
            },
            interactiveProps: {
                text: 'Some text',
                image: {
                    src: 'https://www.shutterstock.com/image-photo/ripe-orange-isolated-on-white-260nw-606022676.jpg',
                    styles: 'width: 200px; height: 112px',
                    link: {
                        icon: 'icon-dl-link',
                        color: 'black',
                        size: '12px',
                        href: 'https://dataloop.ai/'
                    }
                },
                title: 'Lorem ipsum',
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
                interactive: false,
                zoom: false,
                cardId: 2,
                width: '180px',
                tags: [
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
                ],
                hints: [
                    {
                        icon: 'icon-dl-related-filled',
                        color: ''
                    },
                    {
                        icon: 'icon-dl-alert-filled',
                        color: 'red'
                    }
                ],
                description: 'descriptiononono',
                indicatorColor: 'dl-color-negative'
            }
        }
    },
    methods: {
        updateDescription(card) {
            console.log('update description: ', card)
        },
        onCardActive(card) {
            console.log('Card Active: ', card)
        }
    }
})
</script>
