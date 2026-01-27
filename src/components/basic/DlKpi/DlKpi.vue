<template>
    <div class="kpi_box" :style="cssVars">
        <div class="kpi_box__counter">
            <dl-typography
                :color="hasValue ? 'dell-gray-800' : 'dell-gray-600'"
                variant="h1"
                :size="counterFontSizeComputed"
                :style="typographyStyles"
            >
                {{ formatCounter(counter) }} {{ hasValue ? prefix : '' }}
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
        <div v-if="progress" class="kpi_box__progress_bar">
            <dl-progress-bar
                color="dl-color-darker"
                height="5px"
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
import {
    DlKpiCounterFormat,
    DlKpiCounterType,
    DlKpiProgressType
} from './types/KpiItem'
import { DlProgressBar, DlTypography } from '../../essential'
import {
    abbreviateBytes,
    abbreviateNumber,
    numberWithComma
} from '../../../utils/formatNumber'
import KpiInfo from './components/KpiInfo.vue'

export default defineComponent({
    name: 'DlKpi',
    components: {
        DlProgressBar,
        DlTypography,
        KpiInfo
    },
    props: {
        counter: {
            type: Object as PropType<DlKpiCounterType | number>,
            default: () => ({} as DlKpiCounterType)
        },
        counterFontSize: {
            type: String,
            default: '1.88em',
            required: false
        },
        title: {
            type: String,
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
            default: null,
            required: false
        },
        progress: {
            type: Object as PropType<DlKpiProgressType>,
            default: null
        },
        bordered: {
            type: Boolean,
            default: false,
            required: false
        },
        small: {
            type: Boolean,
            default: false,
            required: false
        },
        dense: Boolean,
        prefix: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const progressValue = (progress: DlKpiProgressType) => {
            if (!progress) {
                return null
            }
            return progress?.value ? progress.value / 100 : null
        }

        const emptyString = '---'

        const isSingleWord = (text: string) => text?.split(' ').length === 1

        const cssVars = computed<Record<string, string>>(() => {
            const vars: Record<string, string> = {
                '--dl-kpi-border': props.bordered
                    ? '1px solid var(--dl-color-separator)'
                    : '',
                '--dl-kpi-title-max-width': isSingleWord(props.title)
                    ? '100%'
                    : '90%', // todo: caused a bug with single words
                '--dl-kpi-sub-title-max-width': isSingleWord(props.subtitle)
                    ? '100%'
                    : '90%'
            }

            if (props.dense) {
                vars['--dl-kpi-padding'] = '0'
            }
            return vars
        })

        const hasValue = computed(() => {
            if (typeof props.counter === 'number') {
                return true
            }
            return !!(props.counter as DlKpiCounterType).value
        })

        const counterFontSizeComputed = computed(() =>
            props.small ? '20px' : props.counterFontSize
        )
        const titleFontSizeComputed = computed(() =>
            props.small ? '14px' : props.titleFontSize
        )

        const typographyStyles = computed<Record<string, string>>(() => {
            const styles: Record<string, string> = {}
            if (typeof props.counter !== 'number' && props.counter.unit) {
                styles['text-transform'] = 'none'
            }
            return styles
        })

        const formatCounter = (counter: DlKpiCounterType | number) => {
            if (counter === null) {
                return emptyString
            }
            if (typeof counter === 'number') {
                return formatNumberCounter(counter)
            }
            if (counter.value === null || counter.value === undefined) {
                return emptyString
            }
            if (typeof counter.value === 'number') {
                return formatNumberCounter(
                    counter.value,
                    counter.format,
                    counter.unit
                )
            }
            if (typeof counter.value === 'string') {
                if (!counter.value.length) {
                    return emptyString
                }
                const [hour, minutes, seconds] = (
                    counter.value as string
                ).split(':')
                switch (counter.format) {
                    case DlKpiCounterFormat.hms: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                    case DlKpiCounterFormat.hm: {
                        return `${hour}:${minutes}`.toLowerCase()
                    }
                    case DlKpiCounterFormat.h: {
                        return `${hour}`.toLowerCase()
                    }
                    case DlKpiCounterFormat.ms: {
                        return `${minutes}:${seconds}`.toLowerCase()
                    }
                    case DlKpiCounterFormat.m: {
                        return `${minutes}`.toLowerCase()
                    }
                    case DlKpiCounterFormat.s: {
                        return `${seconds}`.toLowerCase()
                    }
                    default: {
                        return `${hour}:${minutes}:${seconds}`.toLowerCase()
                    }
                }
            }
        }

        const formatNumberCounter = (
            amount: number,
            format = '',
            unit = ''
        ) => {
            if (isNaN(amount)) {
                return emptyString
            }
            if (amount === 0) {
                return 0
            }
            if (unit === 'bytes') {
                return (
                    abbreviateBytes(amount as number) as string
                ).toUpperCase()
            }
            return format === 'short'
                ? (abbreviateNumber(amount as number) as string).toLowerCase()
                : numberWithComma(amount as number)
        }

        return {
            progressValue,
            formatCounter,
            hasValue,
            cssVars,
            titleFontSizeComputed,
            counterFontSizeComputed,
            typographyStyles
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
    padding: var(--dl-kpi-padding, 20px 6px);
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
            max-width: var(--dl-kpi-max-width, var(--dl-kpi-title-max-width));
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
            max-width: var(
                --dl-kpi-max-width,
                var(--dl-kpi-sub-title-max-width)
            );
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
