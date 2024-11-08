<template>
    <section class="main-page">
        <div class="main-page__progressbar-background">
            <component
                :is="is_component ? progressbarCmp : myProgressbarCmp"
                :percent="percent"
                :radius="radius"
                :type="progressbar_type"
                :status="current_status"
            />
        </div>
        <div class="main-page__dashboard-wrapper">
            <div class="main-page__dashboard">
                <div class="main-page__dashboard__status" v-for="btn in progressbar_btns.slice(0, 3)" :key="btn.id">
                    <btnCmp 
                        class="main-page__dashboard__status__btn"
                        :btn_text="btn.title"
                        @click="handleButtonClick(btn.id, btn.progressbar_status)"
                    />
                </div>
            </div>
            <transition name="fadeHeight">
                <div class="main-page__dashboard" v-if="!is_component">
                    <h3 class="main-page__dashboard__title">Cтатус компонента</h3>
                    <div class="main-page__dashboard__status" v-for="btn in progressbar_btns.slice(3)" :key="btn.id">
                        <btnCmp 
                            class="main-page__dashboard__status__btn"
                            :btn_text="btn.title"
                            :btn_type="btn.btn_type"
                            @click="handleButtonClick(btn.id, btn.progressbar_status)"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import progressbarCmp from '@/components/ui-components/progressbar-cmp/progressbar-cmp.vue'
import myProgressbarCmp from '@/components/ui-components/my-progressbar-cmp/my-progressbar-cmp.vue'
import btnCmp from '@/components/ui-components/btn-cmp/btn-cmp.vue'

const percent = ref<number>(0)
const radius = ref<number>(140)
const target_percent = ref<number>(100)
const progressbar_type = ref<'circle' | 'arc'>('circle')
const current_status = ref<string>('in progress')
const is_component = ref(true)
const is_paused = ref(false)

let interval: number | undefined

const getInProgressButtonTitle = () => {
    if (current_status.value === 'warning') {
        return 'Продолжить (In Progress)'
    } else if (current_status.value === 'error' || current_status.value === 'success') {
        return 'Заново (In Progress)'
    }
    return 'In Progress'
}

const progressbar_btns = reactive([
    { 
        id: 'type', 
        title: 'Изменить тип компонента' 
    },
    { 
        id: 'reset', 
        title: 'Обновить прогресс' 
    },
    { 
        id: 'component', 
        title: 'Поменять компонент' 
    },
    { 
        id: 'in progress', 
        title: computed(getInProgressButtonTitle),
        btn_type: 'primary',
        progressbar_status: 'in progress' 
    },
    { 
        id: 'warning', 
        title: 'Warning',
        btn_type: 'warning',
        progressbar_status: 'warning' 
    },
    { 
        id: 'error', 
        title: 'Error',
        btn_type: 'error',
        progressbar_status: 'error' 
    },
    { 
        id: 'success', 
        title: 'Success',
        btn_type: 'success',
        progressbar_status: 'success' 
    },
])


const animatePercent = () => {
    if (interval !== undefined) clearInterval(interval)

    interval = setInterval(() => {
        if (!is_paused.value && percent.value < target_percent.value) {
            percent.value += 1
        } else {
            if (percent.value >= target_percent.value) {
                current_status.value = 'success' // устанавливаем статус success
            }
            clearInterval(interval)
        }
    }, 30)
}

const resetProgress = () => {
    percent.value = 0
    is_paused.value = false
    animatePercent()
}

const handleButtonClick = (id: string, progressbar_status?: string) => {
    if (id === 'reset') {
        current_status.value = 'in progress'
        resetProgress()
    } else if (id === 'type') {
        progressbar_type.value = (progressbar_type.value === 'circle') ? 'arc' : 'circle'
    } else if (id === 'component') {
        current_status.value = 'in progress'
        progressbar_type.value = 'circle'
        toggleComponent()
        resetProgress()
    } else if (id === 'in progress') {
        if (current_status.value === 'error') {
            current_status.value = 'in progress'
            resetProgress()
        } else if (current_status.value === 'success') {
            current_status.value = 'in progress'
            is_paused.value = false
            resetProgress()
            animatePercent()
        } else {
            current_status.value = 'in progress'
            is_paused.value = false
            animatePercent()
        }
    } else if (progressbar_status === 'success') {
        if (current_status.value !== 'error') {
            percent.value = 100 
            current_status.value = 'success'
        }
    } else if (progressbar_status) {
        if (percent.value < 100 && current_status.value !== 'error') {
            current_status.value = progressbar_status
            if (progressbar_status === 'warning' || progressbar_status === 'error') {
                is_paused.value = true // ставим на паузу при статусах warning и error
            } else {
                is_paused.value = false
                animatePercent()
            }
        }
    }
}

const toggleComponent = () => {
    is_component.value = !is_component.value
}

onMounted(() => {
    animatePercent()
})

defineComponent({
    components: {
        progressbarCmp,
        myProgressbarCmp,
        btnCmp,
    }
})
</script>

