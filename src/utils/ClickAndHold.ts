export class ClickAndHold {
    private readonly target: EventTarget
    private readonly callback: Function
    private isHeld: boolean
    private activeHoldTimeoutId: ReturnType<typeof setTimeout>
    private readonly TIMEOUT: number

    constructor(target: EventTarget, callback: Function) {
        this.target = target
        this.callback = callback
        this.isHeld = false
        this.activeHoldTimeoutId = null
        this.TIMEOUT = 200

        if (!this.target) {
            return
        }

        this._initEvents()
    }

    private _initEvents() {
        this._onHoldStart()

        const EVENT_END: string[] = [
            'mouseup',
            'mouseleave',
            'mouseout',
            'touchend',
            'touchcancel'
        ]
        EVENT_END.forEach((type) => {
            this.target.addEventListener(type, this._onHoldEnd.bind(this))
        })
    }

    private _onHoldStart() {
        this.isHeld = true
        this.activeHoldTimeoutId = setTimeout(() => {
            if (this.isHeld) {
                this.callback()
            }
        }, this.TIMEOUT)
    }

    private _onHoldEnd() {
        this.isHeld = false
        clearTimeout(this.activeHoldTimeoutId)
    }

    static apply(target: EventTarget, callback: Function) {
        new ClickAndHold(target, callback)
    }
}
