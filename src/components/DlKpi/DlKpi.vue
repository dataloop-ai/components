<template>
    <div
        v-if="items.length"
        class="kpi"
    >
        <div
            v-for="(item, index) in items.slice(0, 6)"
            :key="index"
            class="kpi__box"
        >
            <div class="kpi__box__title">
                {{ formatTitle(item.title) }}
            </div>
            <div class="kpi__box__subtitle">
                <div
                    ref="kpiSubtitleTextRef"
                    class="kpi__box__subtitle__text"
                >
                    <dl-tooltip anchor="top middle">
                        {{ item.subtitle }}
                    </dl-tooltip>
                    {{ item.subtitle }}
                </div>
                <div>
                    <dl-icon
                        icon="icon-dl-info"
                        color=""
                        size="16px"
                    />
                </div>
            </div>
            <div class="kpi__box__progress_bar">
                <dl-progress-bar
                    v-if="item && item.progress && item.progress.value"
                    color="dl-color-darker"
                    :value="progressValue(item)"
                    :show-value="true"
                    :show-percentage="true"
                    :summary="item.progress.text"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue-demi'
import { KpiItem } from './types/KpiItem'
import { DlIcon, DlProgressBar, DlTooltip } from '../../components'

type TTitle = {
    value: number | string
    isAbbreviated: boolean
}

export default defineComponent({
    name: 'DlKpi',
    components: {
        DlIcon,
        DlProgressBar,
        DlTooltip
    },
    props: {
        items: {
            type: Array as PropType<KpiItem[]>,
            default: () => [] as KpiItem[]
        },
        abbreviatedTitle: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        // const items = props.items

        const progressValue = (item: KpiItem) => {
            return item?.progress?.value ? item.progress.value / 100 : null
        }

        const abbreviateIntlNumber = (nr: number) => {
            if (nr)
                return new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 1,
                    notation: 'compact',
                    compactDisplay: 'short'
                }).format(nr)
        }

        const numberWithComma = (amount: number) => {
            if (!amount) return 0
            return new Intl.NumberFormat('en-US', {
                style: 'decimal'
            }).format(amount)
        }

        const formatTitle = (title: TTitle) => {
            if (typeof title.value === 'number') {
                return title.isAbbreviated
                    ? abbreviateIntlNumber(title.value as number)
                    : numberWithComma(title.value as number)
            }
            if (typeof title.value === 'string') {
                const [hour, ...rest] = (title.value as string).split(':')
                return title.isAbbreviated ? hour : title.value
            }
        }

        return {
            progressValue,
            abbreviateIntlNumber,
            numberWithComma,
            formatTitle
        }
    }
})
</script>

<style scoped lang="scss">
.kpi {
    width: 90%;
    display: flex;
    flex-direction: row;
    gap: 10px;

    &__box {
        width: min(95%, 45rem);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /*text-align: center;*/
        padding: 20px 6px;
        /*margin: 10px;*/
        background: #ffffff;
        border: 1px solid #e4e4e4;
        border-radius: 2px;
        overflow: hidden;

        &__title {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 500;
            font-size: 30px;
            line-height: 35px;
            text-align: center;
            color: var(--dl-color-secondary);
        }

        &__subtitle {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            padding-top: 6px;
            gap: 10px;

            &__text {
                max-width: 90%;
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-transform: capitalize;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &__icon {
            }
        }

        &__progress_bar {
            width: 70%;
            padding-top: 10px;
        }
    }
}
</style>
