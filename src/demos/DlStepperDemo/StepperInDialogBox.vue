<template>
    <div>
        <dl-button
            label="Open Dialog Box"
            @click="openStepper"
        />
        <div
            class="dl-stepper-wrapper"
            :style="cssVars"
        >
            <dl-stepper
                v-model="isOpen"
                done-button-label="Create"
                width="1000px"
                header-title="Create New Task"
                :content-title="`${stepper.currentIndex + 1}. ${
                    stepper.currentStep.value
                }`"
                :with-transition="true"
                :position="position"
                :bg-color="bgColor"
                :state="stepper.currentStep"
                :steps="stepper.steps"
                :disabled-prev-step="!stepper.hasPrevStep()"
                :disabled-next-step="!stepper.hasNextStep()"
                :is-done="stepper.isDone()"
                :next-step="stepper.getNextStep()"
                :prev-step="stepper.getPrevStep()"
                @next="handleNext"
                @prev="handlePrev"
                @done="handleDone"
                @set-step="handleStep"
            >
                <template #content-header="{ state }">
                    <div style="display: flex; gap: 20px; align-items: center">
                        <dl-typography
                            size="h3"
                            variant="h3"
                        >
                            {{
                                `${stepper.currentIndex + 1}. ${
                                    stepper.currentStep.value
                                        .charAt(0)
                                        .toUpperCase() +
                                    stepper.currentStep.value.slice(1)
                                }`
                            }}
                        </dl-typography>
                        <dl-chip
                            v-if="state.warning"
                            max-width="100%"
                            color="dl-color-warning-background"
                            text-color="dl-color-darker"
                        >
                            {{ state.warning }}
                        </dl-chip>

                        <dl-counters
                            style="padding: 0; margin-left: auto"
                            small
                            :items="counters"
                        />
                    </div>
                </template>
                <template #general>
                    <general-step
                        @error-click="stepper.failStep('Custom Error')"
                        @complete-click="stepper.completeStep()"
                        @warning-click="
                            stepper.setStepWarning('Custom Warning')
                        "
                        @reset-click="stepper.resetStep()"
                    />
                </template>
                <template #data>
                    <data-step
                        @error-click="stepper.failStep('Custom Error')"
                        @complete-click="stepper.completeStep()"
                        @warning-click="
                            stepper.setStepWarning('Custom Warning')
                        "
                        @reset-click="stepper.resetStep()"
                    />
                </template>
                <template #instructions>
                    <instruction-step
                        @error-click="stepper.failStep('Custom Error')"
                        @complete-click="stepper.completeStep()"
                        @warning-click="
                            stepper.setStepWarning('Custom Warning')
                        "
                        @reset-click="stepper.resetStep()"
                    />
                </template>
                <template #assignments>
                    <assignments-step
                        @error-click="stepper.failStep('Custom Error')"
                        @complete-click="stepper.completeStep()"
                        @warning-click="
                            stepper.setStepWarning('Custom Warning')
                        "
                        @reset-click="stepper.resetStep()"
                    />
                </template>
                <template #quality>
                    <quality-step
                        @error-click="stepper.failStep('Custom Error')"
                        @complete-click="stepper.completeStep()"
                        @warning-click="
                            stepper.setStepWarning('Custom Warning')
                        "
                        @reset-click="stepper.resetStep()"
                    />
                </template>
            </dl-stepper>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import GeneralStep from './steps/GeneralStep.vue'
import InstructionStep from './steps/InstructionStep.vue'
import DataStep from './steps/DataStep.vue'
import AssignmentsStep from './steps/AssignmentsStep.vue'
import QualityStep from './steps/QualityStep.vue'
import { DlButton, DlStepper, DlTypography, DlChip, DlCounters } from '../..'
import { StepState } from '../../types'
import { Stepper, Step } from '../../components/compound/DlStepper/models'
import { getColor } from '../../utils/index'

class CustomStepper extends Stepper {
    constructor(steps: Step[]) {
        super(steps)
    }

    public completeStep() {
        super.completeStep()
        console.log('COMPLETED')
    }
}

export default defineComponent({
    components: {
        DlStepper,
        DlButton,
        AssignmentsStep,
        InstructionStep,
        DataStep,
        GeneralStep,
        QualityStep,
        DlTypography,
        DlChip,
        DlCounters
    },
    data() {
        const stepper: Stepper = null

        return {
            counters: [{ value: 3, text: 'Assigmments' }],
            isOpen: false,
            stepper,
            steps: [
                {
                    value: 'general',
                    title: 'general',
                    warning: 'Some issues in the step',
                    completed: true
                },
                {
                    value: 'data',
                    title: 'data',
                    completed: true
                },
                {
                    value: 'instructions',
                    title: 'instructions'
                },
                {
                    value: 'assignments',
                    title: 'assignments'
                },
                {
                    value: 'quality',
                    title: 'quality',
                    optional: true
                }
            ] as StepState[],
            position: 'right',
            bgColor: 'dl-color-fill-third'
        }
    },
    computed: {
        cssVars(): Record<string, string | number> {
            return {
                '--dl-overlay-display': this.isOpen ? 'flex' : 'none',
                '--dl-stepper-bg': getColor(
                    this.bgColor,
                    'dl-color-fill-third'
                ),
                '--dl-stepper-position':
                    this.position === 'right' ? 'flex-end' : 'flex-start'
            }
        }
    },
    watch: {
        modelValue(newVal: boolean) {
            this.isOpen = newVal
            if (newVal) document.documentElement.style.overflow = 'hidden'
            else document.documentElement.style.overflow = 'auto'
        }
    },
    beforeMount() {
        const steps = this.steps.map((step) => new Step(step))
        this.stepper = new CustomStepper(steps)
    },
    methods: {
        openStepper() {
            this.isOpen = true
        },
        handleNext() {
            this.stepper.moveToNextStep()
        },
        handlePrev() {
            this.stepper.moveToPrevStep()
        },
        handleDone() {
            console.log('DONE')
        },
        handleStep(step: Step) {
            this.stepper.currentIndex = this.stepper.steps.findIndex(
                (s) => s.value === step.value
            )
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-stepper-wrapper {
    position: fixed; /* Sit on top of the page content */
    display: var(--dl-overlay-display); /* Hidden by default */
    justify-content: var(--dl-stepper-position);
    width: 100%; /* Full width (cover the whole page) */
    height: 100vh; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overscroll-behavior: contain;
    background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
    z-index: var(
        --dl-z-index-overlay
    ); /* Specify a stack order in case you're using a different order for other elements */
}
</style>
