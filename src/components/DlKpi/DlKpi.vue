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
            <div class="kpi__box__counter">
                <dl-typography
                    color="dl-color-secondary"
                    variant="h1"
                    :size="`${counterFontSize}px`"
                >
                    {{ formatCounter(item.counter) }}
                </dl-typography>
            </div>
            <div class="kpi__box__title">
                <div class="kpi__box__title__text">
                    {{ validateTitle(item.title) }}
                </div>
                <div>
                    <KpiInfo :info-message="item.infoMessage" />
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
import { defineComponent, PropType } from 'vue-demi'
import { EFormat, KpiItem, TCounter } from './types/KpiItem'
import { DlProgressBar, DlTypography } from '../../components'
import { abbreviateNumber, numberWithComma } from '../../utils/formatNumber'
import KpiInfo from './KpiInfo.vue'

export default defineComponent({
    name: 'DlKpi',
    components: {
        DlProgressBar,
        DlTypography,
        KpiInfo
    },
    props: {
        items: {
            type: Array as PropType<KpiItem[]>,
            default: () => [] as KpiItem[]
        },
        counterFontSize: {
            type: Number,
            default: 30
        }
    },
    setup() {
        const progressValue = (item: KpiItem) => {
            return item?.progress?.value ? item.progress.value / 100 : null
        }

        const validateTitle = (title: string) => (title ? title : '---')

        const formatCounter = (counter: TCounter) => {
            if (!counter.value) {
                return 0
            }
            if (typeof counter.value === 'number') {
                if (!counter.value || counter.value === 0) {
                    return 0
                }
                return counter.format === 'short'
                    ? (
                          abbreviateNumber(counter.value as number) as string
                      ).toLowerCase()
                    : numberWithComma(counter.value as number)
            }
            if (typeof counter.value === 'string') {
                if (!counter.value.length) {
                    return '---'
                }
                const [hour, minutes, seconds] = (
                    counter.value as string
                ).split(':')
                switch (counter.format) {
                    case EFormat.hms: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                    case EFormat.hm: {
                        return `${hour}:${minutes}`.toLowerCase()
                    }
                    case EFormat.h: {
                        return `${hour}`.toLowerCase()
                    }
                    case EFormat.ms: {
                        return `${minutes}:${seconds}`.toLowerCase()
                    }
                    case EFormat.m: {
                        return `${minutes}`.toLowerCase()
                    }
                    case EFormat.s: {
                        return `${seconds}`.toLowerCase()
                    }
                    default: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                }
            }
        }

        return {
            progressValue,
            formatCounter,
            validateTitle
        }
    }
})
</script>

<style scoped lang="scss">
.kpi {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 30px;

    &__box {
        width: min(100%, 50rem);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 6px;
        background: #ffffff;
        border: 1px solid #e4e4e4;
        border-radius: 2px;
        overflow: hidden;

        &__counter {
            text-align: center;
            text-transform: lowercase;
        }

        &__title {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            padding-top: 6px;
            gap: 10px;

            &__text {
                max-width: 90%;
                max-height: 40px;
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-transform: capitalize;
                text-align: center;
                overflow: hidden;
            }
        }

        &__progress_bar {
            width: 70%;
            padding-top: 10px;
        }
    }
}
</style>
