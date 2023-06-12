<template>
    <div
        class="query"
        @mouseenter="actionsVisible = true"
        @mouseleave="actionsVisible = false"
    >
        <div
            class="query__header"
            @mousedown="$emit('select')"
        >
            <dl-icon :icon="icon" />
            <span class="query__header--title">
                {{ name }}
            </span>
        </div>
        <div
            v-if="actionsVisible"
            class="query__actions"
        >
            <div
                class="query__actions--icon"
                @mousedown="$emit('delete')"
            >
                <dl-icon
                    :inline="false"
                    size="14px"
                    icon="icon-dl-delete"
                />
                <dl-tooltip>Delete</dl-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlIcon, DlTooltip } from '../../../../essential'
export default defineComponent({
    components: {
        DlIcon,
        DlTooltip
    },
    props: {
        type: {
            type: String,
            default: 'saved'
        },
        name: {
            type: String,
            default: ''
        }
    },
    emits: ['delete', 'select'],
    data() {
        return {
            actionsVisible: false
        }
    },
    computed: {
        icon(): string {
            return this.type === 'saved' ? 'icon-dl-save' : 'icon-dl-time'
        }
    }
})
</script>

<style lang="scss" scoped>
.query {
    height: 18px;
    padding: 5px 10px;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    color: var(--dl-color-darker);
    &__header {
        cursor: pointer;
        display: flex;
        align-items: center;
        &--title {
            font-size: 12px;
            margin: 0px 12px;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        &--icon {
            cursor: pointer;
            margin: 0px 5px;
        }
    }

    &:hover {
        background-color: var(--dl-color-fill);
    }
}
</style>
