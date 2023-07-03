<template>
    <div
        class="card"
        :style="[{ height }, computedStyles, cssVars]"
        @mouseover="onCardMouseover"
        @mouseleave="onCardMouseleave"
        @click="onCardClick"
    >
        <div
            v-if="icon && !isEmpty"
            class="card--icon"
        >
            <dl-icon
                :icon="icon.src"
                :styles="iconStyles"
                :size="iconSize"
                :color="iconColor"
            />
        </div>
        <div
            v-else-if="image && !isEmpty"
            class="card--image"
        >
            <div
                v-if="interactive && hasImageLink"
                class="card--image__link-icon"
                @click="stopPropagationEvent"
            >
                <DlLink
                    newtab
                    external
                    :href="image.link.href"
                >
                    <dl-icon
                        :icon="image.link.icon"
                        :size="image.link.size"
                        :color="image.link.color"
                    />
                </DlLink>
            </div>
            <figure
                ref="imageHolder"
                class="card--image__image-holder"
                @mousemove="moveMagnifier"
                @mouseleave="hideMagnifier"
                @mouseenter="showMagnifier"
            >
                <img
                    ref="image"
                    :src="image.src"
                    :style="imageStyles"
                    :alt="imageAlt"
                    class="card--image__image-holder__image"
                    :onload="onImageLoad"
                    @mousemove="movePreview"
                >
                <div
                    v-if="hasMagnifyingGlass"
                    ref="magnifyingGlass"
                    class="card--image__image-holder__magnifying-glass"
                />
            </figure>
            <dl-tooltip
                v-if="zoom"
                :delay="0"
                anchor="center right"
                self="center right"
                :offset="[300, 0]"
                max-height="280px"
                max-width="280px"
                background-color="var(--dl-color-panel-background)"
                :style="tooltipPreviewStyles"
            >
                <figure class="card--image__image-preview">
                    <img
                        ref="imagePreview"
                        :src="image.src"
                        :alt="imageAlt"
                        class="card--image__image-preview__image"
                    >
                </figure>
            </dl-tooltip>
        </div>
        <div
            v-if="!isEmpty"
            class="card--content"
        >
            <div>
                <slot name="header">
                    <div v-if="interactive">
                        <div class="card--content__interactive-title">
                            <div
                                class="full-width"
                                style="
                                    display: flex;
                                    justify-content: flex-start;
                                "
                            >
                                <dl-typography
                                    size="10px"
                                    color="dl-color-medium"
                                >
                                    {{ title }}
                                    ({{ tags ? tags.length : 0 }})
                                </dl-typography>
                            </div>
                            <div
                                class="card--content__interactive-title__icons"
                            >
                                <dl-icon
                                    v-for="(hint, index) in hints"
                                    :key="index"
                                    :icon="hint.icon"
                                    :color="hint.color"
                                    size="12px"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="card--header"
                    >
                        <span class="card--header_title">{{ title }}</span>
                    </div>
                </slot>
                <slot name="content">
                    <div v-if="interactive">
                        <div class="card--content__interactive-chips">
                            <dl-ellipsis
                                tooltip-position="top middle"
                                :tooltip-offset="[0, 25]"
                            >
                                <div>
                                    <div
                                        v-if="tags.length"
                                        class="card--content__interactive-chips__row"
                                    >
                                        <div
                                            v-for="(tag, index) in tags"
                                            :key="index"
                                            style="width: max-content"
                                        >
                                            <DlChip
                                                fit
                                                :label="tag.label"
                                                :color="tag.color"
                                                :text-color="tag.textColor"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        v-else
                                        style="
                                            display: flex;
                                            align-items: center;
                                            height: 23px;
                                        "
                                    >
                                        <dl-typography
                                            size="10px"
                                            color="dl-color-lighter"
                                        >
                                            No classes to display
                                        </dl-typography>
                                    </div>
                                </div>
                            </dl-ellipsis>
                        </div>
                    </div>
                    <span
                        v-else
                        class="card--content_text"
                    >{{ text }}</span>
                </slot>
            </div>
            <slot name="footer">
                <div v-if="interactive">
                    <div class="card__interactive-description">
                        <div class="flex full-width items-center">
                            <dl-typography
                                size="10px"
                                color="dl-color-medium"
                            >
                                Description
                            </dl-typography>
                        </div>
                        <div class="card__interactive-description__modal">
                            <description-modal
                                :description="description"
                                @onSubmit="updateDescription"
                            />
                        </div>
                    </div>
                    <div class="card__interactive-description__text">
                        <dl-ellipsis
                            v-if="description"
                            :text="description"
                        />
                        <dl-typography
                            v-else
                            size="12px"
                            color="dl-color-lighter"
                        >
                            No description
                        </dl-typography>
                    </div>
                </div>
                <div
                    v-else
                    class="card--links"
                >
                    <div
                        v-for="(link, idx) in links"
                        :key="idx"
                        class="card--links_linkItem"
                    >
                        <div class="card--links_linkItem_icon">
                            <dl-icon
                                v-if="link.icon"
                                :icon="link.icon"
                                size="12px"
                            />
                        </div>
                        <div class="card--links_linkItem_link">
                            <dl-link
                                :external="!!link.external"
                                :href="link.href"
                                :newtab="!!link.newtab"
                            >
                                {{ link.title }}
                            </dl-link>
                        </div>
                    </div>
                </div>
            </slot>
        </div>
        <dl-empty-state
            v-if="isEmpty"
            v-bind="emptyStateProps"
        >
            <template
                v-for="(_, slot) in $slots"
                #[slot]="props"
            >
                <slot
                    :name="slot"
                    v-bind="props"
                />
            </template>
        </dl-empty-state>
    </div>
