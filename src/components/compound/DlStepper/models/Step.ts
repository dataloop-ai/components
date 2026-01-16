import { set, reactive } from 'vue-demi'
import { StepState } from './interfaces'

export class Step {
    _state: Required<StepState>
    _initialState: Required<StepState>

    constructor(state: StepState) {
        this._initialState = {
            active: false,
            subtitle: '',
            subtitleTooltip: '',
            completed: false,
            optional: false,
            disabled: false,
            disabledTooltip: '',
            error: '',
            warning: '',
            icon: state.icon || undefined,
            ...state
        }

        this._state = reactive(Object.assign({}, this._initialState))
    }

    public get state(): StepState {
        return this._state
    }

    public get title(): string {
        return this._state.title
    }

    public set title(value: string) {
        set(this._state, 'title', value)
    }

    public get subtitle(): string {
        return this._state.subtitle
    }

    public set subtitle(value: string) {
        set(this._state, 'subtitle', value)
    }

    public get subtitleTooltip(): string {
        return this._state.subtitleTooltip
    }

    public set subtitleTooltip(value: string) {
        set(this._state, 'subtitleTooltip', value)
    }

    public get icon(): string {
        return this._state.icon
    }

    public set icon(value: string) {
        set(this._state, 'icon', value)
    }

    public get optional(): boolean {
        return this._state.optional
    }

    public set optional(value: boolean) {
        set(this._state, 'optional', value)
    }

    public get completed(): boolean {
        return this._state.completed
    }

    public set completed(value: boolean) {
        set(this._state, 'error', '')
        set(this._state, 'warning', '')
        set(this._state, 'completed', value)
    }

    public get error(): string {
        return this._state.error
    }

    public set error(value: string) {
        set(this._state, 'error', value)
        set(this._state, 'warning', '')
        set(this._state, 'completed', false)
    }

    public get warning(): string {
        return this._state.warning
    }

    public set warning(value: string) {
        set(this._state, 'warning', value)
        set(this._state, 'error', '')
        set(this._state, 'completed', true)
    }

    public get value(): string {
        return this._state.value
    }

    public get active(): boolean {
        return this._state.active
    }

    public set active(value: boolean) {
        set(this._state, 'active', value)
    }

    public get disabled() {
        return this._state.disabled
    }

    public set disabled(value: boolean) {
        set(this._state, 'disabled', value)
    }

    public get disabledTooltip() {
        return this._state.disabledTooltip
    }

    public set disabledTooltip(value: string) {
        set(this._state, 'disabledTooltip', value)
    }

    public clearError() {
        set(this._state, 'error', '')
    }

    public clearWarning() {
        set(this._state, 'warning', '')
    }

    public clearCompleted() {
        set(this._state, 'completed', false)
    }

    public reset() {
        for (const key of Object.keys(this._initialState)) {
            if (key !== 'active') {
                // @ts-ignore
                set(this._state, key, this._initialState[key])
            }
        }
    }
}
