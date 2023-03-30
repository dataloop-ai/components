<template>
    <div>
        <dl-empty-state
            :bg-image="`url('./src/demo/assets/agenda.svg')`"
            style="min-width: 400px; min-height: 300px"
            title="This analytics will populate with data when relevant information will be available."
            subtitle="This analytics will populate with data when relevant information will be available."
            info="To learn more about this analytics, read our documentation."
        />

        <dl-empty-state
            icon-color="dl-color-negative"
            icon-size="100px"
            :bg-image="`url('./src/demo/assets/agenda.svg')`"
            style="min-width: 400px; min-height: 300px; max-width: 400px"
            subtitle="This analytics will populate with data when relevant information will be available."
            info="To learn more about this analytics, read our documentation"
        >
            <template #cta="">
                <div style="display: flex; gap: 15px">
                    <dl-button label="Create Pipeline" />
                    <dl-button
                        outlined
                        label="Create With Template"
                    />
                </div>
            </template>

            <template #links="">
                <div style="display: flex; gap: 15px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </dl-empty-state>

        <dl-grid gap="20px">
            <dl-grid-row>
                <dl-widget>
                    <template #header>
                        <span>Widget 1</span>
                        <span style="font-size: 12px; color: gray">Subtitle</span>
                    </template>
                    <template #menu>
                        <div>
                            Menu
                            <div />
                        </div>
                    </template>
                    <template #content>
                        <dl-empty-state
                            :bg-image="`url('./src/demo/assets/agenda.svg')`"
                            style="min-height: 300px"
                            title="This analytics will populate with data when relevant information will be available."
                            subtitle="This analytics will populate with data when relevant information will be available."
                            info="To learn more about this analytics, read our documentation"
                        />
                    </template>
                    <template #description>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Libero eligendi dolore, similique possimus
                            veritatis in vitae quia praesentium fuga quibusdam
                            autem. Doloremque tenetur repudiandae a cupiditate
                            modi dicta eveniet veritatis?</span>
                    </template>
                </dl-widget>
            </dl-grid-row>
        </dl-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlEmptyState,
    DlButton,
    DlGrid,
    DlGridRow,
    DlWidget
} from '../components/basic'
export default defineComponent({
    name: 'DlEmptyStateDemo',
    components: {
        DlEmptyState,
        DlButton,
        DlGrid,
        DlGridRow,
        DlWidget
    }
})
</script>
