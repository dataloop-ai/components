<template>
    <div
        class="card"
        :style="[{ height }, computedStyles, cssVars]"
        @mouseover="onCardMouseover"
        @mouseleave="onCardMouseleave"
        @click="onCardClick"
    >
        <div
            v-if="icon"
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
            v-else-if="image"
            class="card--image"
        >
            <div
                v-if="shopify && iconLink?.icon"
                class="card--image__link-icon"
                @click="stopPropagationEvent"
            >
                <DlLink
                    newtab
                    external
                    :href="iconLink?.link"
                >
                    <dl-icon
                        :icon="iconLink?.icon"
                        :size="iconLink?.size"
                        :color="iconLink?.color"
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
                    @mousemove="movePreview"
                >
                <div
                    v-if="hasMagnifyingGlass"
                    ref="magnifyingGlass"
                    class="card--image__image-holder__magnifying-glass"
                />
            </figure>
            <dl-tooltip
                v-if="zoomMode"
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
        <div class="card--content">
            <div>
                <slot
                    v-if="!!$slots.header"
                    name="header"
                />
                <div v-else-if="shopify">
                    <div class="card--content__shopify-title">
                        <div class="full-width">
                            <dl-typography
                                size="10px"
                                color="dl-color-medium"
                            >
                                {{ shopifyTitle.label }} {{ shopifyCountLabel }}
                            </dl-typography>
                        </div>
                        <div class="card--content__shopify-title__icons">
                            <dl-icon
                                v-for="(
                                    classificationItem, classificationItemIndex
                                ) in innerIcons"
                                :key="classificationItemIndex"
                                :icon="classificationItem.icon"
                                :color="classificationItem.color"
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
                    <span class="card--header_shortcut">{{
                        keyboardShortcut
                    }}</span>
                </div>
                <slot
                    v-if="!!$slots.content"
                    name="content"
                />
                <div v-else-if="shopify">
                    <div class="card--content__shopify-chips">
                        <dl-ellipsis
                            tooltip-position="top middle"
                            :tooltip-offset="[0, 25]"
                        >
                            <div>
                                <div
                                    v-if="chipsItems.length"
                                    class="card--content__shopify-chips__row"
                                >
                                    <div
                                        v-for="(chip, chipIndex) in chipsItems"
                                        :key="chipIndex"
                                        style="width: max-content"
                                    >
                                        <DlChip
                                            fit
                                            :label="chip.label"
                                            :color="chip.color"
                                            :text-color="chip.textColor"
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
            </div>
            <slot
                v-if="!!$slots.footer"
                name="footer"
            />
            <div v-else-if="shopify">
                <div class="card__shopify-description">
                    <div class="flex full-width items-center">
                        <dl-typography
                            size="10px"
                            color="dl-color-medium"
                        >
                            Description
                        </dl-typography>
                    </div>
                    <div class="card__shopify-description__modal">
                        <description-modal
                            :description-value="shopifyDescription"
                            @onSubmit="updateDescription"
                        />
                    </div>
                </div>
                <div class="card__shopify-description__text">
                    <dl-ellipsis
                        v-if="shopifyDescription"
                        :text="shopifyDescription"
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
        </div>
    </div>
</template>

<script lang="ts">
import { isString } from 'lodash'
import { defineComponent, PropType } from 'vue-demi'
import { getColor, stringStyleToRecord } from '../../../utils'
import { DlIcon } from '../../essential/DlIcon'
import { DlLink } from '../../essential/DlLink'
import { DlChip, DlEllipsis } from '../../../components'
import {
    IconItem,
    ImageItem,
    LinkItem,
    IconLink,
    ChipsItemsType,
    InnerIconsType,
    ShopifyTitleType
} from './types'
import DlTooltip from '../../essential/DlTooltip/DlTooltip.vue'
import DescriptionModal from './components/DescriptionModal.vue'
import DlTypography from '../../essential/DlTypography/DlTypography.vue'