</template>

<script lang="ts">
import { isString } from 'lodash'
import { defineComponent, PropType } from 'vue-demi'
import { getColor, stringStyleToRecord } from '../../../utils'
import { DlEmptyStateProps } from '../../basic/types'
import { DlIcon, DlLink, DlTypography, DlTooltip } from '../../essential'
import { DlChip, DlEllipsis, DlEmptyState } from '../../basic'
import {
    DlCardImageType,
    DlCardLinkType,
    DlCardTagType,
    DlCardHintType,
    DlCardIconType
} from './types'
import DescriptionModal from './components/DescriptionModal.vue'

export default defineComponent({
    name: 'DlCard',
    components: {
        DlLink,
        DlIcon,
        DlTooltip,
        DlChip,
        DlEllipsis,
        DescriptionModal,
        DlTypography,
        DlEmptyState
    },
    props: {
        image: {
            type: Object as PropType<DlCardImageType>,
            default: null
        },
        icon: {
            type: Object as PropType<DlCardIconType>,
            default: null
        },
        title: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        links: {
            type: Array as PropType<DlCardLinkType[]>,
            default: (): DlCardLinkType[] => []
        },
        height: {
            type: String,
            default: 'auto'
        },
        width: {
            type: String,
            default: '200px'
        },
        styles: {
            type: [Object, String],
            default: null
        },
        zoom: {
            type: Boolean,
            default: false
        },
        interactive: {
            type: Boolean,
            default: false
        },
        tags: {
            type: Array as PropType<DlCardTagType[]>,
            default: (): DlCardTagType[] => []
        },
        hints: {
            type: Array as PropType<DlCardHintType[]>,
            default: (): DlCardHintType[] => []
        },
        indicatorColor: {
            type: String,
            default: ''
        },
        cardId: {
            type: Number,
            default: null
        },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: null
        }
    },
    emits: ['onUpdateDescription', 'onCardActive'],
    data() {
        return {
            hasMagnifyingGlass: false,
            showImagePreview: false,
            previewOffset: { x: 0, y: 0 },
            dlCardBorder: '1px solid var(--dl-color-separator)',
            dlCardBorderBottom: '1px solid var(--dl-color-separator)',
            boxShadow: '0px 5px 15px 0px var(--dl-color-shadow)',
            isCardActive: false
        }
    },
    computed: {
        iconStyles(): string {
            return this.icon?.styles ?? ''
        },
        iconSize(): string {
            return this.icon?.size ?? '50px'
        },
        iconColor(): string {
            return this.icon?.color ?? 'var(--dl-color-darker)'
        },
        hasImageLink(): boolean {
            return !!(this.image?.link?.icon && this.image?.link?.href)
        },
        cssVars() {
            return {
                '--dl-card-colored-strip': this.indicatorColor
                    ? `4px solid ${getColor(
                          this.indicatorColor as string,
                          'dl-color-separator'
                      )}`
                    : this.dlCardBorderBottom,
                '--dl-card-border': this.dlCardBorder,
                '--dl-card-box-shadow': this.boxShadow,
                '--dl-card-content-padding': this.interactive
                    ? `10px 10px ${this.indicatorColor ? '16px' : '20px'} 10px`
                    : '16px',
                '--dl-card-link-icon-circle-size': this.image?.link?.size
                    ? parseInt(this.image?.link?.size) + 8 + 'px'
                    : '20px',
                '--dl-card-link-icon-circle-color': this.image?.link
                    ?.backgroundColor
                    ? this.image?.link?.backgroundColor
                    : 'rgba(255, 255, 255, 0.8)',
                '--dl-card-width': this.interactive ? '180px' : this.width,
                '--dl-card-image-width': this.interactive ? '180px' : '200px',
                '--dl-card-image-height': this.interactive ? '112px' : '100px'
            }
        },
        computedStyles(): Record<string, string> {
            return isString(this.styles)
                ? stringStyleToRecord(this.styles)
                : this.styles
        },
        imageStyles(): string {
            return this.image?.styles ?? ''
        },
        imageAlt(): string {
            return this.image?.alt ?? ''
        },
        tooltipPreviewStyles() {
            return {
                border: '1px solid var(--dl-color-separator)',
                'border-radius': '2px',
                'box-shadow': '0px 3px 6px var(--dl-color-separator)'
            }
        }
    },
    methods: {
        onImageLoad() {
            if (!this.$refs.image) {
                return
            }
            const holder = this.$refs.imageHolder as any
            ;(
                this.$refs.image as any
            ).style = `height: ${holder.clientHeight}px; width: ${holder.clientWidth}px; object-fit: cover;`
        },
        onCardMouseover() {
            if (!this.interactive) return
            this.dlCardBorder = '1px solid var(--dl-color-hover)'
            this.dlCardBorderBottom = this.dlCardBorder
        },
        onCardMouseleave() {
            if (!this.interactive) return
            this.dlCardBorder = this.isCardActive
                ? '1px solid var(--dl-color-secondary)'
                : '1px solid var(--dl-color-separator)'
            this.dlCardBorderBottom = this.dlCardBorder
        },
        onCardClick() {
            if (!this.interactive) return
            this.isCardActive = !this.isCardActive
            this.dlCardBorder = this.isCardActive
                ? '1px solid var(--dl-color-secondary)'
                : '1px solid var(--dl-color-separator)'
            this.dlCardBorderBottom = this.dlCardBorder
            if (this.isCardActive) {
                this.$emit('onCardActive', {
                    cardId: this.cardId
                })
            }
        },
        showMagnifier() {
            if (!this.zoom) return
            this.hasMagnifyingGlass = true
        },
        hideMagnifier() {
            if (!this.zoom) return
            this.hasMagnifyingGlass = false
        },
        getCursorPos(event: MouseEvent) {
            if (!this.zoom) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            let x = event.clientX - rect.left
            let y = event.clientY - rect.top

            x = x - window.pageXOffset
            y = y - window.pageYOffset

            return { x, y }
        },
        movePreview(event: MouseEvent) {
            if (!this.zoom) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            this.previewOffset = { x, y }
        },
        moveMagnifier(event: MouseEvent) {
            if (!this.zoom) return
            const holder = this.$refs.imageHolder as HTMLElement
            const glass = this.$refs.magnifyingGlass as HTMLElement
            const image = this.$refs.image as HTMLElement
            const imagePreview = this.$refs.imagePreview as HTMLElement

            const pos = this.getCursorPos(event)

            if (!glass?.offsetWidth) return

            let x = pos.x - glass?.offsetWidth / 2
            let y = pos.y - glass?.offsetHeight / 2

            if (x > (image as HTMLElement).clientWidth - glass.offsetWidth) {
                x = image.clientWidth - glass.offsetWidth
            }
            if (x < 0) {
                x = 0
            }
            if (y > image.clientHeight - glass.offsetHeight) {
                y = image.clientHeight - glass.offsetHeight
            }
            if (y < 0) {
                y = 0
            }

            glass.style.display = 'block'
            glass.style.left = x + 'px'
            glass.style.top = y + 'px'
            glass.style.backgroundPosition = '-' + x * 2 + 'px -' + y * 2 + 'px'

            if (!imagePreview?.clientWidth) return

            const previewWidth = imagePreview.clientWidth
            const scaleValue = 460 / previewWidth

            imagePreview.style.transform = 'scale(' + scaleValue + ')'
            imagePreview.style.top = -(1 * y) + 'px'
            imagePreview.style.left = -(2.5 * x) + 'px'
        },
        updateDescription(value: string) {
            this.$emit('onUpdateDescription', {
                cardId: this.cardId,
                description: value
            })
        },
        stopPropagationEvent(event: MouseEvent) {
            event.stopPropagation()
        }
    }
})
</script>

