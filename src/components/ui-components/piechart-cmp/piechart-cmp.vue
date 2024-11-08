<template>
    <div class="piechart">
        <Pie :data="chart_data" :options="options" />
    </div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import { ref, defineComponent, PropType, watch, defineProps } from 'vue'
import { Pie } from 'vue-chartjs'

ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend)

interface Sector { id: string, title: string, part: string, color: string }

const props = defineProps({
    sectors: {
        type: Array as PropType<Sector[]>,
        required: true,
    }
})

// Список секторов
const chart_data = ref({
    labels: props.sectors.map((sector: Sector) => sector.title),
    datasets: [
        {
            data: props.sectors.map((sector: Sector) => Number(sector.part)),
            backgroundColor: props.sectors.map((sector: Sector) => sector.color),
        }
    ]
})

//Слежение за обновлением в списке секторов
watch(() => props.sectors, (new_sectors) => {
    chart_data.value = {
        labels: new_sectors.map((sector: Sector) => sector.title),
        datasets: [
            {
                data: new_sectors.map((sector: Sector) => Number(sector.part)),
                backgroundColor: new_sectors.map((sector: Sector) => sector.color),
            }
        ]
    }
}, { deep: true })

const options = ref({
    responsive: true,
    plugins: {
        legend: {          
            labels: {
                color: '#3C3C3C',
                font: {
                    size: 15,
                },
                usePointStyle: true,
                padding: 30,
            },
            position: 'bottom' as const,
        },
    },
})

defineComponent({
    components: {
        Pie
    },
})
</script>
