import main_page from "./pages/main_page.vue"
import diagram_page from "./pages/diagram_page/diagram_page.vue"

const routes = [
    {
        path: '/',
        name: 'main',
        component: main_page
    },
    {
        path: '/circle-diagram',
        name: 'circle-diagram',
        component: diagram_page
    },
]

export default routes