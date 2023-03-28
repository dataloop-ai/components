<template>
    <div
        class="kpi_box"
        :style="cssVars"
    >
        <div class="kpi_box__counter">
            <dl-typography
                color="dl-color-secondary"
                variant="h1"
                :size="counterFontSizeComputed"
            >
                {{ formatCounter(counter) }}
            </dl-typography>
        </div>
        <div class="kpi_box__title">
            <div class="kpi_box__title__text">
                <div>
                    <dl-typography
                        color="dl-color-darker"
                        variant="h3"
                        :size="titleFontSizeComputed"
                    >
                        {{ title }}
                    </dl-typography>
                </div>
                <div v-if="infoMessage">
                    <KpiInfo :info-message="infoMessage" />
                </div>
            </div>
            <div class="kpi_box__title__subtext">
                <dl-typography
                    color="dl-color-medium"
                    variant="h3"
                    :size="subtitleFontSize"
                >
                    {{ subtitle }}
                </dl-typography>
            </div>
        </div>
        <div
            v-if="withProgressBar"
            class="kpi_box__progress_bar"
        >
            <dl-progress-bar
                color="dl-color-darker"
                :value="progressValue(progress)"
                :show-value="true"
                :show-percentage="true"
                :summary="progress.text"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue-demi'
import { EKpiCounterFormat, TKpiCounter, TKpiProgress } from './types/KpiItem'
import DlProgressBar from '../../components/DlProgressBar.vue'
import DlTypography from '../../components/DlTypography.vue'
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
        counter: {
            type: Object as PropType<TKpiCounter | number>,
            default: () => ({})
        },
        counterFontSize: {
            type: String,
            default: '1.88em',
            required: true
        },
        title: {
            type: String,
            default: '---',
            required: true
        },
        titleFontSize: {
            type: String,
            default: '16px',
            required: false
        },
        subtitle: {
            type: String,
            default: '',
            required: false
        },
        subtitleFontSize: {
            type: String,
            default: '12px',
            required: false
        },
        infoMessage: {
            type: String,
            default: 'No data',
            required: false
        },
        progress: {
            type: Object as PropType<TKpiProgress>,
            default: () => ({})
        },
        withBorder: {
            type: Boolean,
            default: false,
            required: false
        },
        withProgressBar: {
            type: Boolean,
            default: false,
            required: false
        },
        isSmall: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    setup(props) {
        const progressValue = (progress: TKpiProgress) => {
            return progress?.value ? progress.value / 100 : null
        }

        const emptyString = '---'

        const cssVars = computed(() => {
            return {
                '--dl-kpi-border': props.withBorder ? '1px solid #e4e4e4' : ''
            }
        })

        const counterFontSizeComputed = computed(() =>
            props.isSmall ? '20px' : props.counterFontSize
        )
        const titleFontSizeComputed = computed(() =>
            props.isSmall ? '14px' : props.titleFontSize
        )

        const formatCounter = (counter: TKpiCounter) => {
            if (!counter) {
                return emptyString
            }
            if (typeof counter === 'number') {
                return formatNumberCounter(counter)
            }
            if (!counter.value) {
                return emptyString
            }
            if (typeof counter.value === 'number') {
                return formatNumberCounter(counter.value, counter.format)
            }
            if (typeof counter.value === 'string') {
                if (!counter.value.length) {
                    return emptyString
                }
                const [hour, minutes, seconds] = (
                    counter.value as string
                ).split(':')
                switch (counter.format) {
                    case EKpiCounterFormat.hms: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                    case EKpiCounterFormat.hm: {
                        return `${hour}:${minutes}`.toLowerCase()
                    }
                    case EKpiCounterFormat.h: {
                        return `${hour}`.toLowerCase()
                    }
                    case EKpiCounterFormat.ms: {
                        return `${minutes}:${seconds}`.toLowerCase()
                    }
                    case EKpiCounterFormat.m: {
                        return `${minutes}`.toLowerCase()
                    }
                    case EKpiCounterFormat.s: {
                        return `${seconds}`.toLowerCase()
                    }
                    default: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                }
            }
        }

        const formatNumberCounter = (amount: number, format = '') => {
            if (!amount) {
                return emptyString
            }
            if (amount === 0) {
                return 0
            }
            return format === 'short'
                ? (abbreviateNumber(amount as number) as string).toLowerCase()
                : numberWithComma(amount as number)
        }

        return {
            progressValue,
            formatCounter,
            cssVars,
            titleFontSizeComputed,
            counterFontSizeComputed
        }
    }
})
</script>

<style scoped lang="scss">
.kpi_box {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    padding: 20px 6px;
    border-radius: 2px;
    overflow: hidden;
    border: var(--dl-kpi-border);

    &__counter {
        text-align: center;
        text-transform: lowercase;
    }

    &__title {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        justify-content: center;
        padding-top: 6px;
        color: var(--dl-color-darker);

        &__text {
            display: flex;
            flex-direction: row;
            max-width: 90%;
            max-height: 40px;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 19px;
            text-transform: capitalize;
            text-align: center;
            overflow: hidden;
            gap: 10px;
        }
        &__subtext {
            max-width: 90%;
            max-height: 40px;
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
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
</style>
