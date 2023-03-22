import { Step } from '../../src/components/DlStepper/Step'
import { describe, it, expect } from 'vitest'

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
        completed: true,
        sidebarNavigation: true,
        optional: false,
        warning: '',
        error: '',
        value: '1',
        title: 'One'
    }

    it('should have initial values', async () => {
        expect(step.state).toEqual(initialState)
    })

    it('should get fields values', async () => {
        expect(step.value).toBe('1')
        expect(step.title).toBe('One')
        expect(step.subtitle).toBe('First')
    })

    it('should set the error', () => {
        step.error = 'error message'
        expect(step.error).toBe('error message')
        expect(step.completed).toBe(false)
    })

    it('should set the step as completed', () => {
        step.completed = true
        expect(step.completed).toBe(true)
    })

    it('should set the step as active', () => {
        step.active = true
        expect(step.active).toBe(true)
    })

    it('should set the step as optional', () => {
        step.optional = true
        expect(step.optional).toBe(true)
    })

    it('should reset the state', () => {
        step.reset()

        expect(step.state).toEqual({ ...initialState, active: true })
    })
})
