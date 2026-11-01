import { isVue2 } from 'vue-demi'

/**
 * Keyboard support for DlMenu / DlPopup content: list items are plain divs
 * and focus never enters a menu on its own.
 * Register globally (`Vue.directive('menu-keyboard-nav', MenuKeyboardNav)`)
 * and put `v-menu-keyboard-nav` on an element inside the menu content; the
 * enclosing `.dl-menu` is what gets navigated.
 *
 * - Opening a menu from the keyboard moves focus to its first item
 * - ArrowDown / ArrowUp / Home / End move between items
 * - Enter / Space activate the focused item
 * - ArrowRight, Enter or Space on an item with a submenu opens it,
 *   ArrowLeft closes it and returns to the parent item
 * - Tab closes the whole menu chain and returns focus to its trigger
 * - Escape is already handled by DlMenu (closes the top-most menu)
 */

const ITEM_SELECTOR = [
    '.dl-list-item',
    '[data-menu-item]',
    '.container-wrapper > label.container', // DlRadio
    'input.dl-switch-checkbox' // DlSwitch
].join(', ')
const SUBMENU_ICON_SELECTOR = '.icon-dl-right-chevron'
const INSTANCE_KEY = '_menuKeyboardNav'

interface MenuNavInstance {
    root: HTMLElement
    opener: HTMLElement | null
    parent: MenuNavInstance | null
    onKeydown: (e: KeyboardEvent) => void
}

const instances: MenuNavInstance[] = []
let listenersInstalled = false
let keyboardMode = false
// Enter / Space currently held down, used to swallow their keyup (see below)
let heldActivationKey: string | null = null
let keyupToSwallow: string | null = null
let pendingSubmenuFocus = false

/**
 * DlMenu toggles on Enter keyup at its trigger, and native buttons click on
 * Space keyup. When a key press opens a menu or activates an item (which
 * closes the menu and refocuses the trigger), the keyup that follows would
 * immediately toggle the menu again, so it is swallowed at its target.
 */
function swallowEvent(e: Event) {
    e.preventDefault()
    e.stopImmediatePropagation()
}

function onWindowKeydown(e: KeyboardEvent) {
    keyboardMode = true
    if (e.key === 'Enter' || e.key === ' ') {
        heldActivationKey = e.key
    }
    // Menu opened with the mouse: arrows move focus into it
    if (
        (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
        instances.length &&
        !isTextField(e.target as HTMLElement) &&
        !instances.some((i) => i.root.contains(document.activeElement))
    ) {
        e.preventDefault()
        focusItem(
            instances[instances.length - 1],
            e.key === 'ArrowDown' ? 0 : -1
        )
    }
}

function onWindowKeyup(e: KeyboardEvent) {
    if (e.key === heldActivationKey) {
        heldActivationKey = null
    }
    if (keyupToSwallow && e.key === keyupToSwallow) {
        keyupToSwallow = null
        e.target?.addEventListener('keyup', swallowEvent, {
            capture: true,
            once: true
        })
    }
}

function onWindowPointerdown() {
    keyboardMode = false
    pendingSubmenuFocus = false
}

function installListeners() {
    if (listenersInstalled) {
        return
    }
    listenersInstalled = true
    window.addEventListener('keydown', onWindowKeydown, true)
    window.addEventListener('keyup', onWindowKeyup, true)
    window.addEventListener('pointerdown', onWindowPointerdown, true)
}

function isTextField(el: HTMLElement | null) {
    if (!el) {
        return false
    }
    if (el.isContentEditable || el.tagName === 'TEXTAREA') {
        return true
    }
    return (
        el.tagName === 'INPUT' &&
        !['checkbox', 'radio'].includes((el as HTMLInputElement).type)
    )
}

function isListItem(el: HTMLElement) {
    return el.classList.contains('dl-list-item')
}

function isClickableListItem(el: HTMLElement) {
    // DlListItem exposes clickable && !disabled only through this inline var
    return el.style.getPropertyValue('--dl-list-item-cursor') === 'pointer'
}

function isEnabled(el: HTMLElement) {
    if (isListItem(el)) {
        return isClickableListItem(el)
    }
    if (el.tagName === 'INPUT') {
        return !(el as HTMLInputElement).disabled
    }
    return (
        !el.classList.contains('disabled') &&
        el.getAttribute('aria-disabled') !== 'true'
    )
}

function hasSubmenu(el: HTMLElement) {
    return isListItem(el) && !!el.querySelector(SUBMENU_ICON_SELECTOR)
}

function getItems(root: HTMLElement): HTMLElement[] {
    const candidates = Array.from(
        root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)
    )
    const items = candidates.filter(
        (el) =>
            isEnabled(el) &&
            el.getClientRects().length > 0 &&
            // controls inside a clickable row are reached through the row
            !candidates.some(
                (other) =>
                    other !== el &&
                    isListItem(other) &&
                    isClickableListItem(other) &&
                    other.contains(el)
            )
    )
    for (const item of items) {
        if (isListItem(item)) {
            item.setAttribute('role', 'menuitem')
            if (!item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '-1')
            }
            if (hasSubmenu(item)) {
                item.setAttribute('aria-haspopup', 'menu')
            }
        } else if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '-1')
        }
    }
    return items
}

