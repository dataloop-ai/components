import { describe, it, expect, afterEach, vi } from 'vitest'
import {
    leftClick,
    position,
    stopAndPrevent,
    stop,
    prevent,
    addEvt,
    cleanEvt
} from '../../src/utils'

describe('events utils', () => {
    describe('stopAndPrevent', () => {
        const event: Partial<Event> = {
            cancelable: true,
            preventDefault: vi.fn().mockImplementation(() => {}),
            stopPropagation: vi.fn().mockImplementation(() => {})
        }

        describe('when event is cancelable', () => {
            it('should call the preventDefault and stopPropagation methods', () => {
                stopAndPrevent(event as Event)
                expect(event.preventDefault).toHaveBeenCalled()
                expect(event.stopPropagation).toHaveBeenCalled()
            })
        })

        describe('otherwise', () => {
            const event: Partial<Event> = {
                cancelable: false,
                preventDefault: vi.fn().mockImplementation(() => {}),
                stopPropagation: vi.fn().mockImplementation(() => {})
            }
            it('should call only the stopPropagation method', () => {
                stopAndPrevent(event as Event)
                expect(event.preventDefault).not.toHaveBeenCalled()
                expect(event.stopPropagation).toHaveBeenCalled()
            })
        })
    })

    describe('position', () => {
        describe('when event has "touches" array property & it is not empty', () => {
            const e = {
                touches: [
                    {
                        clientX: 1,
                        clientY: 2
                    }
                ],
                changedTouches: [
                    {
                        clientX: 3,
                        clientY: 4
                    }
                ],
                targetTouches: [
                    {
                        clientX: 5,
                        clientY: 6
                    }
                ]
            }
            it('should set event to the first element of "touches" array', () => {
                const p = position(e)
                expect(p.top).toBe(2)
                expect(p.left).toBe(1)
            })
        })

        describe('otherwise, when event has "changedTouches" array property & it is not empty', () => {
            const e = {
                changedTouches: [
                    {
                        clientX: 3,
                        clientY: 4
                    }
                ],
                targetTouches: [
                    {
                        clientX: 5,
                        clientY: 6
                    }
                ]
            }
            it('should set event to the first element of "changedTouches" array', () => {
                const p = position(e)
                expect(p.top).toBe(4)
                expect(p.left).toBe(3)
            })
        })

        describe('otherwise, when event has "targetTouches" array property & it is not empty', () => {
            it('should set event to the first element of "targetTouches" array', () => {
                const e = {
                    targetTouches: [
                        {
                            clientX: 5,
                            clientY: 6
                        }
                    ]
                }

                const p = position(e)
                expect(p.top).toBe(6)
                expect(p.left).toBe(5)
            })
        })
    })

    describe('leftClick', () => {
        describe('when left click is pressed', () => {
            const e: Partial<MouseEvent> = {
                button: 0
            }

            it('should return true', () => {
                const result = leftClick(e as MouseEvent)
                expect(result).toBe(true)
            })
        })

        describe('otherwise', () => {
            const e: Partial<MouseEvent> = {
                button: 1
            }

            it('should return false', () => {
                const result = leftClick(e as MouseEvent)
                expect(result).toBe(false)
            })
        })
    })

    describe('stop', () => {
        const e: Partial<Event> = {
            stopPropagation: vi.fn().mockImplementation(() => {})
        }

        it('should call the "stopPropagation" method', () => {
            stop(e as Event)
            expect(e.stopPropagation).toHaveBeenCalled()
        })
    })

    describe('prevent', () => {
        describe('when "cancelable" is true', () => {
            const e: Partial<Event> = {
                cancelable: true,
                preventDefault: vi.fn().mockImplementation(() => {})
            }

            it('should call the "preventDefault" method', () => {
                prevent(e as Event)
                expect(e.preventDefault).toHaveBeenCalled()
            })
        })

        describe('otherwise', () => {
            const e: Partial<Event> = {
                cancelable: false,
                preventDefault: vi.fn().mockImplementation(() => {})
            }

            it('should do nothing', () => {
                prevent(e as Event)
                expect(e.preventDefault).not.toHaveBeenCalled()
            })
        })
    })

    describe('addEvt', () => {
        const div = document.createElement('div')

        const spy = vi.spyOn(div, 'addEventListener')

        const evt = [[div, 'mousemove', 'move', 'passiveCapture']]

        describe('when the context "name" property is set', () => {
            const ctx = {
                name: '_dl_test_evt',
                mousemove: vi.fn().mockImplementation(() => {}),
                move: vi.fn().mockImplementation(() => {})
            }

            it('should attach the events to the context', () => {
                addEvt(ctx, 'test', evt)
                expect(spy).toHaveBeenCalled()
            })
        })

        describe('otherwise', () => {
            const ctx = {
                mousemove: vi.fn().mockImplementation(() => {}),
                move: vi.fn().mockImplementation(() => {})
            }
            it('should use the event from the params', () => {
                addEvt(ctx, 'test', evt)
                expect(spy).toHaveBeenCalled()
            })
        })
    })

    describe('cleanEvt', () => {
        const div = document.createElement('div')

        const spy = vi.spyOn(div, 'removeEventListener')

        afterEach(() => {
            spy.mockClear()
        })

        describe('when the context "name" property is set', () => {
            const ctx = {
                name: '__dl_test_evt',
                mousemove: vi.fn().mockImplementation(() => {}),
                move: vi.fn().mockImplementation(() => {}),
                ['__dl_test_evt']: [
                    [
                        div,
                        vi.fn().mockImplementation(() => {}),
                        vi.fn().mockImplementation(() => {})
                    ]
                ]
            }

            it('should remove the listeners', () => {
                cleanEvt(ctx, 'test')
                expect(spy).toHaveBeenCalled()
                expect(ctx['__dl_test_evt']).to.be.null
            })
        })

        describe('otherwise', () => {
            const ctx = {
                mousemove: vi.fn().mockImplementation(() => {}),
                move: vi.fn().mockImplementation(() => {})
            }
            it('should use the event from the params', () => {
                cleanEvt(ctx, 'test')
                expect(spy).not.toHaveBeenCalled()
            })
        })
    })
})
