import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(
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
                    path: 'registration-setting', // 1. 報名頁面設定
                    name: 'RegistrationSetting',
                    component: () =>
                        import ('../views/Registration/Setting.vue')
                },
                {
                    path: 'guests', // 2. 參與貴賓
                    name: 'Guests',
                    component: () =>
                        import ('../views/Guests/List.vue')
                },
                {
                    path: 'form-fields', // 3. 報名表欄位
                    name: 'FormFields',
                    component: () =>
                        import ('../views/Fields/Config.vue')
                },
                {
                    path: 'notifications', // 4. 通知信設定
                    name: 'Notifications',
                    component: () =>
                        import ('../views/Notifications/EmailEditor.vue')
                },
                {
                    path: 'participants', // 5. 參與者資訊 (已從 Dashboard 改為 List)
                    name: 'Participants',
                    component: () =>
                        import ('../views/Participants/List.vue')
                },
                {
                    path: 'checkin-history', // 6. 現場報到紀錄 (新增)
                    name: 'CheckInHistory',
                    component: () =>
                        import ('../views/CheckIn/History.vue')
                },
                {
                    path: 'badge-printing', // 7. 識別證列印
                    name: 'BadgePrinting',
                    component: () =>
                        import ('../views/Badges/Printer.vue')
                },
                {
                    path: 'lottery-winners', // 8. 中獎名單管理 (新增)
                    name: 'LotteryWinners',
                    component: () =>
                        import ('../views/Lottery/Winners.vue')
                },
                {
                    path: 'organizer-info', // 9. 主辦單位資訊
                    name: 'OrganizerInfo',
                    component: () =>
                        import ('../views/Organizer/CompanyInfo.vue')
                },
                {
                    path: 'ai-service', // 10. AI客服設定
                    name: 'AIService',
                    component: () =>
                        import ('../views/AI-Service/BotSetting.vue')
                }
            ]
        }
    ]
})

export default router