function focusItem(instance: MenuNavInstance, index: number) {
    const items = getItems(instance.root)
    if (!items.length) {
        instance.root.focus({ preventScroll: true })
        return
    }
    const wrapped = ((index % items.length) + items.length) % items.length
    items[wrapped].focus({ preventScroll: true })
}

function childOf(instance: MenuNavInstance, opener: HTMLElement) {
    return instances.find((i) => i.parent === instance && i.opener === opener)
}

/**
 * Submenus in the app open on hover (mouseenter -> ref.show()), which is
 * idempotent, unlike the anchor click handler that toggles.
 */
function openSubmenu(instance: MenuNavInstance, item: HTMLElement) {
    const child = childOf(instance, item)
    if (child) {
        focusItem(child, 0)
        return
    }
    pendingSubmenuFocus = true
    const hoverTarget =
        (item.closest('.list-item-wrapper') as HTMLElement) || item
    hoverTarget.dispatchEvent(new MouseEvent('mouseenter'))
}

/** DlMenu only closes from its own escape-key handler, so reuse it. */
function dispatchEscape() {
    for (const type of ['keydown', 'keyup']) {
        const evt = new KeyboardEvent(type, { key: 'Escape' })
        Object.defineProperty(evt, 'keyCode', { get: () => 27 })
        window.dispatchEvent(evt)
    }
}

function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve))
}

function closeSubmenu(instance: MenuNavInstance) {
    const parentItem = instance.opener
    dispatchEscape()
    requestAnimationFrame(() => {
        if (parentItem?.isConnected) {
            parentItem.focus({ preventScroll: true })
        }
    })
}

async function closeChain(instance: MenuNavInstance) {
    const chain: MenuNavInstance[] = []
    for (let i = instance; i; i = i.parent) {
        chain.push(i)
    }
    const trigger = chain[chain.length - 1].opener
    // A v-model bound menu hides asynchronously, so close one level per frame
    for (const level of chain) {
        if (!instances.includes(level)) {
            continue
        }
        dispatchEscape()
        await nextFrame()
    }
    if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true })
    }
}

function onMenuKeydown(instance: MenuNavInstance, e: KeyboardEvent) {
    const target = e.target as HTMLElement
    if (e.defaultPrevented || isTextField(target)) {
        return
    }
    const items = getItems(instance.root)
    const current = items.find((i) => i === target || i.contains(target))
    const index = current ? items.indexOf(current) : -1

    switch (e.key) {
        case 'ArrowDown':
            focusItem(instance, index + 1)
            break
        case 'ArrowUp':
            focusItem(instance, index < 0 ? -1 : index - 1)
            break
        case 'Home':
            focusItem(instance, 0)
            break
        case 'End':
            focusItem(instance, -1)
            break
        case 'ArrowRight':
            if (!current || !hasSubmenu(current)) {
                return
            }
            openSubmenu(instance, current)
            break
        case 'ArrowLeft':
            if (!instance.parent) {
                return
            }
            closeSubmenu(instance)
            break
        case 'Enter':
        case ' ':
            if (!current) {
                return
            }
            // A focused switch toggles natively on Space
            if (current.tagName === 'INPUT' && e.key === ' ') {
                return
            }
            keyupToSwallow = e.key
            if (hasSubmenu(current)) {
                openSubmenu(instance, current)
            } else {
                current.click()
            }
            break
        case 'Tab':
            closeChain(instance)
            break
        default:
            return
    }
    e.preventDefault()
    e.stopPropagation()
}

const menuKeyboardNavV2 = {
    inserted(el: any) {
        // The whole menu is navigated, so popup headers / footers are included
        const root = el.closest('.dl-menu') as HTMLElement | null
        if (!root) {
            return
        }
        installListeners()
        const opener =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
        const parent =
            [...instances]
                .reverse()
                .find((i) => opener && i.root.contains(opener)) || null
        const instance: MenuNavInstance = {
            root,
            opener,
            parent,
            onKeydown: (e) => onMenuKeydown(instance, e)
        }
        el[INSTANCE_KEY] = instance
        instances.push(instance)
        root.addEventListener('keydown', instance.onKeydown)
        if (!root.hasAttribute('role')) {
            root.setAttribute('role', 'menu')
        }

        // Opened by an Enter keydown: its keyup must not toggle it closed
        if (heldActivationKey === 'Enter') {
            keyupToSwallow = 'Enter'
        }
        const focusFirst = parent ? pendingSubmenuFocus : keyboardMode
        if (parent) {
            pendingSubmenuFocus = false
        }
        if (focusFirst) {
            requestAnimationFrame(() => {
                if (instances.includes(instance)) {
                    focusItem(instance, 0)
                }
            })
        }
    },
    unbind(el: any) {
        const instance: MenuNavInstance = el[INSTANCE_KEY]
        if (!instance) {
            return
        }
        instance.root.removeEventListener('keydown', instance.onKeydown)
        const index = instances.indexOf(instance)
        if (index > -1) {
            instances.splice(index, 1)
        }
        delete el[INSTANCE_KEY]
    }
}

const menuKeyboardNavV3 = {
    mounted(el: any) {
        menuKeyboardNavV2.inserted(el)
    },
    unmounted(el: any) {
        menuKeyboardNavV2.unbind(el)
    }
}

export default isVue2 ? menuKeyboardNavV2 : menuKeyboardNavV3
