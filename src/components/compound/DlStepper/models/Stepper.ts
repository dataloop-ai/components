import { Step } from './Step'

export class Stepper {
    private _currentIndex = 0

    private _steps: Step[]

    constructor(steps: Step[]) {
        this._steps = steps

        const activeStepIndex = steps.findIndex((step) => step.active)
        this.currentIndex = Math.max(0, activeStepIndex)
    }

    public get steps(): Step[] {
        return this._steps
    }

    public set currentIndex(v: number) {
        this._currentIndex = v

        this._steps.forEach((step) => {
            step.active = false
        })

        if (this.currentStep) {
            this.currentStep.active = true
        }
    }

    public get currentIndex(): number {
        return this._currentIndex
    }

    public get currentStep(): Step | null {
        if (this._steps.length === 0) {
            return null
        }

        return this._steps[this.currentIndex]
    }

    public hasPrevStep(): boolean {
        return this.currentIndex > 0 && this.currentIndex < this._steps.length
    }

    public hasNextStep(): boolean {
        return (
            this.currentIndex >= 0 && this.currentIndex < this._steps.length - 1
        )
    }

    public getNextStep(): Step {
        if (this.hasNextStep()) {
            return this.steps[this._currentIndex + 1]
        }
        return null
    }

    public getPrevStep(): Step {
        if (this.hasPrevStep()) {
            return this.steps[this._currentIndex - 1]
        }
        return null
    }

    public isDone(): boolean {
        return this._steps.every(
            (step: Step) => step.completed || step.optional
        )
    }

    public moveToNextStep() {
        if (this.hasNextStep()) {
            this.currentIndex = this.currentIndex + 1
        }
    }

    public moveToPrevStep() {
        if (this.hasPrevStep()) {
            this.currentIndex = this.currentIndex - 1
        }
    }

    /**
     *
     * @param options { step?: number; preventNext?: boolean }
     * @param options.step The steps to complete
     * @param options.preventNext Prevents the stepper from moving to the next step
     * @returns
     */
    public completeStep(options: { step?: Step; preventNext?: boolean } = {}) {
        const { step, preventNext } = options
        const stepToComplete = step ?? this.currentStep

        if (!stepToComplete) {
            return
        }

        stepToComplete.completed = true

        if (!preventNext) {
            this.moveToNextStep()
        }
    }

    /**
     * @param message The error message
     * @param options { step?: number; preventNext?: boolean }
     * @param options.step The steps to Fail
     * @returns
     */
    public failStep(message?: string, options: { step?: Step } = {}) {
        const { step } = options
        const stepToFail = step ?? this.currentStep

        if (!stepToFail) {
            return
        }

        stepToFail.error = message ?? ''
    }

    /**
     * @param message The warning message
     * @param options { step?: number; preventNext?: boolean }
     * @param options.step The steps to Warn
     * @param options.preventNext Prevents the stepper from moving to the next step
     * @returns
     */
    public setStepWarning(
        message?: string,
        options: { step?: Step; preventNext?: boolean } = {}
    ) {
        const { step, preventNext } = options
        const stepToWarn = step ?? this.currentStep

        if (!stepToWarn) {
            return
        }

        stepToWarn.warning = message ?? ''

        if (!preventNext) {
            this.moveToNextStep()
        }
    }

    /**
     *
     * @param options { step?: number; preventNext?: boolean }
     * @param options.step The steps to reset
     * @returns
     */
    public resetStep(options: { step?: Step } = {}) {
        const { step } = options
        const stepToReset = step ?? this.currentStep

        if (!stepToReset) {
            return
        }

        stepToReset.reset()
    }

    /**
     *
     * @param options { step?: number; error?: boolean, warning?: boolean, completed?: boolean }
     * @param options.step The step to clear its state
     * @returns
     */
    public clearStepState(
        options: {
            step?: Step
            error?: boolean
            warning?: boolean
            completed?: boolean
        } = {}
    ) {
        const { step, error, warning, completed } = options
        const stepToClear = step ?? this.currentStep

        if (!stepToClear) {
            return
        }

        if (error) {
            stepToClear.clearError()
        }

        if (warning) {
            stepToClear.clearWarning()
        }

        if (completed) {
            stepToClear.clearCompleted()
        }
    }
}
