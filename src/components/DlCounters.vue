<template>
    <div
        :id="uuid"
        class="container"
    >
        <ul>
            <li
                v-for="(item, index) in items"
                :key="index"
                class="item"
            >
                <div :class="computeClass('item-content')">
                    <p :class="computeClass('item-value')">
                        {{ item.value }}
                    </p>
                    <p
                        v-show="item.text"
                        class="item-text"
                    >
                        {{ capitalize(item.text) }}
                    </p>
                    <p
                        v-show="item.subtext"
                        class="item-subtext"
                    >
                        {{ item.subtext && capitalize(item.subtext) }}
                    </p>
                </div>
                <div class="divider" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, PropType } from 'vue-demi'

interface CounterItem {
    value?: number
    text: string
    subtext?: string
}

export default defineComponent({
    name: 'DlCounters',
    props: {
        small: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array as PropType<CounterItem[]>,
            default: (): CounterItem[] => [],
            validator(value: CounterItem[]): boolean {
                return value.length <= 8
            }
        }
    },
    data() {
        return {
            uuid: `dl-counters-${v4()}`
        }
    },
    methods: {
        capitalize(value: string): string {
            return value[0].toUpperCase() + value.slice(1)
        },
        computeClass(value: string): (string | boolean)[] {
            return [value, this.small && `${value}--small`]
        }
    }
})
</script>

<style scoped lang="scss">
.container {
    padding: 10px;
    width: fit-content;
}

ul {
    list-style-type: none;
    overflow: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: stretch;

    .item {
        display: flex;
        justify-content: center;
    }

    .item-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;

        &--small {
            padding-left: 20px;
            padding-right: 20px;
        }
    }

    .item-value {
        font-size: var(--dl-font-size-h1);
        color: var(--dl-color-secondary);
        padding: 2px;
        margin: 0;
        line-height: 35px;

        &--small {
            line-height: 23px;
            font-size: var(--dl-font-size-h2);
        }
    }

    .item-text {
        font-size: var(--dl-font-size-h4);
        color: var(--dl-color-darker);
        margin: 0;
        text-align: center;
        max-width: 130px;
        line-height: 18px;
    }

    .item-subtext {
        font-size: var(--dl-font-size-body);
        color: var(--dl-color-medium);
        margin: 0;
        text-align: center;
        max-width: 130px;
        padding-top: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 16px;
        max-height: 35.1px;
        white-space: pre-wrap;
    }

    .divider {
        display: block;
        background-color: var(--dl-color-separator);
        width: 1px;
        align-self: stretch;
    }

    li {
        float: left;
        text-decoration: none;
        position: relative;

        &:first-child {
            .item-content {
                padding-left: 0;
            }
        }

        &:last-child {
            .divider {
                display: none;
            }

            .item-content {
                padding-right: 0;
            }
        }
    }
}
</style>
