<template>
    <ul>
        <li
            v-for="item in items"
            :key="item.id"
        >
            <a
                :class="{ active: item.id === activeItem }"
                :href="item.link"
                @click="activeItem = item.id"
            >
                <span>
                    <dl-icon
                        :icon="item.icon"
                        color="var(&#45;&#45;dl-color-text-buttons)"
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
                <div>
                    {{ childrenCount(item) }}
                </div>
            </a>
            <div
                v-if="isVisible"
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
import { defineComponent, PropType } from 'vue-demi'
import { LayoutVerticalItems } from '../types/VerticalItems'
// import { DlIcon } from "../../DlIcon";
// import { DlTypography } from "../../DlTypography";
import { DlIcon, DlTypography } from '/src/components/'

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
            type: Boolean
        }
    },
    setup() {
        const childrenCount = (item: LayoutVerticalItems) => item?.data?.length

        return {
            childrenCount
        }
    }
})
</script>

<style scoped lang="scss">
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

li {
    display: flex;
    flex-direction: column;
}

li a {
    display: flex;
    align-items: center;
    color: var(--dl-color-text-buttons);
    padding: 8px 16px;
    text-decoration: none;
    gap: 10px;
}

li a.active {
    background: rgba(255, 255, 255, 0.25);
    color: white;
}

li a:hover:not(.active) {
    background: rgba(255, 255, 255, 0.25);
    color: white;
}
.horizontal-separator {
    width: 90%;
    border: thin solid grey;
    margin: 0 auto;
}
</style>
