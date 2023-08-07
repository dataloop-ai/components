<template>
    <div>
        <dl-widget style="width: 50vw">
            <template #header>
                <span>Widget with menu icons</span>
                <span style="font-size: 12px; color: var(--dl-color-medium)">Subtitle</span>
            </template>
            <template #content>
                <dl-bar-chart
                    :data="data"
                    :items-in-view="8"
                />
            </template>
            <template #menu>
                <div class="menu-icons">
                    <dl-icon
                        size="m"
                        icon="icon-dl-settings"
                    />
                    <dl-icon
                        size="m"
                        icon="icon-dl-download"
                    />
                </div>
            </template>
        </dl-widget>

        <dl-widget style="width: 50vw">
            <template #header>
                <span>Widget with description</span>
            </template>
            <template #content>
                <dl-bar-chart
                    :data="data"
                    :items-in-view="6"
                />
            </template>
            <template #description>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Libero eligendi dolore, similique possimus veritatis in
                    vitae quia praesentium fuga quibusdam autem. Doloremque
                    tenetur repudiandae a cupiditate modi dicta eveniet
                    veritatis?</span>
            </template>
        </dl-widget>

        <dl-widget
            is-empty
            :empty-state-props="{
                style: 'min-height: 350px;',
                title: 'Lorem ipsum',
                subtitle:
                    'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                info: 'To learn more about this analytics, read our documentation.',
                responsive: false
            }"
            style="width: 50vw"
        >
            <template #header>
                <span>Empty state widget</span>
            </template>
            <template #links="">
                <div style="display: flex; gap: 5px; padding: 0 20px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <div class="break" />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </dl-widget>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlWidget, DlBarChart, DlIcon, DlButton } from '../components'

const data = {
    labels: Array.from({ length: 20 }, (_, i) => `${i}`),
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        }
    ]
}

export default defineComponent({
    components: {
        DlWidget,
        DlBarChart,
        DlIcon,
        DlButton
    },
    setup() {
        return {
            data
        }
    }
})
</script>

<style lang="scss" scoped>
.menu-icons {
    display: flex;
    align-items: center;
    & > * {
        cursor: pointer;
        margin: 0px 5px;
    }
}
</style>
