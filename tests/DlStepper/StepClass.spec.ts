import { Step } from '../../src/components/compound/DlStepper/models/Step'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Step', () => {
    const step = new Step({
        value: '1',
        title: 'One',
        subtitle: 'First',
        completed: true
    })

    const initialState = {
        active: false,
        subtitle: 'First',
        subtitleTooltip: '',
        completed: true,
        optional: false,
        disabled: false,
        disabledTooltip: '',
        error: '',
        warning: '',
        icon: undefined,
        value: '1',
        title: 'One'
    }
    describe('When mounted', () => {
        it('should have initial values', () => {
            expect(step.state).toEqual(initialState)
        })

        it('should get fields values', () => {
            expect(step.value).toBe('1')
            expect(step.title).toBe('One')
            expect(step.subtitle).toBe('First')
        })
    })
    describe('When set step error', () => {
        beforeAll(() => {
            step.error = 'error message'
        })
        it('should the right error', () => {
            expect(step.error).toBe('error message')
        })
        it('should not completed the step', function () {
            expect(step.completed).toBe(false)
        })
    })
    describe('When set the step as completed', () => {
        beforeAll(() => {
            step.completed = true
        })
        it('should completed the step', () => {
            expect(step.completed).toBe(true)
        })
    })
    describe('When set the step as active', () => {
        beforeAll(() => {
            step.active = true
        })
        it('should active the step', () => {
            expect(step.active).toBe(true)
        })
    })
    describe('When set the step as optional', () => {
        beforeAll(() => {
            step.optional = true
        })
        it('should optional the step', () => {
            expect(step.optional).toBe(true)
        })
    })
    describe('When reset the step', () => {
        beforeAll(() => {
            step.reset()
        })
        it('should reset the state', () => {
            expect(step.state).toEqual({ ...initialState, active: true })
        })
    })
})
