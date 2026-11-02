import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { attachMenuKeyboardNav } from '../../src/utils/menu-keyboard-nav'
import { waitNextFrame } from '../TestingUtils'

function createMenu(itemCount: number, extraHtml = '') {
    const root = document.createElement('div')
    root.className = 'dl-menu'
    root.tabIndex = -1
    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement('div')
        item.className = 'dl-list-item'
        item.style.setProperty('--dl-list-item-cursor', 'pointer')
        item.textContent = `item ${i}`
        root.appendChild(item)
    }
    root.insertAdjacentHTML('beforeend', extraHtml)
    document.body.appendChild(root)
    return root
}

function press(target: Element, key: string) {
    const evt = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true
    })
    target.dispatchEvent(evt)
    return evt
}

describe('menu-keyboard-nav', () => {
    let detach: () => void
    let root: HTMLElement

    beforeEach(() => {
        vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue({
            length: 1
        } as unknown as DOMRectList)
    })

    afterEach(() => {
        detach?.()
        root?.remove()
        vi.restoreAllMocks()
    })

    it('marks the menu and its items with menu roles', () => {
        root = createMenu(2)
        detach = attachMenuKeyboardNav(root)
        expect(root.getAttribute('role')).toBe('menu')
        press(root, 'ArrowDown')
        const items = root.querySelectorAll('.dl-list-item')
        expect(items[0].getAttribute('role')).toBe('menuitem')
        expect(items[0].getAttribute('tabindex')).toBe('-1')
    })

    it('moves focus between items with arrows, Home and End', () => {
        root = createMenu(3)
        detach = attachMenuKeyboardNav(root)
        const items = root.querySelectorAll<HTMLElement>('.dl-list-item')

        press(root, 'ArrowDown')
        expect(document.activeElement).toBe(items[0])
        press(items[0], 'ArrowDown')
        expect(document.activeElement).toBe(items[1])
        press(items[1], 'End')
        expect(document.activeElement).toBe(items[2])
        press(items[2], 'ArrowDown')
        expect(document.activeElement).toBe(items[0])
        press(items[0], 'ArrowUp')
        expect(document.activeElement).toBe(items[2])
        press(items[2], 'Home')
        expect(document.activeElement).toBe(items[0])
    })

    it('skips items that are not clickable', () => {
        root = createMenu(3)
        const items = root.querySelectorAll<HTMLElement>('.dl-list-item')
        items[1].style.removeProperty('--dl-list-item-cursor')
        detach = attachMenuKeyboardNav(root)

        press(root, 'ArrowDown')
        press(items[0], 'ArrowDown')
        expect(document.activeElement).toBe(items[2])
    })

    it('activates the focused item with Enter', () => {
        root = createMenu(1)
        detach = attachMenuKeyboardNav(root)
        const item = root.querySelector<HTMLElement>('.dl-list-item')
        const onClick = vi.fn()
        item.addEventListener('click', onClick)

        press(root, 'ArrowDown')
        const evt = press(item, 'Enter')
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(evt.defaultPrevented).toBe(true)
    })

    it('leaves keys of other focusable content alone', () => {
        root = createMenu(2, '<button id="other">other</button>')
        detach = attachMenuKeyboardNav(root)
        const other = root.querySelector<HTMLElement>('#other')
        other.focus()

        const arrow = press(other, 'ArrowDown')
        const tab = press(other, 'Tab')
        expect(arrow.defaultPrevented).toBe(false)
        expect(tab.defaultPrevented).toBe(false)
        expect(document.activeElement).toBe(other)
    })

    it('ignores keys typed in text fields', () => {
        root = createMenu(2, '<input id="search" type="text" />')
        detach = attachMenuKeyboardNav(root)
        const input = root.querySelector<HTMLElement>('#search')
        input.focus()

        expect(press(input, 'ArrowDown').defaultPrevented).toBe(false)
        expect(document.activeElement).toBe(input)
    })

    it('does nothing in a menu without items', () => {
        root = createMenu(0)
        detach = attachMenuKeyboardNav(root)

        expect(press(root, 'ArrowDown').defaultPrevented).toBe(false)
    })

    it('stops handling keys once detached', () => {
        root = createMenu(2)
        detach = attachMenuKeyboardNav(root)
        detach()

        expect(press(root, 'ArrowDown').defaultPrevented).toBe(false)
    })

    it('focuses the first item when opened from the keyboard', async () => {
        root = createMenu(2)
        root.remove()
        // a keydown marks the interaction as keyboard driven
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }))
        document.body.appendChild(root)
        detach = attachMenuKeyboardNav(root)

        await waitNextFrame()
        expect(document.activeElement).toBe(root.querySelector('.dl-list-item'))
    })

    it('does not move focus when opened with the mouse', async () => {
        root = createMenu(2)
        window.dispatchEvent(new MouseEvent('pointerdown'))
        detach = attachMenuKeyboardNav(root)

        await waitNextFrame()
        expect(document.activeElement).toBe(document.body)
    })
})
