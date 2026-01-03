import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }) => {
    return {
        // 關鍵修改：必須完全匹配您的 GitHub 倉庫名稱 check_system
        // 使用 '/' 是為了開發環境，'/check_system/' 是為了 GitHub Pages 生產環境
        base: mode === 'production' ? '/check_system/' : '/',

        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src',
                    import.meta.url))
            },
        },
        build: {
            outDir: 'docs', // 輸出到 docs 資料夾
            emptyOutDir: true, // 每次打包先清空舊檔
            // 建議加入以下設定，防止 GitHub Pages 找不到 _ 開頭的資料夾 (如 _plugin-vue_export-helper)
            assetsDir: 'assets',
        }
    }
})
