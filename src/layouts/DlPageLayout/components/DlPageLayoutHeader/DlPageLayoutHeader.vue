<template>
    <div class="page-layout-header">
        <div class="page-layout-header__title">
            <dl-typography
                color="dl-color-lighter"
                size="10px"
            >
                <slot name="subtitle">
                    {{ subTitle }}
                </slot>
            </dl-typography>
            <dl-typography
                color="dl-color-darker"
                size="30px"
                style="padding-bottom: 10px"
            >
                <slot name="title">
                    {{ title }}
                </slot>
            </dl-typography>
        </div>
        <div
            v-if="counters.length > 0"
            class="page-layout-header__counters"
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

<style scoped lang="scss">
.page-layout-header {
    height: 100px;
    display: flex;
    width: 100%;
    justify-self: center;
    justify-content: center;
    background-color: var(--dl-color-body-background);

    &__title {
        display: flex;
        height: 100%;
        padding-left: 25px;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
    }

    &__counters {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: end;
        padding-right: 10px;
    }
}
</style>
