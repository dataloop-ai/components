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
    </div>
</template>

<script lang="ts">
import { DlTooltip, DlLink } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTooltipDemo',
    components: {
        DlTooltip,
        DlLink
    },
    data() {
        return {}
    },
    template: 'dl-tooltip-demo'
})
</script>
