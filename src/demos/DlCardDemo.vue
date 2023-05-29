<template>
    <div>
        <DlCard
            :image="image"
            :text="text"
            :title="title"
            :keyboard-shortcut="keyboardShortcut"
            :links="links"
        />

        <DlCard
            is-empty
            :empty-state-props="{
                responsive: false,
                style: 'min-height: 350px;',
                bgSize: '130px',
                bgImage: `url(./src/demos/assets/agenda.svg)`,
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
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
            image: {
                src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
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
            ]
        }
    }
})
</script>
