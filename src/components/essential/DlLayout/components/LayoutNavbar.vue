<template>
    <div class="dl-layout-navbar">
        <div v-if="hasToggle">
            <dl-button
                flat
                color="secondary"
                @click="toggleLeftSideBar"
            >
                <dl-icon
                    icon="icon-dl-hamburger-menu"
                    size="20px"
                />
            </dl-button>
        </div>
        <div style="width: 100%">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlButton from '../../../basic/DlButton/DlButton.vue'
import { HorizontalItems } from '../types/HorizontalItems'

export default defineComponent({
    name: 'DlLayoutNavbar',
    components: {
        DlIcon,
        DlButton
    },
    props: {
        hasToggle: {
            type: Boolean,
            default: true
        },
        leftItems: {
            type: Array as PropType<HorizontalItems[]>,
            default: () => [] as HorizontalItems[]
        },
        rightItems: {
            type: Array as PropType<HorizontalItems[]>,
            default: () => [] as HorizontalItems[]
        }
    },
    emits: ['toggle'],
    setup(props, context) {
        const isExpandedLeftSide = ref(true)
        const toggleLeftSideBar = () => {
            isExpandedLeftSide.value = !isExpandedLeftSide.value
            context.emit('toggle', isExpandedLeftSide.value)
        }
        const getSelectedItem = (item: any) => {}

        return {
            toggleLeftSideBar,
            getSelectedItem
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout-navbar {
    display: flex;
    width: 100%;
    height: 50px;
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
    align-items: center;
}
</style>
