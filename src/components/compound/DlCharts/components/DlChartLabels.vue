<template>
    <div
        :style="labelStyles"
        class="dl-chart-labels-container"
    >
        <div class="dl-chart-labels">
            <div
                v-for="(label, index) in labels"
                :key="index"
                class="dl-chart-labels--label"
            >
                <dl-tooltip v-if="isOverflowing[index]">
                    {{ stringVerification(label.title, label) }}
                </dl-tooltip>
                <dl-typography
                    v-if="isVue2"
                    ref="textRef"
                    :size="fontSize"
                    :data-index="index"
                    :color="labelColor"
                >
                    {{ label.title || label }}
                </dl-typography>
                <dl-typography
                    v-else
                    :ref="(el) => forwardChildEl(el, 'textRef', index)"
                    :data-index="index"
                    :size="fontSize"
                    :color="labelColor"
                >
                    {{ stringVerification(label.title, label) }}
                </dl-typography>
            </div>
        </div>
        <div
            v-if="hasSubtitles"
            class="dl-chart-labels"
        >
            <div
                v-for="(label, index) in labels"
                :key="index"
                class="dl-chart-labels--label"
            >
                <dl-tooltip v-if="isOverFlowingSubtitles[index]">
                    {{ stringVerification(label.subtitle) }}
                </dl-tooltip>
                <dl-typography
                    v-if="isVue2"
                    ref="subtitleRef"
                    :size="fontSize"
                    :data-index="index"
                    color="dl-color-medium"
                >
                    {{ stringVerification(label.subtitle) }}
                </dl-typography>
                <dl-typography
                    v-else
                    :ref="(el) => forwardChildEl(el, 'subtitleRef', index)"
                    :data-index="index"
                    :size="fontSize"
                    color="dl-color-medium"
                >
                    {{ stringVerification(label.subtitle) }}
                </dl-typography>
            </div>
        </div>
        <div
            v-if="title"
            class="dl-chart-labels-title"
        >
            <dl-typography
                :size="titleSize"
                :color="titleColor"
            >
                {{ title }}
            </dl-typography>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType, isVue2 } from 'vue-demi'
import { isEllipsisActive } from '../../../../utils/is-ellipsis-active'
import DlTypography from '../Basic/DlTypography/DlTypography.vue'
import DlTooltip from '../DlTooltip.vue'

type ObserverRefs = {
    ref: 'resizeObserverTitle' | 'resizeObserverSubtitle'
    elementRef: 'textRef' | 'subtitleRef'
    state: 'isOverflowing' | 'isOverFlowingSubtitles'
}

const observerRefs = [
    {
        ref: 'resizeObserverTitle',
        elementRef: 'textRef',
        state: 'isOverflowing'
    },
    {
        ref: 'resizeObserverSubtitle',
        elementRef: 'subtitleRef',
        state: 'isOverFlowingSubtitles'
    }
] as ObserverRefs[]

export default defineComponent({
    name: 'DlChartLabels',
    components: {
        DlTooltip,
        DlTypography
    },
    props: {
        width: {
            type: String,
            default: '100%'
        },
        fontSize: {
            type: String,
            default: '12px'
        },
        title: {
            type: String,
            default: null
        },
        titleSize: {
            type: String,
            default: '12px'
        },
        titleColor: {
            type: String,
            default: '#000'
        },
        labelColor: {
            type: String,
            default: '#000'
        },
        labels: {
            type: Array as PropType<
                string[] | { title: string; subtitle: string }[]
            >,
            default: () =>
                [] as unknown as
                    | string[]
                    | { title: string; subtitle: string }[]
        }
    },
    data(): {
        uuid: string
        isOverflowing: boolean[]
        isOverFlowingSubtitles: boolean[]
        textRef: Element[]
        subtitleRef: Element[]
        resizeObserverTitle: ResizeObserver | null
        resizeObserverSubtitle: ResizeObserver | null
    } {
        return {
            uuid: `dl-chart-legent-${v4()}`,
            isOverflowing: [],
            isOverFlowingSubtitles: [],
            textRef: [],
            subtitleRef: [],
            resizeObserverTitle: null,
            resizeObserverSubtitle: null
        }
    },
    computed: {
        labelStyles(): Record<string, string> {
            return {
                '--dl-chart-labels-width': this.width
            }
        },
        hasSubtitles(): boolean {
            return this.labels.some(
                (e: string | Record<string, string>) =>
                    typeof e === 'object' && !!e.subtitle
            )
        },
        isVue2(): boolean {
            return isVue2
        }
    },
    mounted() {
        observerRefs.forEach(({ ref, state }) => {
            this[ref] = new ResizeObserver((entries) => {
                const tempArr = [...this[state]]
                this.getEllipsedElements(entries, tempArr)
                this[state] = tempArr
            })
        })
        observerRefs.forEach(({ elementRef, ref }) => {
            const elements = isVue2
                ? (((this.$refs[elementRef] as any[]) || []).map(
                      (ref: any) => ref.$el
                  ) as Element[])
                : this[elementRef]
            for (const el of elements as Element[]) {
                (this[ref] as ResizeObserver).observe(el)
            }
        })
    },
    beforeUnmount() {
        observerRefs.forEach(({ ref }) => {
            (this[ref] as ResizeObserver).disconnect()
            this[ref] = null
        })
    },
    methods: {
        stringVerification(value: string, fallback = '') {
            return value || fallback
        },
        getEllipsedElements(elements: ResizeObserverEntry[], state: boolean[]) {
            for (const entry of elements) {
                const index = parseInt(
                    (entry.target as any).dataset.index ?? '0'
                )
                state[index] = isEllipsisActive(entry.target)
            }
        },
        forwardChildEl(
            el: { $el: Element },
            refName: 'textRef' | 'subtitleRef',
            index: number
        ) {
            if (el?.$el) {
                (this[refName] as Element[])[index] = el.$el
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-chart-labels-container {
    width: 100%;
    display: flex;
    flex-direction: column;

    .dl-chart-labels-title {
        width: 100%;
        display: flex;
        align-self: flex-end;
        justify-content: center;
        margin-top: 10px;
        max-width: var(--dl-chart-labels-width);
    }

    .dl-chart-labels {
        display: flex;
        align-self: flex-end;
        justify-content: space-between;
        max-width: var(--dl-chart-labels-width);
        width: 100%;

        &--label {
            display: flex;
            width: 100%;
            justify-content: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            align-items: flex-start;

            & > .dl-typography {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            & > div,
            .dl-typography {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
