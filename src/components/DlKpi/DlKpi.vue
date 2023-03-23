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
                    {{ formatCounter(item.counter).toLowerCase() }}
                </dl-typography>
            </div>
            <div class="kpi__box__title">
                <div
                    v-if="isVue2"
                    ref="titleRef"
                    class="kpi__box__title__text"
                    :data-index="index"
                >
                    <dl-tooltip
                        v-if="isOverflowing[index]"
                        anchor="top middle"
                    >
                        {{ item.title }}
                    </dl-tooltip>
                    {{ item.title }}
                </div>
                <div
                    v-else
                    :ref="
                        (el) => {
                            titleRef[index] = el
                        }
                    "
                    class="kpi__box__title__text"
                    :data-index="index"
                >
                    <dl-tooltip
                        v-if="isOverflowing[index]"
                        anchor="top middle"
                    >
                        {{ item.title }}
                    </dl-tooltip>
                    {{ item.title }}
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
import {
    defineComponent,
    PropType,
    ref,
    onMounted,
    onBeforeUnmount,
    isVue2
} from 'vue-demi'
import { EFormat, KpiItem, TCounter } from './types/KpiItem'
import { DlProgressBar, DlTooltip, DlTypography } from '../../components'
import { abbreviateNumber, numberWithComma } from '../../utils/formatNumber'
import { isEllipsisActive } from '../../utils/is-ellipsis-active'
import KpiInfo from './KpiInfo.vue'

export default defineComponent({
    name: 'DlKpi',
    components: {
        DlProgressBar,
        DlTooltip,
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
        const titleRef = ref([])
        const resizeObserver = ref<ResizeObserver | null>(null)
        const isOverflowing = ref<boolean[]>([])
        const isVisibleInfoMessage = ref(false)

        const progressValue = (item: KpiItem) => {
            return item?.progress?.value ? item.progress.value / 100 : null
        }
        const formatCounter = (counter: TCounter) => {
            if (typeof counter.value === 'number') {
                return counter.format === 'short'
                    ? abbreviateNumber(counter.value as number)
                    : numberWithComma(counter.value as number)
            }
            if (typeof counter.value === 'string') {
                const [hour, minutes, seconds] = (
                    counter.value as string
                ).split(':')
                switch (counter.format) {
                    case EFormat.hms: {
                        return `${hour}:${minutes}:${seconds}`
                    }
                    case EFormat.hm: {
                        return `${hour}:${minutes}`
                    }
                    case EFormat.h: {
                        return `${hour}`
                    }
                    case EFormat.ms: {
                        return `${minutes}:${seconds}`
                    }
                    case EFormat.m: {
                        return `${minutes}`
                    }
                    case EFormat.s: {
                        return `${seconds}`
                    }
                    default: {
                        return `${hour}:${minutes}:${seconds}`
                    }
                }
            }
        }

        onMounted(() => {
            resizeObserver.value = new ResizeObserver((entries) => {
                const tempArr = [...isOverflowing.value]
                for (const entry of entries) {
                    const index = parseInt(
                        (entry.target as HTMLDivElement).dataset.index ?? '0'
                    )
                    tempArr[index] = isEllipsisActive(entry.target)
                }

                isOverflowing.value = tempArr
            })

            const elements = isVue2
                ? (titleRef.value as HTMLDivElement[])
                : titleRef.value

            for (const el of elements) {
                resizeObserver.value.observe(el)
            }
        })

        onBeforeUnmount(() => {
            resizeObserver.value.disconnect()
            resizeObserver.value = null
        })

        return {
            progressValue,
            formatCounter,
            isOverflowing,
            titleRef,
            isVue2,
            isVisibleInfoMessage
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
                text-overflow: ellipsis;
            }
        }

        &__progress_bar {
            width: 70%;
            padding-top: 10px;
        }
    }
}
</style>
