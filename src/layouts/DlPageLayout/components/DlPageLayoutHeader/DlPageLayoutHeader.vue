<template>
    <div class="page-layout-header">
        <div class="page-layout-header__title-container">
            <dl-typography color="dl-color-lighter" variant="h6">
                <slot name="subtitle">
                    {{ subTitle }}
                </slot>
            </dl-typography>
            <div class="page-layout-header__title">
                <dl-typography color="dl-color-darker" variant="h1">
                    <slot name="title">
                        {{ title }}
                    </slot>
                </dl-typography>
                <slot name="actions" />
            </div>
        </div>
        <div v-if="counters.length > 0" class="page-layout-header__counters">
            <dl-counters
                counter-font-size="header6"
                title-font-size="body3"
                :show-divider="showDivider"
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
        },
        showDivider: {
            type: Boolean,
            default: true
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

    &__title-container {
        display: flex;
        height: 100%;
        padding-left: var(--dl-page-layout-header-title-padding-left, 25px);
        padding-top: var(--dl-page-layout-header-title-padding-top, 0px);
        justify-content: var(--dl-page-layout-header-title-justify, center);
        box-sizing: border-box;
        flex-grow: 1;
    }

    &__title {
        padding-bottom: 10px;
        display: flex;
        align-items: center;
    }

    &__counters {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;
    }
}
</style>
