<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 依據文件規範定義的八大功能模組
const menuItems = [
  // --- 報名與活動設定 ---
  { id: 1, name: '報名頁面設定', path: '/admin/registration-setting', icon: '📝' },
  { id: 2, name: '參與貴賓', path: '/admin/guests', icon: '👤' },
  { id: 3, name: '報名表欄位', path: '/admin/form-fields', icon: '📋' },
  { id: 4, name: '通知信設定', path: '/admin/notifications', icon: '✉️' },

  // --- 名單與現場管理 ---
  { id: 5, name: '參與者資訊', path: '/admin/participants', icon: '👥' },
  { id: 6, name: '現場報到紀錄', path: '/admin/checkin-history', icon: '✅' }, // 新增頁面
  { id: 7, name: '識別證列印', path: '/admin/badge-printing', icon: '🖨️' },

  // --- 互動與其他設定 ---
  { id: 8, name: '中獎名單管理', path: '/admin/lottery-winners', icon: '🎁' }, // 新增頁面
  { id: 9, name: '主辦單位資訊', path: '/admin/organizer-info', icon: '🏢' },
  { id: 10, name: 'AI客服設定', path: '/admin/ai-service', icon: '🤖' }
];

const navigateTo = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-box"></div>
        <h2 class="system-name">報到系統</h2>
      </div>

      <nav class="menu">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          :class="{ active: route.path === item.path }"
          @click="navigateTo(item.path)"
        >
          <span class="index">{{ item.id }}.</span>
          <span class="label">{{ item.name }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="navigateTo('/login')">LOGOUT</button>
      </div>
    </aside>

    <main class="content-area">
      <header class="content-header">
        <div class="breadcrumb">
          {{ menuItems.find(m => m.path === route.path)?.name || '控制台' }}
        </div>
      </header>

      <section class="view-port">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-header {
    padding: 30px 24px;
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-box {
      width: 32px;
      height: 32px;
      background: var(--accent-blue);
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    }

    .system-name {
      font-size: 1.1rem;
      letter-spacing: 2px;
      color: var(--text-main);
      margin: 0;
    }
  }
}

.menu {
  flex: 1;
  padding: 0 12px;

  .menu-item {
    padding: 14px 20px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-muted);
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;

    .index {
      font-family: 'Monaco', monospace;
      margin-right: 12px;
      font-size: 0.85rem;
      opacity: 0.7;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-main);
    }

    &.active {
      background: rgba(56, 189, 248, 0.08);
      color: var(--accent-blue);
      border-left: 3px solid var(--accent-blue);
    }
  }
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);

  .logout-btn {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.8rem;
    letter-spacing: 2px;
    transition: var(--transition-smooth);

    &:hover {
      border-color: #f87171;
      color: #f87171;
      background: rgba(248, 113, 113, 0.05);
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);

  .breadcrumb {
    color: var(--text-muted);
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 300;
  }
}

.view-port {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background: var(--bg-primary);
}

/* 頁面切換動畫 */
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
