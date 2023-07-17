<template>
    <div class="page-layout-header">
        <div style="display: flex; height: 100%; align-items: center">
            <div style="padding-left: 25px">
                <dl-typography
                    color="dl-color-lighter"
                    size="10px"
                >
                    {{ subTitle }}
                </dl-typography>
                <dl-typography
                    color="dl-color-darker"
                    size="30px"
                >
                    {{ title }}
                </dl-typography>
            </div>
        </div>
        <div
            v-if="counters.length > 0"
            style="
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: end;
                padding-right: 10px;
            "
        >
            <dl-counters
                counter-font-size="20px"
                title-font-size="12px"
                :items="counters"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue-demi'
import { DlTypography, DlCounters } from '../../../../components'
import { DlCounterItem } from '../../../../types'

export default defineComponent({
    name: 'DlPageLayoutHeader',
    components: {
        DlTypography,
        DlCounters
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        counters: {
            type: Array as PropType<DlCounterItem[]>,
            default: () => [] as DlCounterItem[]
        }
    }
})
</script>

<style scoped>
.page-layout-header {
    height: 100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-self: center;
    justify-content: center;
    background-color: var(--dl-color-body-background);
}
</style>
