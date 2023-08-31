import { computed, reactive } from 'vue-demi'
import { ILogger, loggerFactory } from './utils'

export interface DlComponentsState {
    theme: 'light' | 'dark'
    locale: 'en' | 'es'
    disableDebounce: boolean
}

export class StateManager {
    private static _instance: StateManager | null = null
    public static get instance(): StateManager {
        if (StateManager._instance === null) {
            StateManager._instance = new StateManager()
        }
        return StateManager._instance
    }

    private _state: DlComponentsState = null
    public logger: ILogger = null

    private constructor() {
        this._state = reactive({
            theme: 'light',
            locale: 'en',
            disableDebounce: false
        })
        this.logger = loggerFactory('DlComponents')
    }

    public get state(): DlComponentsState {
        return this._state
    }

    // public theme = computed({
    //     get: () => this._state.theme,
    //     set: (theme: 'light' | 'dark') => {
    //         this._state.theme = theme
    //     }
    // })

    // public disableDebounce = computed({
    //     get: () => this._state.disableDebounce,
    //     set: (disableDebounce: boolean) => {
    //         this._state.disableDebounce = disableDebounce
    //     }
    // })

    // public isDarkTheme = computed(() => this._state.theme === 'dark')
    // public isLightTheme = computed(() => this._state.theme === 'light')

    public get theme(): 'light' | 'dark' {
        return this._state.theme
    }
    public set theme(theme: 'light' | 'dark') {
        this._state.theme = theme
    }

    public get disableDebounce(): boolean {
        return this._state.disableDebounce
    }
    public set disableDebounce(value: boolean) {
        this._state.disableDebounce = value
    }

    public get isDarkTheme(): boolean {
        return this._state.theme === 'dark'
    }
    public get isLightTheme(): boolean {
        return this._state.theme === 'light'
    }
}

export const stateManager = StateManager.instance
// @ts-ignore
window.DlComponents = StateManager.instance
