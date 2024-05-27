import { computed, onBeforeMount, ref } from 'vue-demi'
import {
    DlStepper,
    DlButton,
    Stepper,
    Step,
    DlTypography,
    DlChip,
    DlCounters
} from '../'
import GeneralStep from '../demos/DlStepperDemo/steps/GeneralStep.vue'
import InstructionStep from '../demos/DlStepperDemo/steps/InstructionStep.vue'
import DataStep from '../demos/DlStepperDemo/steps/DataStep.vue'
import AssignmentsStep from '../demos/DlStepperDemo/steps/AssignmentsStep.vue'
import QualityStep from '../demos/DlStepperDemo/steps/QualityStep.vue'
import { getColor } from '../utils'
import './assets/stepper.scss'

const defaultSteps = [
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
        title: 'instructions',
        subtitle: 'some text',
        icon: 'icon-dl-info'
    },
    {
        value: 'assignments',
        title: 'assignments',
        icon: 'icon-dl-assignment'
    },
    {
        value: 'quality',
        title: 'quality',
        optional: true
    }
].map((step) => new Step(step))

export default {
    title: 'Library/Components/DlStepper',
    component: DlStepper,
    argTypes: {
        steps: {
            name: 'steps',
            defaultValue: defaultSteps,
            description: 'An array of Step objects',
            control: 'array',
            table: {
                type: { summary: Array }
            }
        },
        state: {
            name: 'state',
            defaultValue: {},
            description: 'A StepState object to set the current state',
            control: 'object',
            table: {
                type: { summary: Object }
            }
        },
        headerTitle: {
            name: 'headerTitle',
            defaultValue: '',
            description: 'The text to be shown inside the header title',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        contentTitle: {
            name: 'contentTitle',
            defaultValue: '',
            description: 'The text to be shown inside the content title',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        doneButtonLabel: {
            name: 'doneButtonLabel',
            defaultValue: '',
            description: 'The text to be shown inside the done button',
            control: 'text',
            table: {
                type: { summary: String }
            }
        },
        width: {
            name: 'width',
            defaultValue: '900px',
            description: 'The width of the stepper',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '900px' }
            }
        },
        sidebarWidth: {
            name: 'sidebarWidth',
            defaultValue: '100%',
            description: 'The width of the stepper sidebar',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '100%' }
            }
        },
        hasNextStep: {
            name: 'hasNextStep',
            defaultValue: false,
            description:
                'Will show a button inside the stepper leading to the next step',
            control: 'boolean',
            table: {
                type: { summary: Boolean }
            }
        },
        hasPrevStep: {
            name: 'hasPrevStep',
            defaultValue: false,
            description:
                'Will show a button inside the stepper leading to the previous step',
            control: 'boolean',
            table: {
                type: { summary: Boolean }
            }
        },
        withTransition: {
            name: 'withTransition',
            defaultValue: false,
            description: 'Will show stepper inside transition wrapper',
            control: 'boolean',
            table: {
                type: { summary: Boolean }
            }
        },
        transitionDuration: {
            name: 'transitionDuration',
            defaultValue: 0.3,
            description: 'The duration of the transition',
            control: 'number',
            table: {
                type: { summary: Number }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlStepper,
        DlButton,
        GeneralStep,
        InstructionStep,
        DataStep,
        AssignmentsStep,
        QualityStep,
        DlTypography,
        DlChip,
        DlCounters
    },
    setup() {
        const isOpen = ref(true)
        const stepper = ref(null)

        const counters = ref([{ value: 3, text: 'Assigmments' }])

        onBeforeMount(() => {
            const steps = defaultSteps
            stepper.value = new Stepper(steps)
        })

        const openStepper = () => {
            isOpen.value = true
        }

        const handleNext = () => {
            stepper.value.moveToNextStep()
        }
        const handlePrev = () => {
            stepper.value.moveToPrevStep()
        }

        const handleDone = () => {
            console.log('DONE')
        }

        const handleStep = (step) => {
            stepper.value.currentIndex = stepper.value.steps.findIndex(
                (s) => s.value === step.value
            )
        }

        const contentTitle = computed(() => {
            if (stepper.value) {
                return `${stepper.value.currentIndex + 1}. ${
                    stepper.value.currentStep.value.charAt(0).toUpperCase() +
                    stepper.value.currentStep.value.slice(1)
                }`
            }

            return ''
        })

        return {
            args,
            isOpen,
            openStepper,
            handleNext,
            handlePrev,
            handleDone,
            handleStep,
            stepper,
            contentTitle,
            counters
        }
    },
    template: `
    <div :style="{ width: '100%', margin: 'auto', height: '600px' }">
        <dl-stepper
        v-model="isOpen"
        v-if="stepper"
        done-button-label="Create"
        :position="args.position"
        header-title="Create New Task"
        :content-title="contentTitle"
        :state="stepper.currentStep"
        :steps="stepper.steps"
        :has-prev-step="stepper.hasPrevStep()"
        :has-next-step="stepper.hasNextStep()"
        :is-done="stepper.isDone()"
        @next="handleNext"
        @prev="handlePrev"
        @done="handleDone"
        @set-step="handleStep"
        :with-transition="args.withTransition"
        :width="args.width"
        :bgColor="args.bgColor"
    >
    <template #content-header="{ state }">
        <div style="display: flex; gap: 20px">
            <dl-typography
                size="h3"
                variant="h3"
            >
                {{
                    contentTitle
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
                @reset-click="stepper.resetStep()"
            />
        </template>
        <template #data>
            <data-step
                @error-click="stepper.failStep('Custom Error')"
                @complete-click="stepper.completeStep()"
                @reset-click="stepper.resetStep()"
            />
        </template>
        <template #instructions>
            <instruction-step
                @error-click="stepper.failStep('Custom Error')"
                @complete-click="stepper.completeStep()"
                @reset-click="stepper.resetStep()"
            />
        </template>
        <template #assignments>
            <assignments-step
                @error-click="stepper.failStep('Custom Error')"
                @complete-click="stepper.completeStep()"
                @reset-click="stepper.resetStep()"
            />
        </template>
        <template #quality>
            <quality-step
                @error-click="stepper.failStep('Custom Error')"
                @complete-click="stepper.completeStep()"
                @reset-click="stepper.resetStep()"
            />
        </template>
    </dl-stepper>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {}

const StepperInsideDialogTemplate = (args) => ({
    components: {
        DlStepper,
        DlButton,
        GeneralStep,
        InstructionStep,
        DataStep,
        AssignmentsStep,
        QualityStep,
        DlTypography,
        DlChip,
        DlCounters
    },
    setup() {
        const isOpen = ref(false)
        const stepper = ref(null)

        const counters = ref([{ value: 3, text: 'Assigmments' }])

        onBeforeMount(() => {
            const steps = defaultSteps
            stepper.value = new Stepper(steps)
        })

        const openStepper = () => {
            isOpen.value = true
        }

        const handleNext = () => {
            stepper.value.moveToNextStep()
        }
        const handlePrev = () => {
            stepper.value.moveToPrevStep()
        }

        const handleDone = () => {
            console.log('DONE')
        }

        const handleStep = (step) => {
            stepper.value.currentIndex = stepper.value.steps.findIndex(
                (s) => s.value === step.value
            )
        }

        const contentTitle = computed(() => {
            if (stepper.value) {
                return `${stepper.value.currentIndex + 1}. ${
                    stepper.value.currentStep.value.charAt(0).toUpperCase() +
                    stepper.value.currentStep.value.slice(1)
                }`
            }

            return ''
        })

        return {
            args,
            isOpen,
            openStepper,
            handleNext,
            handlePrev,
            handleDone,
            handleStep,
            stepper,
            contentTitle,
            counters
        }
    },
    computed: {
        cssVars() {
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
    template: `
    <div>
        <dl-button
            label="Open Dialog Box"
            @click="openStepper"
        />
        <div
        v-if="isOpen"
            class="dl-stepper-wrapper"
            :style="cssVars"
        >
                <dl-stepper
                    v-model="isOpen"
                    done-button-label="Create"
                    width="700px"
                    header-title="Create New Task"
                    :with-transition="args.withTransition"
                    :content-title="contentTitle"
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
                        <div style="display: flex; gap: 20px">
                            <dl-typography
                                size="h3"
                                variant="h3"
                            >
                                {{
                                    contentTitle
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
   `
})

export const StepperInsideDialogPreview = StepperInsideDialogTemplate.bind({})
StepperInsideDialogTemplate.args = {}

const CenteredInsideDialogTemplate = (args) => ({
    components: {
        DlStepper,
        DlButton,
        GeneralStep,
        InstructionStep,
        DataStep,
        AssignmentsStep,
        QualityStep,
        DlTypography,
        DlChip,
        DlCounters
    },
    setup() {
        const isOpen = ref(false)
        const stepper = ref(null)

        const counters = ref([{ value: 3, text: 'Assigmments' }])

        onBeforeMount(() => {
            const steps = defaultSteps
            stepper.value = new Stepper(steps)
        })

        const openStepper = () => {
            isOpen.value = true
        }

        const handleNext = () => {
            stepper.value.moveToNextStep()
        }
        const handlePrev = () => {
            stepper.value.moveToPrevStep()
        }

        const handleDone = () => {
            console.log('DONE')
        }

        const handleStep = (step) => {
            stepper.value.currentIndex = stepper.value.steps.findIndex(
                (s) => s.value === step.value
            )
        }

        const contentTitle = computed(() => {
            if (stepper.value) {
                return `${stepper.value.currentIndex + 1}. ${
                    stepper.value.currentStep.value.charAt(0).toUpperCase() +
                    stepper.value.currentStep.value.slice(1)
                }`
            }

            return ''
        })

        return {
            args,
            isOpen,
            openStepper,
            handleNext,
            handlePrev,
            handleDone,
            handleStep,
            stepper,
            contentTitle,
            counters
        }
    },
    computed: {
        cssVars() {
            return {
                '--dl-overlay-display': this.isOpen ? 'flex' : 'none',
                '--dl-stepper-bg': getColor(
                    this.bgColor,
                    'dl-color-fill-third'
                ),
                '--dl-stepper-position': 'center'
            }
        }
    },
    template: `
    <div>
    <dl-button label="Open Dialog Box (Center)" @click="openStepper" />
    <div class="dl-stepper-wrapper" :style="cssVars">
            <dl-stepper
                v-model="isOpen"
                done-button-label="Create"
                width="800px"
                style="max-height: 400px"
                header-title="Create New Task"
                :content-title="contentTitle"
                :bg-color="bgColor"
                :with-transition="args.withTransition"
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
                    <div style="display: flex; gap: 20px">
                        <dl-typography size="h3" variant="h3">
                            {{
                                contentTitle
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
   `
})

export const CenteredInsideDialogPreview = CenteredInsideDialogTemplate.bind({})
CenteredInsideDialogTemplate.args = {}
