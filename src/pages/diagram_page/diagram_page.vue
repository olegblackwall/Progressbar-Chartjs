<template>
    <div class="diagram-page">
        <h1 class="diagram-page__title">Круговая диаграма</h1>
        <div class="diagram-page__container">
            <div class="diagram-page__container__sector-list__wrapper">
                <div class="diagram-page__container__sector-list" v-for="(sector, sector_id) in sector_list" :key="sector_id">
                    <sectorCmp 
                        :title="sector.title"
                        :part="sector.part"
                        :color="sector.color"
                        :id="sector.id"
                        @delete_sector="removeSector(sector.id)"
                    />
                </div>
                <btnCmp 
                    class="diagram-page__container__sector-list__btn"
                    :btn_text="'Добавить сектор'"
                    @click="addSector"
                />
            </div>
            <PiechartCmp
                :sectors="sector_list" 
            />
        </div>
    </div>
    <modalCmp 
        @update_sector="updateSector" 
        @add_sector="addNewSector" 
    />
</template>

<script lang="ts" setup>
import { defineComponent, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import sectorCmp from '@/components/ui-components/sector-cmp/sector-cmp.vue'
import btnCmp from '@/components/ui-components/btn-cmp/btn-cmp.vue'
import modalCmp from '@/components/base/modals/modal-cmp.vue'
import PiechartCmp from '@/components/ui-components/piechart-cmp/piechart-cmp.vue'

interface Sector { id: string, title: string, part: string, color: string }

const store = useStore()

// Список секторов
const sector_list = reactive<Sector[]>([])

onMounted(() => {
    const stored_sectors = localStorage.getItem('sectors')
    if (stored_sectors) {
        sector_list.push(...JSON.parse(stored_sectors))
    }
})

// Обновление списка секторов в localstorage при каждом изменении списка
watch(sector_list, (new_list) => {
    localStorage.setItem('sectors', JSON.stringify(new_list))
}, { deep: true })

// Добавление нового сектора
const addNewSector = (new_sector: { title: string, part: string, color: string }) => {
    sector_list.push({ id: String(Date.now()).slice(-5), ...new_sector })
    localStorage.setItem('sectors', JSON.stringify(sector_list))
}

// Обновление сектора
const updateSector = (updated_data: { id: string, title: string, part: string, color: string }) => {
    store.commit('modal_module/updateSectorData', updated_data)
    const sector = sector_list.find(sector => sector.id === updated_data.id)
    if (sector) {
        Object.assign(sector, updated_data)
        localStorage.setItem('sectors', JSON.stringify(sector_list))
    }
}

// Открывает модальное окно для добавления сектора
const addSector = () => {
    store.commit('modal_module/openModal', { title: '', part: '', color: '', is_edit: false })
}

const removeSector = (sector_id: string) => {
    const index = sector_list.findIndex(sector => sector.id === sector_id)
    if (index !== -1) {
        sector_list.splice(index, 1)
        localStorage.setItem('sectors', JSON.stringify(sector_list))
    }
}

defineComponent({
    components: {
        sectorCmp,
        btnCmp,
        modalCmp,
        PiechartCmp
    }
})
</script>
