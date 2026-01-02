import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
    // 如果您的 GitHub 專案網址是 https://帳號.github.io/repo-name/
    // 請把下面的 'repo-name' 改成您的倉庫名稱
    base: process.env.NODE_ENV === 'production' ? '/event-registration-system/' : '/',

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
        // 關鍵修改：將輸出目錄從預設的 'dist' 改為 'docs'
        outDir: 'docs',
        // 確保每次打包都會先清空舊的 docs
        emptyOutDir: true,
    }
})
