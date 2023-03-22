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
                <dl-typography
                    color="dl-color-secondary"
                    variant="h1"
                    :size="`${titleFontSize}px`"
                >
                    {{ formatTitle(item.title) }}
                </dl-typography>
            </div>
            <div class="kpi__box__subtitle">
                <div
                    v-if="isVue2"
                    ref="subtitleRef"
                    class="kpi__box__subtitle__text"
                    :data-index="index"
                >
                    <dl-tooltip
                        v-if="isOverflowing[index]"
                        anchor="top middle"
                    >
                        {{ item.subtitle }}
                    </dl-tooltip>
                    {{ item.subtitle }}
                </div>
                <div
                    v-else
                    :ref="
                        (el) => {
                            subtitleRef[index] = el
                        }
                    "
                    class="kpi__box__subtitle__text"
                    :data-index="index"
                >
                    <dl-tooltip
                        v-if="isOverflowing[index]"
                        anchor="top middle"
                    >
                        {{ item.subtitle }}
                    </dl-tooltip>
                    {{ item.subtitle }}
                </div>
                <div>
                    <dl-icon
                        icon="icon-dl-info"
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
import {
    defineComponent,
    PropType,
    ref,
    onMounted,
    onBeforeUnmount,
    isVue2
} from 'vue-demi'
import { KpiItem } from './types/KpiItem'
import {
    DlIcon,
    DlProgressBar,
    DlTooltip,
    DlTypography
} from '../../components'
import { abbreviateNumber, numberWithComma } from '../../utils/formatNumber'
import { isEllipsisActive } from '../../utils/is-ellipsis-active'

type TTitle = {
    value: number | string
    isAbbreviated: boolean
}

export default defineComponent({
    name: 'DlKpi',
    components: {
        DlIcon,
        DlProgressBar,
        DlTooltip,
        DlTypography
    },
    props: {
        items: {
            type: Array as PropType<KpiItem[]>,
            default: () => [] as KpiItem[]
        },
        titleFontSize: {
            type: Number,
            default: 30
        }
    },
    setup() {
        const subtitleRef = ref([])
        const resizeObserver = ref<ResizeObserver | null>(null)
        const isOverflowing = ref<boolean[]>([])

        const progressValue = (item: KpiItem) => {
            return item?.progress?.value ? item.progress.value / 100 : null
        }

        const formatTitle = (title: TTitle) => {
            if (typeof title.value === 'number') {
                return title.isAbbreviated
                    ? abbreviateNumber(title.value as number)
                    : numberWithComma(title.value as number)
            }
            if (typeof title.value === 'string') {
                const [hour, ...rest] = (title.value as string).split(':')
                return title.isAbbreviated ? hour : title.value
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
                ? (subtitleRef.value as HTMLDivElement[])
                : subtitleRef.value

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
            formatTitle,
            isOverflowing,
            subtitleRef,
            isVue2
        }
    }
})
</script>

<style scoped lang="scss">
.kpi {
    width: 100%;
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
        padding: 20px 6px;
        background: #ffffff;
        border: 1px solid #e4e4e4;
        border-radius: 2px;
        overflow: hidden;

        &__title {
            text-align: center;
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
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-transform: capitalize;
                white-space: nowrap;
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
