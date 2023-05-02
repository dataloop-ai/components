<template>
    <div>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam,
            nemo! Enim alias odit, doloribus est nisi nihil? Nisi quibusdam
            animi quia omnis itaque, maxime labore aliquam. Obcaecati et placeat
            nemo.
        </p>
        <p>
            <dl-link
                href="https://console.dataloop.ai"
                :size="30"
                open-in-new-tab
            >
                Link With Tooltip
                <dl-tooltip>
                    lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Assumenda corporis alias cupiditate natus? Ipsum quos quia
                    temporibus ipsam magnam, alias rerum aut, a quaerat dicta,
                    quasi aperiam facere asperiores saepe.
                </dl-tooltip>
            </dl-link>
            <span>
                Span With Tooltip
                <dl-tooltip
                    color="rgb(0, 255, 0)"
                    background-color="dl-color-side-panel"
                >
                    lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Assumenda corporis alias cupiditate natus? Ipsum quos quia
                    temporibus ipsam magnam, alias rerum aut, a quaerat dicta,
                    quasi aperiam facere asperiores saepe.
                </dl-tooltip>
            </span>
        </p>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            debitis, dolor tempora tenetur perspiciatis laborum illum, dolorem,
            voluptate commodi molestiae animi fuga natus assumenda aliquam ad?
            Dicta harum recusandae rem!
        </p>
        <div>
            Show smart tooltip
            <dl-tooltip
                :hide-delay="delay"
                style="padding: 0; border-radius: 2px"
            >
                <DlCard
                    :image="image"
                    :text="text"
                    :title="title"
                    :keyboard-shortcut="keyboardShortcut"
                    :links="links"
                />
            </dl-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { DlTooltip, DlLink, DlCard } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTooltipDemo',
    components: {
        DlCard,
        DlTooltip,
        DlLink
    },
    data() {
        return {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
            icon: {
                src: 'icon-dl-search'
            },
            image: {
                src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
            },
            delay: 100000,
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
    },
    template: 'dl-tooltip-demo'
})
</script>
