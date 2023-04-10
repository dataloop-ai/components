import { Step } from './Step'

export class Stepper {
    private _currentIndex = 0

    private _steps: Step[]

    constructor(steps: Step[]) {
        this._steps = steps

        if (this.currentStep) {
            this.currentStep.active = true
        }
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

    public completeStep() {
        if (!this.currentStep) return
        this.currentStep.completed = true
        this.moveToNextStep()
    }

    public failStep(msg?: string) {
        if (!this.currentStep) return
        this.currentStep.error = msg || ''
    }

    public setStepWarning(msg?: string) {
        if (!this.currentStep) return
        this.currentStep.warning = msg || ''
        this.moveToNextStep()
    }

    public resetStep() {
        if (!this.currentStep) return
        this.currentStep.reset()
    }
}
