<template>
    <div
        class="dl-layout-drawer"
        :style="cssVars"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div style="height: 100%; position: relative">
            <div
                v-if="hasBorderToggleButton"
                class="dl-layout-drawer__border-icon"
            >
                <dl-icon
                    :icon="expandEdgeIcon"
                    size="25px"
                    class="dl-layout-drawer__border-icon__expand-icon"
                    :class="{ expanded: !isExpanded }"
                    @click="toggleExpandDrawer"
                />
            </div>
            <div
                v-if="hasToggleButton"
                style="width: 100%; display: flex; justify-content: end"
            >
                <dl-button flat>
                    <dl-icon
                        :icon="expandIcon"
                        size="20px"
                        class="dl-layout-drawer__toggle__icon"
                        color="secondary"
                        :class="{ expanded: !isExpanded }"
                        @click="toggleExpandDrawer"
                    />
                    <dl-tooltip>Collapse</dl-tooltip>
                </dl-button>
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue-demi'
import DlIcon from '../../../components/essential/DlIcon/DlIcon.vue'
import DlButton from '../../../components/basic/DlButton/DlButton.vue'
import DlTooltip from '../../../components/essential/DlTooltip/DlTooltip.vue'

export default defineComponent({
    name: 'NavigationDrawer',
    components: {
        DlIcon,
        DlButton,
        DlTooltip
    },
    props: {
        widthLg: {
            type: String,
            default: '250px'
        },
        widthSm: {
            type: String,
            default: '50px'
        },
        position: {
            type: String,
            default: 'relative',
            validator: (val: string) => ['relative', 'absolute'].includes(val)
        },
        location: {
            type: String,
            default: 'left',
            validator: (val: string) => ['left', 'right'].includes(val)
        },
        expandDrawer: {
            type: Boolean
        },
        hasToggleButton: {
            type: Boolean,
            default: true
        },
        hasBorderToggleButton: {
            type: Boolean,
            default: false
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    emits: ['expand'],
    setup(props, context) {
        const isVisible = ref(true)
        const propsExpandDrawer = computed(() => props.expandDrawer)
        const isExpanded = ref(propsExpandDrawer.value)
        const drawerWidth = ref('')

        const onMouseEnter = () => {
            if (isExpanded.value) return
            drawerWidth.value = props.widthLg
            isVisible.value = true
        }
        const onMouseLeave = () => {
            if (isExpanded.value) return
            drawerWidth.value = props.widthSm
            isVisible.value = false
        }
        const expandEdgeIcon = computed(() =>
            props.location === 'left'
                ? 'icon-dl-left-chevron'
                : 'icon-dl-right-chevron'
        )
        const expandIcon = computed(() =>
            props.position === 'left' ? 'icon-dl-collapse' : 'icon-dl-expand'
        )
        const toggleExpandDrawer = () => {
            isExpanded.value = !isExpanded.value
            context.emit('expand', isExpanded.value)
        }

        onMounted(() => {
            drawerWidth.value = props.widthSm
        })
        watch(isExpanded, (value) => {
            isVisible.value = value
            drawerWidth.value = value ? props.widthLg : props.widthSm
        })

        watch(propsExpandDrawer, (value) => {
            isExpanded.value = value
        })

        const cssVars = computed(() => {
            return {
                '--dl-layout-drawer-width': isExpanded.value
                    ? props.widthLg
                    : props.widthSm,
                '--dl-layout-drawer-position': props.position,
                '--dl-layout-drawer-overflow': 'auto',
                '--dl-layout-drawer-location': props.location,
                '--dl-layout-drawer-margin-left':
                    props.location === 'right' ? 'auto' : null,
                '--dl-layout-drawer-height': props.height
            }
        })
        return {
            cssVars,
            onMouseEnter,
            drawerWidth,
            onMouseLeave,
            isVisible,
            expandIcon,
            expandEdgeIcon,
            isExpanded,
            toggleExpandDrawer
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-drawer {
    position: var(--dl-layout-drawer-position);
    width: var(--dl-layout-drawer-width);
    height: var(--dl-layout-drawer-height);
    overflow: var(--dl-layout-drawer-overflow);
    transition: all 300ms;
    box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.08);

    &__border-icon {
        position: absolute;
        top: 70px;
        left: -17px;
        cursor: pointer;
        color: var(--dl-color-lighter);
        text-align: right;
        margin-top: 8px;
        background-color: var(--dl-color-bg);
        border-radius: 50px;

        &__expand-icon {
            display: flex !important;
            transition: all 300ms;

            &.expanded {
                transform: rotate(180deg);
            }
        }
    }
    &__toggle {
        color: var(--dl-color-lighter);
        text-align: right;
        background-color: var(--dl-color-bg);

        &__icon {
            cursor: pointer;
            display: flex !important;
            transition: all 300ms;

            &.expanded {
                transform: rotate(180deg);
            }
        }
    }
}
</style>
