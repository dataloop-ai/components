<template>
    <div class="sidebar">
        <dl-list>
            <dl-list-item
                v-for="(step, index) in steps"
                :key="index"
                :data-test-index="index"
                :end-icon="getStepIcon(step)"
                :end-icon-color="getStepIconColor(step)"
                end-icon-size="16px"
                :clickable="sidebarNavigation"
                :disabled="!getStepSidebarNavigation(step)"
                :class="sidebarItemClasses(step)"
                @click="handleStepClick(step, index)"
            >
                <dl-item-section no-wrap>
                    <span :class="stepClass(step)">
                        {{ index + 1 }}.
                        <div>
                            <span>
                                {{ getStepTitle(step) }}
                            </span>
                            <span class="sidebar--subtitle">
                                {{ getStepSubtitle(step) }}
                            </span>
                        </div>
                    </span>
                </dl-item-section>
            </dl-list-item>
        </dl-list>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlListItem } from '../../../basic'
import { DlItemSection } from '../../../shared'
import { DlList } from '../../../essential'
import { Step } from '../models'

export default defineComponent({
    name: 'DlStepperSidebar',
    components: {
        DlList,
        DlListItem,
        DlItemSection
    },
    props: {
        steps: {
            type: Array as PropType<Step[]>,
            default: () => [] as Step[]
        },
        bgColor: {
            type: String,
            required: false,
            default: 'dl-color-fill-third'
        },
        sidebarNavigation: { type: Boolean, default: true }
    },
    emits: ['step-click'],
    methods: {
        getStepTitle(step: Step): string {
            const optional = step.optional ? ' (Optional)' : ''
            return `${this.capitalize(step.title)}${optional}`
        },
        getStepSubtitle(step: Step): string {
            if (step.subtitle) {
                return this.capitalize(step.subtitle)
            }
            return ''
        },
        capitalize(str: string): string {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        sidebarItemClasses(step: Step): string {
            return `sidebar--item${
                step.subtitle ? ' sidebar--item-with_subtitle' : ''
            }`
        },
        stepClass(step: Step) {
            const active = step.active
                ? 'sidebar--step-active'
                : step.completed || step.error
                ? 'sidebar--step-touched'
                : ''
            return `sidebar--step ${active}`
        },
        handleStepClick(step: Step, index: number) {
            this.$emit('step-click', step, index)
        },
        getStepIcon(step: Step): string {
            return step.error
                ? 'icon-dl-error-filled'
                : step.warning
                ? 'icon-dl-alert-filled'
                : 'icon-dl-approve-filled'
        },
        getStepIconColor(step: Step): string {
            return step.error
                ? 'dl-color-negative'
                : step.warning
                ? 'dl-color-warning'
                : step.completed
                ? 'dl-color-positive'
                : 'dl-color-transparent'
        },
        getStepSidebarNavigation(step: Step): boolean {
            return step.sidebarNavigation ?? true
        }
    }
})
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    min-width: 250px;
    padding: 15px 0px;
    border-right: 1px solid var(--dl-color-separator);
    background-color: var(--dl-stepper-bg);
    box-sizing: border-box;

    & > .dl-list {
        width: 100%;
        background-color: var(--dl-color-transparent);
    }

    &--item {
        padding: 5px 0;
        &-with_subtitle {
            ::v-deep .dl-list-item {
                height: 43px;
            }
        }
    }

    &--subtitle {
        display: block;
        line-height: 1;
        font-size: var(--dl-font-size-body);
        color: var(--dl-color-lighter);
    }

    &--step {
        display: flex;
        gap: 3px;
        font-size: var(--dl-font-size-h4);
        line-height: 18px;
        color: var(--dl-color-lighter);

        &-active {
            color: var(--dl-color-secondary);
            & .sidebar--subtitle {
                color: var(--dl-color-secondary);
            }
        }

        &-touched {
            color: var(--dl-color-darker);
        }
    }

    ::v-deep .dl-list-item {
        padding: 0px 20px;
    }
}
</style>