export default defineComponent({
    name: 'DlCard',
    components: {
        DlLink,
        DlIcon,
        DlTooltip,
        DlChip,
        DlEllipsis,
        DescriptionModal,
        DlTypography
    },
    props: {
        image: {
            type: Object as PropType<ImageItem>,
            default: null
        },
        icon: {
            type: Object as PropType<IconItem>,
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
        keyboardShortcut: {
            type: String,
            default: ''
        },
        links: {
            type: Array as PropType<LinkItem[]>,
            default: (): LinkItem[] => []
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
        zoomMode: {
            type: Boolean,
            default: false
        },
        iconLink: {
            type: Object as PropType<IconLink>,
            default: () => ({} as IconLink)
        },
        shopify: {
            type: Boolean,
            default: false
        },
        chipsItems: {
            type: Array as PropType<ChipsItemsType[]>,
            default: (): ChipsItemsType[] => []
        },
        innerIcons: {
            type: Array as PropType<InnerIconsType[]>,
            default: (): InnerIconsType[] => []
        },
        coloredStrip: {
            type: String,
            default: ''
        },
        shopifyTitle: {
            type: Object as PropType<ShopifyTitleType>,
            default: () => ({} as ShopifyTitleType)
        },
        shopifyDescription: {
            type: String,
            default: ''
        },
        cardId: {
            type: Number,
            default: null
        }
    },
    emits: ['onUpdateDescription', 'onCardActive'],
    data() {
        return {
            hasMagnifyingGlass: false,
            showImagePreview: false,
            previewOffset: { x: 0, y: 0 },
            shopifyDescriptionValue: '',
            dlCardBorder: '1px solid var(--dl-color-separator)',
            dlCardBorderBottom: '1px solid var(--dl-color-separator)',
            boxShadow: '0px 5px 15px 0px var(--dl-color-shadow)',
            isCardActive: false
        }
    },
    computed: {
        cssVars() {
            return {
                '--dl-card-colored-strip': this.coloredStrip
                    ? `4px solid ${getColor(
                          this.coloredStrip as string,
                          'dl-color-separator'
                      )}`
                    : this.dlCardBorderBottom,
                '--dl-card-border': this.dlCardBorder,
                '--dl-card-box-shadow': this.boxShadow,
                '--dl-card-content-padding': this.shopify
                    ? `10px 10px ${this.coloredStrip ? '16px' : '20px'} 10px`
                    : '16px',
                '--dl-card-link-icon-circle-size': this.iconLink?.circle?.size
                    ? this.iconLink?.circle?.size
                    : '20px',
                '--dl-card-link-icon-circle-color': this.iconLink?.circle?.color
                    ? this.iconLink?.circle?.color
                    : 'rgba(255, 255, 255, 0.8)',
                '--dl-card-width': this.shopify ? '180px' : this.width,
                '--dl-card-image-width': this.shopify ? '180px' : '200px',
                '--dl-card-image-height': this.shopify ? '112px' : '100px'
            }
        },
        computedStyles(): Record<string, string> {
            return isString(this.styles)
                ? stringStyleToRecord(this.styles)
                : this.styles
        },
        iconStyles(): string {
            return this.icon?.styles ?? ''
        },
        iconSize(): string {
            return this.icon?.size ?? '50px'
        },
        iconColor(): string {
            return this.icon?.color ?? 'var(--dl-color-darker)'
        },
        imageStyles(): string {
            return this.image?.styles ?? ''
        },
        imageAlt(): string {
            return this.image?.alt ?? ''
        },
        shopifyCountLabel(): string | null {
            return this.shopifyTitle?.count
                ? `(${this.shopifyTitle?.count})`
                : null
        },
        tooltipPreviewStyles() {
            return {
                border: '1px solid var(--dl-color-separator)',
                'border-radius': '2px',
                'box-shadow': '0px 3px 6px var(--dl-color-separator)'
            }
        }
    },
    mounted() {
        this.initDescriptionValue()
    },
    methods: {
        initDescriptionValue() {
            this.shopifyDescriptionValue = this.shopifyDescription
        },
        onCardMouseover() {
            if (!this.shopify) return
            this.dlCardBorder = '1px solid var(--dl-color-hover)'
            this.dlCardBorderBottom = this.dlCardBorder
        },
        onCardMouseleave() {
            if (!this.shopify) return
            this.dlCardBorder = this.isCardActive
                ? '1px solid var(--dl-color-secondary)'
                : '1px solid var(--dl-color-separator)'
            this.dlCardBorderBottom = this.dlCardBorder
        },
        onCardClick() {
            if (!this.shopify) return
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
            if (!this.zoomMode) return
            this.hasMagnifyingGlass = true
        },
        hideMagnifier() {
            if (!this.zoomMode) return
            this.hasMagnifyingGlass = false
        },
        getCursorPos(event: MouseEvent) {
            if (!this.zoomMode) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            let x = event.clientX - rect.left
            let y = event.clientY - rect.top

            x = x - window.pageXOffset
            y = y - window.pageYOffset

            return { x, y }
        },
        movePreview(event: MouseEvent) {
            if (!this.zoomMode) return
            const image = this.$refs.image as HTMLElement
            const rect = image.getBoundingClientRect()

            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            this.previewOffset = { x, y }
        },
        moveMagnifier(event: MouseEvent) {
            if (!this.zoomMode) return
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

        &__shopify-title {
            display: flex;
            width: 100%;
            font-size: 10px;

            &__icons {
                display: flex;
                width: 100%;
                justify-content: right;
                gap: 10px;
            }
        }
        &__shopify-chips {
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

    &__shopify-description {
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
