<template>
    <div style="width: 800px">
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip label="Lorem ipsum dolor" />
            <DlChip
                outlined
                label="Chip outlined"
            />
            <DlChip
                disabled
                label="Chip disabled"
            />
            <DlChip label="Ellipsed Chip with a multiple words" />
            <DlChip
                label="Ellipsed Chip with a multiple words"
                icon="icon-dl-search"
            />
            <DlChip
                label="custom max width (200px)"
                icon="icon-dl-search"
                max-width="200px"
            />
        </div>
        <h4>Removable Chips</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                label="Chip filled"
                @remove="log"
            />
            <DlChip
                removable
                outlined
                label="Chip outlined"
                @remove="log"
            />
            <DlChip
                removable
                disabled
                label="Chip disabled"
                @remove="log"
            />
            <DlChip
                removable
                label="Ellipsed Chip with a multiple words"
                @remove="log"
            />
            <DlChip
                removable
                label="custom max width (200px)"
                max-width="200px"
                @remove="log"
            />
        </div>
        <h4>Removable Chips with icon</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                icon="icon-dl-search"
                label="Chip filled"
                @remove="log"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                @remove="log"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                outlined
                label="Chip outlined"
                @remove="log"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                disabled
                label="Chip disabled"
                @remove="log"
            />
            <DlChip
                removable
                label="Ellipsed Chip with a multiple words"
                icon="icon-dl-search"
                @remove="log"
            />
            <DlChip
                removable
                label="custom max width (200px)"
                icon="icon-dl-search"
                max-width="200px"
                @remove="log"
            />
        </div>
        <h4>Removable Chips without icon and label</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                @remove="log"
            />
            <DlChip
                removable
                outlined
                @remove="log"
            />
            <DlChip
                removable
                disabled
                @remove="log"
            />
        </div>
        <h4>Chips with icon and without label</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip icon="icon-dl-search" />
            <DlChip
                icon="icon-dl-search"
                outlined
            />
            <DlChip
                icon="icon-dl-search"
                disabled
            />
        </div>
        <h4>Chips with overflow</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                label="Long Chip Label With Alot Of Text"
                max-width="75px"
                overflow
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlChip } from '../components'
export default defineComponent({
    name: 'DlChipDemo',
    components: {
        DlChip
    },
    setup() {
        const log = (e: Event) => console.log(e)
        return { log }
    }
})
</script>

<style scoped lang="scss">
.col {
    width: auto;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
    & > button,
    & > div.dl-chip {
        margin: 0 0 0 8px;
    }
}
</style>
