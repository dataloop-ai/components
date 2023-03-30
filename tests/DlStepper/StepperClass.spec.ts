import { Stepper as StepperClass } from '../../src/components/compound/DlStepper/models/Stepper'
import { Step } from '../../src/components/compound/DlStepper/models/Step'
import { StepState } from '../../src/components/types'
import { describe, it, expect } from 'vitest'

// jest.mock('../../src/components/DlStepper/Stepper')

const options = [
    {
        value: 'general',
        title: 'general',
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
] as StepState[]

// const getterMethodMock = jest
//     .spyOn(StepperClass.prototype, 'currentIndex', 'get')
//     .mockImplementation(() => 0)

it('Check a method on the class instance', () => {
    // Show that mockClear() is working:

    const steps = options.map((step) => new Step(step))
    const stepperConsumer = new StepperClass(steps)

    // expect(getterMethodMock).toHaveBeenCalled()

    expect(stepperConsumer.steps).toBe(steps)

    expect(stepperConsumer.currentIndex).toBe(0)

    expect(stepperConsumer.hasNextStep()).toBe(true)

    expect(stepperConsumer.hasPrevStep()).toBe(false)

    expect(stepperConsumer.isDone()).toBe(false)

    stepperConsumer.moveToNextStep()

    expect(stepperConsumer.currentIndex).toBe(1)

    stepperConsumer.moveToPrevStep()

    expect(stepperConsumer.currentIndex).toBe(0)

    stepperConsumer.completeStep()

    expect(stepperConsumer.currentIndex).toBe(1)

    stepperConsumer.failStep('error')

    expect(stepperConsumer.currentStep!.error).toBe('error')

    stepperConsumer.failStep()

    expect(stepperConsumer.currentStep!.error).toBe('')

    stepperConsumer.resetStep()
})

it('Check a method on the class instance if no steps prop is given', () => {
    // Show that mockClear() is working:

    const stepperConsumer = new StepperClass([])

    expect(stepperConsumer.currentStep).toBe(null)

    stepperConsumer.completeStep()

    stepperConsumer.failStep()

    stepperConsumer.resetStep()
})
