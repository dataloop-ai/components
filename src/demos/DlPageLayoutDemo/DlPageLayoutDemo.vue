<template>
    <div>
        <dl-button @click="isOpenPageLayoutModal = true">
            Page Layout
        </dl-button>
        <div v-if="isOpenPageLayoutModal" class="fullscreen-template">
            <div class="fullscreen-template__close">
                <dl-button
                    icon="icon-dl-close"
                    size="xl"
                    flat
                    @click="isOpenPageLayoutModal = false"
                />
            </div>
            <dl-page-layout>
                <template #header>
                    <dl-page-layout-header
                        title="testsetest"
                        :counters="[
                            {
                                value: 200,
                                text: 'All dataset items'
                            },
                            {
                                value: 100,
                                text: 'Selected items'
                            },
                            {
                                value: 12,
                                text: 'Annotated items'
                            },
                            {
                                value: 17,
                                text: 'Annotations'
                            }
                        ]"
                    >
                        <template #actions>
                            <dl-button
                                outlined
                                style="margin-left: 10px"
                                padding="5px"
                                label="Switch to Basic Browser"
                            />
                        </template>
                        <template #subtitle> testestse </template>
                    </dl-page-layout-header>
                </template>
                <div>This is a body</div>
            </dl-page-layout>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton } from '../../components'
import { DlPageLayout, DlPageLayoutHeader } from '../../layouts'

export default defineComponent({
    name: 'DlLayoutDemo',
    components: {
        DlButton,
        DlPageLayout,
        DlPageLayoutHeader
    },
    setup() {
        const isOpenPageLayoutModal = ref(false)

        return {
            isOpenPageLayoutModal
        }
    }
})
</script>

<style scoped lang="scss">
.fullscreen-template {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;

    &__close {
        position: absolute;
        right: 10px;
        z-index: 2;
    }
}
</style>
