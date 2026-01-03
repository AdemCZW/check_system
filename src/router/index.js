import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // 關鍵修改：將 createWebHistory 改為 createWebHashHistory
    // 這能確保在 GitHub Pages 重新整理時不會出錯
    history: createWebHashHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ('../views/LoginView.vue')
        },
        {
            path: '/admin',
            component: () =>
                import ('../components/layout/MainLayout.vue'),
            children: [{
                    path: 'registration-setting',
                    name: 'RegistrationSetting',
                    component: () =>
                        import ('../views/Registration/Setting.vue')
                },
                {
                    path: 'guests',
                    name: 'Guests',
                    component: () =>
                        import ('../views/Guests/List.vue')
                },
                {
                    path: 'form-fields',
                    name: 'FormFields',
                    component: () =>
                        import ('../views/Fields/Config.vue')
                },
                {
                    path: 'notifications',
                    name: 'Notifications',
                    component: () =>
                        import ('../views/Notifications/EmailEditor.vue')
                },
                {
                    path: 'participants',
                    name: 'Participants',
                    component: () =>
                        import ('../views/Participants/List.vue')
                },
                {
                    path: 'checkin-history',
                    name: 'CheckInHistory',
                    component: () =>
                        import ('../views/CheckIn/History.vue')
                },
                {
                    path: 'badge-printing',
                    name: 'BadgePrinting',
                    component: () =>
                        import ('../views/Badges/Printer.vue')
                },
                {
                    path: 'lottery-winners',
                    name: 'LotteryWinners',
                    component: () =>
                        import ('../views/Lottery/Winners.vue')
                },
                {
                    path: 'organizer-info',
                    name: 'OrganizerInfo',
                    component: () =>
                        import ('../views/Organizer/CompanyInfo.vue')
                },
                {
                    path: 'ai-service',
                    name: 'AIService',
                    component: () =>
                        import ('../views/AI-Service/BotSetting.vue')
                }
            ]
        }
    ]
})

export default router
