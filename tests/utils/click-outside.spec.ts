import {
    addClickOutside,
    ClickOutsideProps,
    removeClickOutside
} from '../../src/utils/click-outside'
import { Ref } from 'vue-demi'

const event: Partial<ClickOutsideProps> | any = {
    onClickOutside: jest.fn(),
    innerRef: {
        value: {
            contains: () => jest.fn()
        }
    } as unknown as Ref<HTMLElement>,
    anchorEl: {
        value: {
            contains: () => jest.fn()
        }
    } as unknown as Ref<HTMLElement>
}

describe('click-outside utils', () => {
    describe('addClickOutside', () => {
        describe('should add event listener', () => {
            it('should return undefined', () => {
                expect(addClickOutside(event as ClickOutsideProps)).toBe(
                    undefined
                )
            })
        })
    })

    describe('removeClickOutside', () => {
        describe('should remove event listener', () => {
            it('should return undefined', () => {
                expect(removeClickOutside(event as ClickOutsideProps)).toBe(
                    undefined
                )
            })
        })
    })
})
