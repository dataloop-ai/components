<template>
    <div class="dl-layout-navbar">
        <ul>
            <li>
                <a
                    href="#home"
                    @click="toggleLeftSideBar"
                >
                    <dl-icon
                        icon="icon-dl-hamburger-menu"
                        size="20px"
                    />
                </a>
            </li>
            <li
                v-for="(leftItem, leftItemIndex) in leftItems"
                :key="leftItemIndex"
            >
                <a>
                    <dl-select
                        without-borders
                        has-prepend
                        size="l"
                        :placeholder="leftItem.title"
                        :options="leftItem.options"
                        @change="getSelectedItem"
                    >
                        <template
                            v-if="leftItem.icon"
                            #prepend
                        >
                            <dl-icon
                                size="12px"
                                :icon="leftItem.icon"
                            />
                        </template>
                    </dl-select>
                </a>
            </li>
        </ul>
        <div class="dl-layout-navbar__navbar-center-content">
            <slot name="center-content" />
        </div>
        <div class="dl-layout-navbar__navbar-right-content">
            <div>
                <slot name="right-content" />
            </div>
            <dl-avatar
                tooltip="popcat@gmail.com"
                size="25px"
            >
                <img src="https://popcat.click/twitter-card.jpg">
            </dl-avatar>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'
import DlSelect from '../../../compound/DlSelect/DlSelect.vue'
import DlAvatar from '../../../basic/DlAvatar/DlAvatar.vue'
import { HorizontalItems } from '../types/HorizontalItems'

export default defineComponent({
    name: 'DlLayoutNavbar',
    components: {
        DlIcon,
        DlSelect,
        DlAvatar
    },
    props: {
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    height: 50px;
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.08);
    text-align: center;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;

    .active {
        background-color: var(--dl-color-fill);
    }

    ul {
        display: flex;
        width: 100%;
        align-items: center;
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--dl-color-bg);
        gap: 10px;

        li {
            float: left;

            a {
                display: block;
                color: var(--dl-color-darker);
                text-align: center;
                text-decoration: none;
            }
            a:hover:not(.active) {
                background-color: var(--dl-color-fill);
            }
        }
    }
    &__navbar-center-content {
        width: 100%;
        margin: 0 auto;
    }
    &__navbar-right-content {
        display: flex;
        justify-content: right;
        align-items: center;
    }
}
</style>
