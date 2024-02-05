<template>
    <div class="sidebar">
        <dl-list v-if="!hide">
            <dl-list-item
                v-for="(step, index) in steps"
                :key="index"
                :data-test-index="index"
                :end-icon="endIcon(step)"
                :start-icon="
                    step.icon
                        ? { icon: step.icon, color: 'secondary' }
                        : undefined
                "
                :clickable="!disabled"
                :disabled="isStepDisabled(step)"
                :class="sidebarItemClasses(step)"
                @click="handleStepClick(step, index)"
            >
                <dl-item-section no-wrap>
                    <span :class="stepClass(step)">
                        <span v-if="!step.icon">{{ index + 1 }}. </span>
                        <div>
                            <span>
                                {{ getStepTitle(step) }}
                            </span>
                            <span class="sidebar--subtitle">
                                {{ getStepSubtitle(step) }}
                            </span>
                        </div>
                        <dl-tooltip v-if="isStepDisabled(step)">
                            {{ getStepDisabledTooltip(step) }}
                        </dl-tooltip>
                    </span>
                </dl-item-section>
            </dl-list-item>
        </dl-list>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { DlListItem } from '../../../basic'
import { DlItemSection, DlTooltip } from '../../../shared'
import { DlList } from '../../../essential'
import { Step } from '../models'

export default defineComponent({
    name: 'DlStepperSidebar',
    components: {
        DlList,
        DlListItem,
        DlItemSection,
        DlTooltip
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
        disabled: { type: Boolean, default: false },
        hide: { type: Boolean, default: false }
    },
    emits: ['step-click'],
    methods: {
        endIcon(step: Step) {
            return {
                icon: this.getStepIcon(step),
                color: this.getStepIconColor(step),
                size: '16px'
            }
        },
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
            const classes = `sidebar--item${
                step.subtitle ? ' sidebar--item-with_subtitle' : ''
            }`
            if (step.active) {
                return `${classes} sidebar--item-active`
            }
            return classes
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
        isStepDisabled(step: Step): boolean {
            return step.disabled ?? false
        },
        getStepDisabledTooltip(step: Step): string {
            return step.disabledTooltip ?? ''
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
        &-active {
            background-color: var(--dl-color-back-tint-light);
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
