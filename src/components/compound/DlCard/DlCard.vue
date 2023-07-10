<template>
    <div
        class="card"
        :style="cardStyles"
        @mouseover="onCardMouseover"
        @mouseleave="onCardMouseleave"
        @click="onCardClick"
    >
        <div
            v-if="icon && !isEmpty"
            class="card--icon"
        >
            <dl-icon
                :icon="icon.icon"
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
                    :href="imageLink"
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
                    ref="imageEl"
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
import { computed, defineComponent, PropType, ref, toRefs } from 'vue-demi'
import { getColor, stringStyleToRecord } from '../../../utils'
import { DlEmptyStateProps } from '../../basic/types'
import { DlTooltip } from '../../shared'
import { DlIcon, DlLink, DlTypography, DlEllipsis } from '../../essential'
import { DlChip, DlEmptyState } from '../../basic'
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
    setup(props, { emit }) {
        const imageEl = ref<HTMLImageElement>(null as any)
        const imageHolder = ref<HTMLDivElement>(null as any)
        const magnifyingGlass = ref<HTMLDivElement>(null as any)
        const imagePreview = ref<HTMLDivElement>(null as any)

        const {
            icon,
            image,
            indicatorColor,
            interactive,
            width,
            styles,
            cardId,
            zoom,
            height
        } = toRefs(props)
        const hasMagnifyingGlass = ref(false)
        const showImagePreview = ref(false)
        const previewOffset = ref({ x: 0, y: 0 })
        const dlCardBorder = ref('1px solid var(--dl-color-separator)')
        const dlCardBorderBottom = ref('1px solid var(--dl-color-separator)')
        const boxShadow = ref('0px 5px 15px 0px var(--dl-color-shadow)')
        const isCardActive = ref(false)

        const iconStyles = computed(() => {
            return icon.value?.styles ?? ''
        })
        const iconSize = computed(() => {
            return icon.value?.size ?? '50px'
        })
        const iconColor = computed(() => {
            return icon.value.color ?? 'var(--dl-color-darker)'
        })
        const hasImageLink = computed(() => {
            return !!(image.value?.link?.icon && image.value?.link?.href)
        })
        const cssVars = computed(() => {
            return {
                '--dl-card-colored-strip': indicatorColor.value
                    ? `4px solid ${getColor(
                          indicatorColor.value,
                          'dl-color-separator'
                      )}`
                    : dlCardBorderBottom.value,
                '--dl-card-border': dlCardBorder.value,
                '--dl-card-box-shadow': boxShadow.value,
                '--dl-card-content-padding': interactive.value
                    ? `10px 10px ${indicatorColor.value ? '16px' : '20px'} 10px`
                    : '16px',
                '--dl-card-link-icon-circle-size': image.value?.link?.size
                    ? parseInt(image.value?.link?.size) + 8 + 'px'
                    : '20px',
                '--dl-card-link-icon-circle-color': image.value?.link
                    ?.backgroundColor
                    ? image.value?.link?.backgroundColor
                    : 'rgba(255, 255, 255, 0.8)',
                '--dl-card-width': interactive.value ? '180px' : width,
                '--dl-card-image-width': interactive.value ? '180px' : '200px',
                '--dl-card-image-height': interactive.value ? '112px' : '100px'
            }
        })
        const computedStyles = computed<Record<string, string>>(() => {
            return isString(styles.value)
                ? stringStyleToRecord(styles.value)
                : styles.value
        })
        const cardStyles = computed<Record<string, any>>(() => {
            return Object.assign(
                { height: height.value },
                cssVars.value,
                computedStyles.value
            )
        })
        const imageStyles = computed<any>(() => {
            return image.value?.styles ?? ''
        })
        const imageAlt = computed(() => {
            return image.value?.alt ?? ''
        })
        const tooltipPreviewStyles = computed(() => {
            return {
                border: '1px solid var(--dl-color-separator)',
                'border-radius': '2px',
                'box-shadow': '0px 3px 6px var(--dl-color-separator)'
            }
        })
        const imageLink = computed(() => {
            return image.value?.link?.href ?? ''
        })

        const onImageLoad = () => {
            if (!imageEl.value) {
                return
            }
            imageEl.value.setAttribute(
                'style',
                `height: ${imageHolder.value.clientHeight}px; width: ${imageHolder.value.clientWidth}px; object-fit: cover;`
            )
        }
        const onCardMouseover = () => {
            if (!interactive.value) {
                return
            }
            dlCardBorder.value = '1px solid var(--dl-color-hover)'
            dlCardBorderBottom.value = dlCardBorder.value
        }
        const onCardMouseleave = () => {
            if (!interactive.value) {
                return
            }
            dlCardBorder.value = isCardActive.value
                ? '1px solid var(--dl-color-secondary)'
                : '1px solid var(--dl-color-separator)'
            dlCardBorderBottom.value = dlCardBorder.value
        }
        const onCardClick = () => {
            if (!interactive.value) {
                return
            }
            isCardActive.value = !isCardActive.value
            dlCardBorder.value = isCardActive.value
                ? '1px solid var(--dl-color-secondary)'
                : '1px solid var(--dl-color-separator)'
            dlCardBorderBottom.value = dlCardBorder.value
            if (isCardActive.value) {
                emit('onCardActive', {
                    cardId: cardId.value
                })
            }
        }
        const showMagnifier = () => {
            if (!zoom.value) return
            hasMagnifyingGlass.value = true
        }
        const hideMagnifier = () => {
            if (!zoom.value) return
            hasMagnifyingGlass.value = false
        }
        const getCursorPos = (event: MouseEvent) => {
            if (!zoom.value) return
            const rect = imageEl.value.getBoundingClientRect()

            let x = event.clientX - rect.left
            let y = event.clientY - rect.top

            x = x - window.scrollX
            y = y - window.scrollY

            return { x, y }
        }
        const movePreview = (event: MouseEvent) => {
            if (!zoom.value) return
            const rect = imageEl.value.getBoundingClientRect()

            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            previewOffset.value = { x, y }
        }
        const moveMagnifier = (event: MouseEvent) => {
            if (!zoom.value) return
            const pos = getCursorPos(event)!

            if (!magnifyingGlass.value?.offsetWidth) return

            let x = pos.x - magnifyingGlass.value?.offsetWidth / 2
            let y = pos.y - magnifyingGlass.value?.offsetHeight / 2

            if (
                x >
                (imageEl.value as HTMLElement).clientWidth -
                    magnifyingGlass.value.offsetWidth
            ) {
                x =
                    imageEl.value.clientWidth -
                    magnifyingGlass.value.offsetWidth
            }
            if (x < 0) {
                x = 0
            }
            if (
                y >
                imageEl.value.clientHeight - magnifyingGlass.value.offsetHeight
            ) {
                y =
                    imageEl.value.clientHeight -
                    magnifyingGlass.value.offsetHeight
            }
            if (y < 0) {
                y = 0
            }

            magnifyingGlass.value.style.display = 'block'
            magnifyingGlass.value.style.left = x + 'px'
            magnifyingGlass.value.style.top = y + 'px'
            magnifyingGlass.value.style.backgroundPosition =
                '-' + x * 2 + 'px -' + y * 2 + 'px'

            if (!imagePreview.value?.clientWidth) return

            const previewWidth = imagePreview.value.clientWidth
            const scaleValue = 460 / previewWidth

            imagePreview.value.style.transform = 'scale(' + scaleValue + ')'
            imagePreview.value.style.top = -(1 * y) + 'px'
            imagePreview.value.style.left = -(2.5 * x) + 'px'
        }
        const updateDescription = (value: string) => {
            emit('onUpdateDescription', {
                cardId: cardId.value,
                description: value
            })
        }
        const stopPropagationEvent: any = (event: MouseEvent) => {
            event.stopPropagation()
        }

        return {
            imageEl,
            imageHolder,
            magnifyingGlass,
            imagePreview,
            hasMagnifyingGlass,
            showImagePreview,
            previewOffset,
            dlCardBorder,
            dlCardBorderBottom,
            boxShadow,
            isCardActive,
            iconStyles,
            cardStyles,
            iconSize,
            iconColor,
            imageLink,
            hasImageLink,
            cssVars,
            computedStyles,
            imageStyles,
            imageAlt,
            tooltipPreviewStyles,
            onImageLoad,
            onCardMouseover,
            onCardMouseleave,
            onCardClick,
            showMagnifier,
            hideMagnifier,
            getCursorPos,
            movePreview,
            moveMagnifier,
            updateDescription,
            stopPropagationEvent
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
