<template>
    <div
        :id="uuid"
        ref="dlEtaRef"
        :style="cssVars"
        :class="[{ 'empty-state': true }, `empty-state--${align}`]"
    >
        <dl-icon
            :class="iconClassName"
            :color="iconColor"
            :size="iconFontSize + 'px'"
            :icon="icon"
        />

        <dl-typography
            v-if="title"
            bold
            :size="titleSize + 'px'"
            :color="titleColor"
            :class="titleClassName"
        >
            {{ title }}
        </dl-typography>

        <dl-typography
            v-if="subtitle"
            :size="subtitleFonSize + 'px'"
            :color="subtitleColor"
            :class="subtitleClassName"
        >
            {{ subtitle }}
        </dl-typography>

        <div
            v-if="hasCTASlot"
            class="empty-state--cta"
        >
            <slot name="cta" />
        </div>

        <dl-typography
            v-if="info"
            :size="infoFontSize + 'px'"
            :color="infoColor"
            class="empty-state--info"
        >
            {{ info }}
        </dl-typography>

        <div
            v-if="hasLinkSlot"
            class="empty-state--links"
        >
            <slot name="links" />
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { DlIcon, DlTypography } from '../../essential'
import { useSizeObserver } from '../../../hooks/use-size-observer'
import { defineComponent, computed, ref } from 'vue-demi'

export default defineComponent({
    name: 'DlEmptyState',
    components: {
        DlIcon,
        DlTypography
    },
    props: {
        bgImage: {
            type: String,
            default: null
        },
        bgSize: {
            type: String,
            default: '240px'
        },
        title: {
            type: String,
            default: 'Something Went Wrong'
        },
        titleColor: {
            type: String,
            default: 'dl-color-darker'
        },
        titleClass: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
        subtitleColor: {
            type: String,
            default: 'dl-color-medium'
        },
        subtitleClass: {
            type: String,
            default: ''
        },
        info: {
            type: String,
            default: ''
        },
        infoColor: {
            type: String,
            default: 'dl-color-darker'
        },
        infoClass: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'icon-dl-alert-filled'
        },
        iconSize: {
            type: String,
            default: '40px'
        },
        iconColor: {
            type: String,
            default: 'dl-color-darker'
        },
        iconClass: {
            type: String,
            default: ''
        },
        responsive: Boolean,
        align: {
            type: String,
            default: 'center'
        }
    },
    setup(props, { slots }) {
        const uuid = ref(`dl-empty-state-${v4()}`)

        const dlEtaRef = ref(null)

        const { widthRef, heightRef } = useSizeObserver(dlEtaRef)

        const metric = computed(() => {
            return widthRef.value > heightRef.value
                ? widthRef.value
                : heightRef.value
        })

        const fontSize = (value: number) => metric.value * (value / 365)

        const titleSize = computed(() => (props.responsive ? fontSize(18) : 20))

        const infoFontSize = computed(() =>
            props.responsive ? fontSize(12) : 14
        )

        const iconFontSize = computed(() =>
            props.responsive ? fontSize(26) : parseInt(props.iconSize)
        )

        const subtitleFonSize = computed(() =>
            props.responsive ? fontSize(14) : 14
        )

        const bgImageSize = computed(() =>
            props.responsive
                ? fontSize(parseInt(props.bgSize)) + 'px'
                : props.bgSize
        )

        const hasCTASlot = !!slots['cta']

        const hasLinkSlot = !!slots['links']

        const iconClassName = computed(() => {
            let classname = 'empty-state--icon'

            if (props.iconClass) {
                classname = classname + ' ' + props.iconClass
            }

            return classname
        })

        const titleClassName = computed(() => {
            let classname = 'empty-state--title'

            if (props.titleClass) {
                classname = classname + ' ' + props.titleClass
            }

            return classname
        })

        const subtitleClassName = computed(() => {
            let classname = 'empty-state--subtitle'

            if (props.subtitleClass) {
                classname = classname + ' ' + props.subtitleClass
            }

            return classname
        })

        const infoClassName = computed(() => {
            let classname = 'empty-state--info'

            if (props.infoClass) {
                classname = classname + ' ' + props.infoClass
            }

            return classname
        })

        const cssVars = computed(() => {
            return {
                '--bg-image': props.bgImage,
                '--bg-size': bgImageSize.value
            }
        })

        return {
            uuid,
            cssVars,
            iconClassName,
            titleClassName,
            infoClassName,
            subtitleClassName,
            hasCTASlot,
            hasLinkSlot,
            dlEtaRef,
            titleSize,
            subtitleFonSize,
            infoFontSize,
            iconFontSize
        }
    }
})
</script>

<style scoped lang="scss">
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: 50% 50%;

    background-image: var(--bg-image);
    background-size: var(--bg-size);

    &--title {
        line-height: 24px;
        margin-bottom: 2px;
    }

    &--subtitle,
    &--cta,
    &--links,
    &--info {
        margin-bottom: 20px;
    }

    &--nowrap {
        white-space: nowrap;
    }

    &--icon {
        margin-bottom: 10px;
    }

    &--center,
    &--left {
        display: flex;
        width: 100%;
    }

    &--center {
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    &--left {
        align-items: flex-start;
        text-align: start;
    }
}
</style>
