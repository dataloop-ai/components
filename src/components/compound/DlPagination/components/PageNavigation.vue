<template>
    <div
        class="dl-pagination--page_navigation"
        :style="cssVars"
    >
        <button
            v-if="boundaryLinks"
            class="dl-pagination--nav_button"
            :disabled="disabled || isFirstPage"
            @click="setPage(min)"
        >
            <dl-icon
                icon="icon-dl-first-page"
                size="16px"
            />
        </button>
        <button
            v-if="directionLinks"
            class="dl-pagination--nav_button"
            :disabled="disabled || isFirstPage"
            @click="setPage(value - 1)"
        >
            <dl-icon
                icon="icon-dl-previous-page"
                size="16px"
            />
        </button>
        <div class="dl-pagination--page_buttons_wrapper">
            <button
                v-if="boundaryNumbers"
                class="dl-pagination--page_button"
                :class="{ 'dl-pagination--active': isActivePage(min) }"
                :disabled="disabled"
                @click="setPage(min)"
            >
                {{ min }}
            </button>
            <button
                v-if="ellipsesStart"
                class="dl-pagination--page_button"
                :disabled="disabled"
                @click="setPage(pgFrom - 1)"
            >
                ...
            </button>
            <template v-if="pages.length > 0">
                <button
                    v-for="page in pages"
                    :key="page"
                    class="dl-pagination--page_button"
                    :class="{
                        'dl-pagination--active': isActivePage(page),
                        active: isActivePage(page)
                    }"
                    :disabled="disabled"
                    @click="setPage(page)"
                >
                    {{ page }}
                </button>
            </template>
            <button
                v-if="ellipsesEnd"
                class="dl-pagination--page_button"
                :disabled="disabled"
                @click="setPage(pgTo + 1)"
            >
                ...
            </button>
            <button
                v-if="boundaryNumbers && min !== max"
                class="dl-pagination--page_button"
                :class="{ 'dl-pagination--active': isActivePage(max) }"
                :disabled="disabled"
                @click="setPage(max)"
            >
                {{ max }}
            </button>
        </div>
        <button
            v-if="directionLinks"
            class="dl-pagination--nav_button"
            :disabled="disabled || isLastPage"
            @click="setPage(value + 1)"
        >
            <dl-icon
                icon="icon-dl-right-next-page"
                size="16px"
            />
        </button>
        <button
            v-if="boundaryLinks"
            class="dl-pagination--nav_button"
            :disabled="disabled || isLastPage"
            @click="setPage(max)"
        >
            <dl-icon
                icon="icon-dl-last-page"
                size="16px"
            />
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { getColor } from '../../../../utils'
import { DlIcon } from '../../../essential'

