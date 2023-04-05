<template>
    <div style="width: 90%; height: 100%">
        <DlLayout :left-items="leftItems">
            <div>
                <h2>Fixed Full-height Side Nav</h2>
                <h3>
                    Try to scroll this area, and see how the sidenav sticks to
                    the page
                </h3>
                <p>
                    Notice that this div element has a left margin of 25%. This
                    is because the side navigation is set to 25% width. If you
                    remove the margin, the sidenav will overlay/sit on top of
                    this div.
                </p>
                <p>
                    Also notice that we have set overflow:auto to sidenav. This
                    will add a scrollbar when the sidenav is too long (for
                    example if it has over 50 links inside of it).
                </p>
                <p>Some text..</p>
                <p>Some text..</p>
                <p>Some text..</p>
                <p>Some text..</p>
                <p>Some text..</p>
                <p>Some text..</p>
                <p>Some text..</p>
            </div>
        </DlLayout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlLayout } from '../components/essential'
import { LayoutVerticalItems } from '../components/essential/DlLayout/types/VerticalItems'

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlLayout
    },
    setup() {
        const leftItems = ref<LayoutVerticalItems[]>([
            {
                id: 1,
                icon: 'icon-dl-dashboard',
                link: '#person',
                title: 'My Dashboard',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 2,
                icon: 'icon-dl-project-filled',
                link: '#person',
                title: 'Active Project',
                subtitle: 'lorem ipsum dolor 123',
                fontSize: '16px'
            },
            {
                id: 3,
                icon: 'icon-dl-overview',
                link: '#finance',
                title: 'Project Overview',
                fontSize: '14px'
            },
            {
                id: 4,
                icon: 'icon-dl-data-management-filled',
                link: '#project_overview',
                title: 'Data Management',
                fontSize: '14px',
                data: [
                    {
                        id: 1,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '16px'
                    },
                    {
                        id: 2,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '16px'
                    },
                    {
                        id: 3,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '16px'
                    }
                ]
            },
            {
                id: 5,
                icon: 'icon-dl-pipeline-filled',
                link: '#project_overview',
                title: 'Pipelines',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 6,
                icon: 'icon-dl-workflows',
                link: '#project_overview',
                title: 'Workflow',
                fontSize: '14px'
            },
            {
                id: 7,
                icon: 'icon-dl-faas',
                link: '#project_overview',
                title: 'Applications (FaaS)',
                fontSize: '14px'
            }
        ])
        return {
            leftItems
        }
    }
})
</script>

<style scoped lang="scss">
.inlineKpi {
    display: flex;
    width: 100%;
    gap: 30px;
}
.autoWidth {
    width: min(100%, 50rem);
    height: 100%;
}
</style>
