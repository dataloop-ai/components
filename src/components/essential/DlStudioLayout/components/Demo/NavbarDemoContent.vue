<template>
    <div class="navbar-demo-content">
        <div style="display: flex; height: 100%; align-items: center">
            <dl-button
                flat
                icon="icon-dl-hamburger-menu"
                color="secondary"
                size="xl"
                @click="updateExpandLeftDrawer"
            />
            <dl-button
                flat
                color="secondary"
                icon="icon-dl-left-chevron"
                label="Go to: Dataset Browser"
            />
        </div>
        <div
            style="
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: end;
                padding-right: 10px;
            "
        >
            <dl-button flat>
                <dl-icon
                    size="16px"
                    icon="icon-dl-light-theme"
                    color="dl-color-warning"
                />
            </dl-button>
            <dl-button flat>
                <dl-icon
                    size="16px"
                    icon="icon-dl-dark-theme"
                    color="dl-color-warning"
                />
            </dl-button>
            <dl-button
                flat
                color="secondary"
                icon="icon-dl-question"
            />
            <dl-button
                flat
                color="secondary"
            >
                <dl-icon
                    size="16px"
                    icon="icon-dl-notification"
                />
            </dl-button>
            <dl-button
                flat
                color="secondary"
                icon="icon-dl-cloud-server"
            />
            <dl-button
                flat
                color="secondary"
                icon="icon-dl-magic"
            />
            <dl-button flat>
                <dl-avatar
                    tooltip="popcat@gmail.com"
                    size="25px"
                >
                    <img src="https://popcat.click/twitter-card.jpg">
                </dl-avatar>
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue-demi'
import DlButton from '../../../../basic/DlButton/DlButton.vue'
import DlAvatar from '../../../../basic/DlAvatar/DlAvatar.vue'
import DlIcon from '../../../../essential/DlIcon/DlIcon.vue'

export default defineComponent({
    name: 'NavbarDemoContent',
    components: {
        DlButton,
        DlAvatar,
        DlIcon
    },
    props: {
        expandLeftDrawer: {
            type: Boolean
        }
    },
    emits: ['update:expandLeftDrawer'],
    setup(props, ctx) {
        const expandLeftDrawerProp = computed<boolean>(
            () => props.expandLeftDrawer
        )
        const isExpandedLeftDrawer = ref(expandLeftDrawerProp.value)

        const updateExpandLeftDrawer = () => {
            isExpandedLeftDrawer.value = !isExpandedLeftDrawer.value
            ctx.emit('update:expandLeftDrawer', isExpandedLeftDrawer.value)
        }

        return {
            updateExpandLeftDrawer
        }
    }
})
</script>

<style scoped>
.navbar-demo-content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-self: center;
    justify-content: center;
}
</style>
