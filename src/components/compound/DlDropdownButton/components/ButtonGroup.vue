<template>
    <div
        :id="uuid"
        :class="classes"
    >
        <slot />
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

const classes = ['outlined', 'flat', 'stretch']

export default defineComponent({
    name: 'ButtonGroup',
    props: {
        outlined: Boolean,
        flat: Boolean,
        stretch: Boolean,
        spread: Boolean
    },
    data() {
        return {
            uuid: `button-group-${v4()}`
        }
    },
    computed: {
        classes(): string {
            const cls = classes
                // todo: wtf is this ?
                // @ts-ignore
                .filter((t) => this[t] === true)
                .map((t) => `dl-btn-group--${t}`)
                .join(' ')

            return (
                `dl-btn-group row no-wrap${cls.length > 0 ? ' ' + cls : ''}` +
                (this.spread ? ' dl-btn-group--spread' : ' inline')
            )
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-btn-group {
    border-radius: 2px;
    vertical-align: middle;

    > .dl-button {
        border-radius: inherit;
        align-self: stretch;

        &:before {
            box-shadow: none;
        }
    }
    > .dl-btn-group {
        box-shadow: none;

        &:first-child {
            > .dl-button:first-child {
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;
            }
        }
        &:last-child {
            > .dl-button:last-child {
                border-top-right-radius: inherit;
                border-bottom-right-radius: inherit;
            }
        }
    }
    > .dl-btn-group:not(:first-child) > .dl-button:first-child:before {
        border-left: 0;
    }
    > .dl-btn-group:not(:last-child) > .dl-button:last-child:before {
        border-right: 0;
    }
    > .dl-button:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    > .dl-button:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    > .dl-button.dl-button--standard:before {
        z-index: -1;
    }
    &--flat,
    &--outlined,
    &--outlined {
        > .dl-separator {
            display: none;
        }
        > .dl-button + .dl-button:before {
            border-left: 0;
        }
        > .dl-button:not(:last-child):before {
            border-right: 0;
        }
    }
    &--stretch {
        align-self: stretch;
        border-radius: 0;
    }
    &--spread {
        > .dl-btn-group {
            display: flex !important;
        }
        > .dl-button,
        > .dl-btn-group > .dl-button:not(.dl-btn-dropdown__arrow-container) {
            width: auto;
            min-width: 0;
            max-width: 100%;
            flex: 10000 1 0%;
        }
    }
}
</style>
