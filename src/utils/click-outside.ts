import { listenOpts } from './events'
import { Ref } from 'vue-demi'
import { portalList } from './portal'

export interface ClickOutsideEvent extends MouseEvent {
    dlClickOutside?: boolean
}

export interface TouchOutsideEvent extends TouchEvent {
    dlClickOutside?: boolean
}

export type ClickOutsideProps = {
    anchorEl: Ref<HTMLElement | Element | null>
    innerRef: Ref<HTMLElement | null>
    onClickOutside: Function
}

let timer: number

const { notPassiveCapture } = listenOpts
const registeredList: ClickOutsideProps[] = []

function globalHandler(evt: ClickOutsideEvent | TouchOutsideEvent) {
    clearTimeout(timer)

    const target = evt.target as HTMLElement

    if (
        target === void 0 ||
        target.nodeType === 8 ||
        target.classList.contains('no-pointer-events') === true
    ) {
        return
    }

    // check last portal vm if it's
    // a DlDialog and not in seamless mode
    let portalIndex = portalList.length - 1

    while (portalIndex >= 0) {
        const proxy = (portalList[portalIndex] as any).$

        if (proxy?.type?.name !== 'DlDialog') {
            break
        }

        if (proxy?.props?.seamless !== true) {
            return
        }

        portalIndex--
    }

    for (let i = registeredList.length - 1; i >= 0; i--) {
        const state = registeredList[i]

        if (
            (state.anchorEl.value === null ||
                state.anchorEl.value.contains(target) === false) &&
            (target === document.body ||
                (state.innerRef.value !== null &&
                    state.innerRef.value.contains(target) === false))
        ) {
            // mark the event as being processed by clickOutside
            // used to prevent refocus after menu close
            evt.dlClickOutside = true
            state.onClickOutside(evt)
        } else {
            return
        }
    }
}

export function addClickOutside(clickOutsideProps: ClickOutsideProps) {
    registeredList.push(clickOutsideProps)

    if (registeredList.length === 1) {
        document.addEventListener('mousedown', globalHandler, notPassiveCapture)
        document.addEventListener(
            'touchstart',
            globalHandler,
            notPassiveCapture
        )
    }
}

export function removeClickOutside(clickOutsideProps: ClickOutsideProps) {
    const index = registeredList.findIndex((h) => h === clickOutsideProps)

    if (index > -1) {
        registeredList.splice(index, 1)

        if (registeredList.length === 0) {
            clearTimeout(timer)
            document.removeEventListener(
                'mousedown',
                globalHandler,
                notPassiveCapture
            )
            document.removeEventListener(
                'touchstart',
                globalHandler,
                notPassiveCapture
            )
        }
    }
}
