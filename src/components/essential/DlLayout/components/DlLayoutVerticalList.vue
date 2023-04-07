<template>
    <ul>
        <li
            v-for="item in items"
            :key="item.id"
        >
            <a
                :class="{ active: item.id === activeItem }"
                :href="item.link"
                @click="triggerItem(item.id)"
            >
                <span>
                    <dl-icon
                        :icon="item.icon"
                        color="var(--dl-color-text-buttons)"
                        size="20px"
                    />
                </span>
                <div v-if="isVisible">
                    <dl-typography
                        variant="h3"
                        :size="item.fontSize"
                        color="dl-color-text-buttons"
                    >
                        {{ item.title }}
                    </dl-typography>
                    <dl-typography
                        variant="h3"
                        size="12px"
                        color="dl-color-text-buttons"
                        style="opacity: 0.5"
                    >
                        {{ item.subtitle }}
                    </dl-typography>
                </div>
                <div v-if="childrenCount(item)">
                    <dl-icon
                        class="expand-icon"
                        :class="{ expanded: expandedItem === item.id }"
                        icon="icon-dl-down-chevron"
                        color="var(--dl-color-text-buttons)"
                        size="20px"
                    />
                </div>
            </a>
            <div
                v-show="isVisible && expandedItem === item.id"
                style="padding-left: 10px"
            >
                <DlLayoutVerticalList :items="item.data" />
            </div>
            <div
                v-if="item.hasSeparator"
                class="horizontal-separator"
            />
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue-demi'
import { LayoutVerticalItems } from '../types/VerticalItems'
import { DlIcon } from '../../DlIcon'
import { DlTypography } from '../../DlTypography'

export default defineComponent({
    name: 'DlLayoutVerticalList',
    components: {
        DlIcon,
        DlTypography
    },
    props: {
        items: {
            type: Array as PropType<LayoutVerticalItems[]>,
            default: () => [] as LayoutVerticalItems[]
        },
        isVisible: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const childrenCount = (item: LayoutVerticalItems) => item?.data?.length
        const activeItem = ref<number | null>(null)
        const expandedItem = ref<number | null>(null)

        const triggerItem = (id: number) => {
            activeItem.value = id
            expandedItem.value = expandedItem.value === id ? null : id
        }

        return {
            childrenCount,
            activeItem,
            expandedItem,
            triggerItem
        }
    }
})
</script>

<style scoped lang="scss">
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    transition: all 300ms;

    li {
        display: flex;
        flex-direction: column;

        a {
            display: flex;
            align-items: center;
            color: var(--dl-color-text-buttons);
            padding: 8px 12px;
            text-decoration: none;
            gap: 10px;

            .expand-icon {
                display: flex !important;
                transition-property: transform, -webkit-transform;
                transition-duration: 0.28s, 0.28s;
                transition-timing-function: ease, ease;
                transition-delay: 0s, 0s;
                &.expanded {
                    transform: rotate(180deg);
                }
            }
        }
        a.active {
            background: rgba(255, 255, 255, 0.25);
            color: white;
        }

        a:hover:not(.active) {
            background: rgba(255, 255, 255, 0.25);
            color: white;
        }

        .horizontal-separator {
            width: 90%;
            border: thin solid grey;
            margin: 0 auto;
        }
    }
}
</style>