<style lang="scss" scoped>
.card {
    color: var(--dl-color-darker);
    background-color: var(--dl-color-panel-background);
    border: var(--dl-card-border);
    border-radius: 2px;
    pointer-events: auto;
    box-shadow: var(--dl-card-box-shadow);
    border-bottom: var(--dl-card-colored-strip);
    width: var(--dl-card-width);

    &--content {
        padding: var(--dl-card-content-padding);
        &_text {
            font-size: 12px;
            color: var(--dl-color-medium);
        }

        &__interactive-title {
            display: flex;
            width: 100%;
            font-size: 10px;

            &__icons {
                display: flex;
                width: 80%;
                justify-content: right;
                gap: 10px;
            }
        }
        &__interactive-chips {
            margin-top: 10px;

            &__row {
                display: flex;
                width: 100%;
                gap: 5px;
            }
        }
    }

    &--header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        &_title {
            color: var(--dl-color-darker);
            font-size: 14px;
            line-height: 16px;
            font-weight: 700;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        &_shortcut {
            color: #767676;
            font-size: 10px;
            line-height: 10px;
            border-radius: 2px;
            border: 1px solid #767676;
            padding: 4px;
            text-align: center;
            margin-bottom: 10px;
        }
    }
    &--links {
        margin-top: 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        &_linkItem {
            margin-right: 15px;
            color: var(--dl-color-secondary);
            font-size: 10px;
            display: flex;
            align-items: center;

            &_icon {
                margin-right: 7px;
                margin-top: 2px;
                vertical-align: middle;
            }

            &_link {
                vertical-align: middle;
            }
        }
    }
    &--image {
        width: var(--dl-card-image-width);
        height: var(--dl-card-image-height);
        position: relative;
        overflow: hidden;

        &__link-icon {
            position: absolute;
            display: flex;
            top: 5px;
            right: 5px;
            z-index: 1;
            cursor: pointer;
            width: var(--dl-card-link-icon-circle-size);
            height: var(--dl-card-link-icon-circle-size);
            align-items: center;
            border-radius: 50%;
            justify-content: center;
            background: var(--dl-card-link-icon-circle-color);
        }

        img {
            width: 100%;
        }

        &__image-holder {
            position: relative;
            width: 100%;
            margin: 0 auto;
            text-align: center;

            img {
                height: auto;
                object-fit: cover;
                object-position: center top;
            }

            &__image {
            }

            &__magnifying-glass {
                position: absolute;
                width: 112px;
                height: 112px;
                border: 1px black;
                top: 0;
                /*left: 20%;*/
                /*right: 10%;*/
                background: #ffffff;
                opacity: 0.7;
                cursor: zoom-in;
            }
        }

        &__image-preview {
            height: 280px;
            width: 280px;
            margin: 0;
            padding: 0;
            overflow: hidden;

            img {
                position: absolute;
                top: 0;
                left: 0;
                transform: scale(2);
                transform-origin: left top;
            }
        }
    }
    &--icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 34px;
        padding-bottom: 16px;
        color: var(--dl-color-darker);
    }

    &__interactive-description {
        display: flex;
        width: 100%;
        font-size: 10px;
        padding-top: 16px;

        &__modal {
            display: flex;
            width: 100%;
            justify-content: right;
            gap: 5px;
        }
        &__text {
            font-size: 12px;
            margin-top: 6px;
            white-space: nowrap;
        }
    }
}
</style>
