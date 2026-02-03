<template>
    <div
        v-if="!isSVG"
        :id="uuid"
        :style="[inlineStyles, computedStyles]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mousemove="$emit('mousemove', $event)"
    >
        <i
            class="dl-icon"
            :class="`${icon} ${externalIcon ? externalIconSource : ''}`"
            aria-hidden="true"
            role="presentation"
            :style="cssIconVars"
        >
            {{ externalIcon ? icon : null }}
        </i>
        <slot />
        <dl-tooltip v-if="tooltip">
            {{ tooltip }}
        </dl-tooltip>
    </div>
    <div
        v-else
        :id="uuid"
        :style="[inlineStyles, computedStyles]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mousemove="$emit('mousemove', $event)"
    >
        <div ref="svgIcon">
            <div ref="childToReplace" />
        </div>
    </div>
</template>

<script lang="ts">
import { isString } from 'lodash'
import { v4 } from 'uuid'
import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    useSlots,
    toRefs,
    watch
} from 'vue-demi'
import { getColor, loggerFactory, stringStyleToRecord } from '../../../utils'
import { COLORED_ICONS } from '@dataloop-ai/icons/types'
import { DlTooltip } from '../../shared'

export default defineComponent({
    name: 'DlIcon',
    components: {
        DlTooltip
    },
    props: {
        color: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '12px'
        },
        styles: {
            type: [String, Object],
            default: null
        },
        svg: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: true
        },
        svgSource: {
            type: String,
            default: null
        },
        tooltip: {
            type: String,
            default: null
        }
    },
    emits: ['click', 'mousemove', 'mouseup', 'mousedown'],
    setup(props) {
        const { styles, color, size, icon, svg, inline, svgSource, tooltip } =
            toRefs(props)

        const slots = useSlots()
        const svgIcon = ref(null)
        const isDestroyed = ref(false)
        const uuid = `dl-icon-${v4()}`
        const externalIconSource = 'material-icons'
        const logger = loggerFactory('dl-icon')
        const isHovered = ref(false)

        const hasDefaultSlot = computed<boolean>(() => {
            const slot = slots.default
            if (!slot) return false
            return slot().length > 0
        })

        const isInfoDefault = computed<boolean>(() => {
            return (
                icon.value === 'icon-dl-info' &&
                !color.value &&
                !hasDefaultSlot.value
            )
        })

        const effectiveColor = computed<string | null>(() => {
            if (isInfoDefault.value) {
                return isHovered.value ? 'dell-blue-600' : 'dell-blue-500'
            }
            return color.value
        })

        const computedStyles = computed<Record<string, string>>(() => {
            const generatedStyles = isString(styles.value)
                ? stringStyleToRecord(styles.value)
                : styles.value

            if (isSVG.value) {
                return Object.assign({}, generatedStyles, {
                    width: size.value,
                    height: size.value
                })
            }

            return generatedStyles
        })

        const cssIconVars = computed<Record<string, string>>(() => {
            return {
                '--dl-icon-font-size': `${size.value}`,
                '--dl-icon-color': effectiveColor.value
                    ? // todo: remove this. this is needed for now until the swap of DLBTN in OA
                      getColor(
                          effectiveColor.value === 'secondary'
                              ? 'q-color-secondary'
                              : effectiveColor.value,
                          'dell-gray-800'
                      )
                    : 'inherit'
            }
        })

        const cleanedIconName = computed<string>(() => {
            return icon.value.startsWith('icon-dl-')
                ? icon.value.replace('icon-dl-', '')
                : icon.value
        })

        const isSVG = computed<boolean>(() => {
            if (!icon.value) {
                return false
            }

            if (svg.value) {
                return true
            }

            const coloredIcons = Object.values(COLORED_ICONS)
            return coloredIcons.includes(cleanedIconName.value as any)
        })

        const externalIcon = computed<boolean>(() => {
            return (
                !icon.value.startsWith('icon-dl-') &&
                !icon.value.startsWith('fas') &&
                !icon.value.startsWith('fa-')
            )
        })

        const inlineStyles = computed<Record<string, string>>(() => {
            return { display: inline.value ? 'inline-flex' : 'flex' }
        })

        const onMouseEnter = () => {
            if (isInfoDefault.value) {
                isHovered.value = true
            }
        }

        const onMouseLeave = () => {
            if (isInfoDefault.value) {
                isHovered.value = false
            }
        }

        const loadSvg = () => {
            return new Promise<void>((resolve, reject) => {
                const loadedIcon = icon.value

                const svgElement = new Image()
                svgElement.setAttribute('height', size.value)
                svgElement.setAttribute('width', size.value)

                svgElement.onload = () => {
                    // In order to handle events and loading that occur mid unmounting.
                    if (isDestroyed.value || loadedIcon !== icon.value) {
                        return
                    }
                    const container = svgIcon.value as HTMLDivElement
                    if (!container) {
                        reject(new Error('No Ref'))
                        return
                    }
                    container.setAttribute('height', size.value)
                    container.setAttribute('width', size.value)
                    container?.firstChild?.replaceWith(svgElement)
                    resolve()
                }

                try {
                    let publicPath = ''
                    try {
                        publicPath = process.env.BASE_URL ?? ''
                    } catch (err) {
                        let urlPath = window.location.pathname ?? ''
                        urlPath = urlPath.endsWith('/')
                            ? urlPath.slice(0, -1)
                            : urlPath
                        publicPath = `${urlPath}/node_modules/@dataloop-ai`
                    }

                    if (publicPath.endsWith('/')) {
                        publicPath = publicPath.slice(0, -1)
                    }
                    svgElement.src = svgSource.value
                        ? `${svgSource.value}/${cleanedIconName.value}.svg`
                        : `${publicPath}/icons/assets/${cleanedIconName.value}.svg`
                } catch (e) {
                    reject(e)
                }
            })
        }

        watch(
            icon,
            () => {
                const possibleToLoadSvg =
                    isSVG.value && icon.value && icon.value !== ''
                if (possibleToLoadSvg) {
                    loadSvg()
                }
            },
            { immediate: true }
        )

        onUnmounted(() => {
            isDestroyed.value = true
        })

        return {
            uuid,
            svgIcon,
            externalIconSource,
            computedStyles,
            cssIconVars,
            isSVG,
            cleanedIconName,
            loadSvg,
            isDestroyed,
            externalIcon,
            inlineStyles,
            onMouseEnter,
            onMouseLeave
        }
    }
})
</script>

<style scoped lang="scss">
.dl-icon {
    display: inline-flex;
    color: var(--dl-icon-color);
    font-size: var(--dl-icon-font-size);
}
</style>
