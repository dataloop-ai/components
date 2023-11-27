<template>
    <div
        class="dl-layout"
        :style="cssVars"
    >
        <div class="dl-layout__main-head">
            <slot name="header" />
        </div>
        <div class="dl-layout__left-drawer">
            <slot name="leftDrawer" />
        </div>
        <div class="dl-layout__right-drawer">
            <slot name="rightDrawer" />
        </div>
        <div class="dl-layout__content">
            <slot name="body" />
        </div>
        <div class="dl-layout__footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue-demi'
export default defineComponent({
    name: 'DlLayout',
    props: {
        template: {
            type: String,
            default: '"h h h" "l p r" "f f f"'
        }
    },
    setup(props) {
        const cssVars = computed(() => {
            return {
                '--dl-layout-template': props.template
            }
        })
        return {
            cssVars
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-areas: var(--dl-layout-template);
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    box-shadow: 1px 1px 1px var(--dl-color-separator);

    &__main-head {
        grid-area: h;
        background-color: var(--dl-color-body-background);
    }

    &__content {
        grid-area: p;
        overflow-y: auto;
        box-shadow: 1px 1px 1px var(--dl-color-separator);
        background-color: var(--dl-color-panel-background);
    }

    &__left-drawer {
        grid-area: l;
        overflow: auto;
        box-shadow: 1px 1px 1px var(--dl-color-separator);
    }

    &__right-drawer {
        grid-area: r;
        overflow: auto;
        box-shadow: 1px 1px 1px var(--dl-color-separator);
    }

    &__sidebar-content {
        position: absolute;
        margin-left: 0;
    }

    &__footer {
        grid-area: f;
        box-shadow: 1px 1px 1px var(--dl-color-separator);
    }
}
</style>