export default defineComponent({
    name: 'PageNavigation',
    components: {
        DlIcon
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        modelValue: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1,
            validator: (v: number) => v >= 1
        },
        max: {
            type: Number,
            required: true
        },
        maxPages: {
            type: Number,
            default: 0,
            validator: (v: number) => v >= 0
        },
        disabled: Boolean,
        boundaryNumbers: Boolean,
        boundaryLinks: Boolean,
        directionLinks: Boolean,
        color: {
            type: String,
            default: 'dl-color-transparent'
        },
        textColor: {
            type: String,
            default: 'dl-color-darker'
        },
        activeColor: {
            type: String,
            default: 'dl-color-secondary'
        },
        activeTextColor: {
            type: String,
            default: 'dl-color-text-buttons'
        }
    },
    emits: ['update:model-value'],
    data() {
        return {
            value: this.modelValue,
            pgFrom: this.min,
            pgTo: this.max,
            ellipsesStart: false,
            ellipsesEnd: false
        }
    },
    computed: {
        isFirstPage(): boolean {
            return this.value === this.min
        },
        isLastPage(): boolean {
            return this.value === this.max
        },
        buttonMinWidth(): string {
            return `${Math.max(2, String(this.max).length)}em`
        },
        cssVars(): Record<string, any> {
            return {
                '--dl-button-bg-color': getColor(
                    this.color,
                    'dl-color-transparent'
                ),
                '--dl-active-button-bg-color': getColor(
                    this.activeColor,
                    'dl-color-secondary'
                ),
                '--dl-text-color': getColor(this.textColor, 'dl-color-darker'),
                '--dl-active-text-color': getColor(
                    this.activeTextColor,
                    'dl-color-text-buttons'
                ),
                '--dl-button-min-width': this.buttonMinWidth
            }
        },
        pages(): number[] {
            const pages: number[] = []

            for (let i = this.pgFrom; i <= this.pgTo; i++) {
                pages.push(i)
            }

            return pages
        }
    },
    watch: {
        value() {
            this.updateState()
        },
        max() {
            this.updateState()
        },
        modelValue() {
            this.value = this.modelValue
        }
    },
    beforeMount() {
        this.updateState()
    },
    methods: {
        isActivePage(page: number): boolean {
            return page === this.value
        },
        set(value: number) {
            this.value = value
        },
        setByOffset(offset: number) {
            this.value = this.value + offset
        },
        setPage(value: number) {
            this.set(value)
            this.$emit('update:model-value', value)
        },
        updateState() {
            this.ellipsesStart = false
            this.ellipsesEnd = false

            let maxPages = Math.max(
                this.maxPages,
                3 + (this.boundaryNumbers ? 2 : 0)
            )

            this.pgFrom = this.boundaryNumbers ? this.min + 1 : this.min
            this.pgTo = this.boundaryNumbers ? this.max - 1 : this.max

            if (this.maxPages && maxPages < this.max - this.min + 1) {
                maxPages = 1 + Math.floor(maxPages / 2) * 2

                this.pgFrom = Math.max(
                    this.min,
                    Math.min(
                        this.max - maxPages + 1,
                        this.value - Math.floor(maxPages / 2)
                    )
                )

                this.pgTo = Math.min(this.max, this.pgFrom + maxPages - 1)

                if (this.boundaryNumbers) {
                    this.pgFrom += 1
                    this.pgTo -= 1
                }

                if (this.pgFrom > this.min + (this.boundaryNumbers ? 1 : 0)) {
                    this.pgFrom += 1
                    this.ellipsesStart = true
                }

                if (this.pgTo < this.max - (this.boundaryNumbers ? 1 : 0)) {
                    this.pgTo -= 1
                    this.ellipsesEnd = true
                }
            }
        }
    }
})
</script>

<style scoped lang="scss">
.dl-pagination {
    &--page_navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
    }

    &--page_buttons_wrapper {
        display: flex;
        padding-left: 10px;
        padding-right: 10px;
    }

    &--page_button {
        text-align: center;
        width: 20px;
        height: 20px;
        font-size: 12px;
        line-height: 14px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &--active {
        color: var(--dl-active-text-color) !important;
        background-color: var(--dl-active-button-bg-color) !important;
    }

    &--page_button,
    &--nav_button {
        min-width: var(--dl-button-min-width);
        padding: 0;
        cursor: pointer;
        border: none;
        border-radius: 2px;
        color: var(--dl-text-color);
        background-color: var(--dl-button-bg-color);

        &:active:not(:disabled) {
            background-color: var(--dl-color-secondary);
            color: var(--dl-color-text-buttons);

            ::v-deep .dl-icon {
                color: var(--dl-color-text-buttons);
            }
        }

        &:disabled {
            color: var(--dl-color-disabled);
            cursor: default;

            ::v-deep .dl-icon {
                color: var(--dl-color-disabled);
            }
        }

        &:hover:not(:disabled):not(.active) {
            background-color: var(--dl-color-hover);
            color: var(--dl-color-text-buttons);

            ::v-deep .dl-icon {
                color: var(--dl-color-text-buttons);
            }
        }
    }
}
</style>
