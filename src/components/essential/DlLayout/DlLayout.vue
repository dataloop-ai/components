<template>
    <div class="dl-layout">
        <div class="dl-layout__navbar">
            <DlLayoutNavbar @toggle="toggleLeftSideBar" />
        </div>
        <div class="dl-layout__content">
            <div>
                <DlLayoutLeftSide :is-expanded="isExpandedLeftSide" />
            </div>
            <div>
                <div style="padding: 1px 16px; height: 1000px">
                    <h2>Fixed Full-height Side Nav</h2>
                    <h3>
                        Try to scroll this area, and see how the sidenav sticks
                        to the page
                    </h3>
                    <p>
                        Notice that this div element has a left margin of 25%.
                        This is because the side navigation is set to 25% width.
                        If you remove the margin, the sidenav will overlay/sit
                        on top of this div.
                    </p>
                    <p>
                        Also notice that we have set overflow:auto to sidenav.
                        This will add a scrollbar when the sidenav is too long
                        (for example if it has over 50 links inside of it).
                    </p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                    <p>Some text..</p>
                </div>
            </div>
            <div>
                <DlLayoutRightSide />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import DlLayoutNavbar from './components/DlLayoutNavbar.vue'
import DlLayoutLeftSide from './components/DlLayoutLeftSide.vue'
import DlLayoutRightSide from './components/DlLayoutRightSide.vue'

export default defineComponent({
    name: 'DlLayout',
    components: {
        DlLayoutNavbar,
        DlLayoutLeftSide,
        DlLayoutRightSide
    },
    setup() {
        const isExpandedLeftSide = ref(true)
        const toggleLeftSideBar = (event) => {
            isExpandedLeftSide.value = event
        }
        return {
            isExpandedLeftSide,
            toggleLeftSideBar
        }
    }
})
</script>

<style scoped lang="scss">
.dl-layout {
    width: 100%;

    &__content {
        display: flex;
    }
}
</style>
