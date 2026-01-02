<script setup>
import { reactive, ref, computed } from 'vue';

// 1. 數據狀態
const stats = reactive({ total: 150, checkedIn: 88, pending: 62 });

// 2. 模擬參與者名單
const participants = reactive([
  { id: 'QR_882', name: '林志玲', phone: '0910-***-000', status: 'pending', seat: 'V-01' },
  { id: 'QR_156', name: '周杰倫', phone: '0922-***-333', status: 'pending', seat: 'V-02' },
  { id: 'P001', name: '王大同', phone: '0912-345-678', status: 'pending', seat: 'A-12' },
  { id: 'P002', name: '陳小美', phone: '0987-654-321', status: 'pending', seat: 'B-05' },
]);

// 3. 報到成功紀錄流
const logs = reactive([]);

const showModal = ref(false);
const searchName = ref('');
const checkInRate = computed(() => Math.round((stats.checkedIn / stats.total) * 100));

// 4. 搜尋與建議邏輯
const searchResult = computed(() => {
  if (!searchName.value) return [];
  return participants.filter(p => p.status === 'pending' && p.name.includes(searchName.value));
});

const pendingList = computed(() => {
  return participants.filter(p => p.status === 'pending').slice(0, 5);
});

// 5. 通用報到處理邏輯
const processCheckIn = (person, method) => {
  person.status = 'checked-in';
  const now = new Date();

  logs.unshift({
    id: Date.now(),
    name: person.name,
    time: now.toLocaleTimeString(),
    method: method,
    seat: person.seat || '現場安排'
  });

  stats.checkedIn++;
  stats.pending--;
  showModal.value = false;
  searchName.value = '';
};

const simulateQRScan = () => {
  const pendingOnes = participants.filter(p => p.status === 'pending');
  if (pendingOnes.length === 0) return alert('名單已全部報到');
  const luckyGuest = pendingOnes[Math.floor(Math.random() * pendingOnes.length)];
  processCheckIn(luckyGuest, 'QR Scan');
};
</script>

<template>
  <div class="checkin-view">
    <div class="page-header">
      <div class="title-group">
        <h2 class="title">6. 現場報到紀錄</h2>
        <span class="live-indicator">● LIVE 系統同步中</span>
      </div>
      <div class="header-actions">
        <button class="btn-qr-simulate" @click="simulateQRScan">
          <span class="icon">📱</span> 模擬 QR 掃描
        </button>
        <button class="btn-primary-rounded" @click="showModal = true">手動報到補錄</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="tech-card stat-item main-stat">
        <div class="stat-info">
          <span class="label">當前報到率</span>
          <div class="value">{{ checkInRate }}%</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: checkInRate + '%' }"></div>
        </div>
      </div>
      <div class="tech-card stat-mini">
        <span class="label">應到人數</span>
        <div class="number">{{ stats.total }}</div>
      </div>
      <div class="tech-card stat-mini accent">
        <span class="label">已報到</span>
        <div class="number">{{ stats.checkedIn }}</div>
      </div>
    </div>

    <div class="tech-card logs-container">
      <div class="card-header">
        <h3 class="subtitle">即時報到紀錄流</h3>
      </div>
      <div class="log-list">
        <transition-group name="list">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <span class="time">{{ log.time }}</span>
            <div class="user-info">
              <span class="name">{{ log.name }}</span>
              <span class="seat-badge">{{ log.seat }}</span>
            </div>
            <div :class="['method-tag', log.method === 'QR Scan' ? 'tag-qr' : 'tag-manual']">
              {{ log.method === 'QR Scan' ? '📱 QR 掃描' : '⌨️ 手動補錄' }}
            </div>
            <span class="status-ok">✅ 報到成功</span>
          </div>
        </transition-group>
        <div v-if="logs.length === 0" class="empty-state">等待報到數據中...</div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <div class="header-title">
              <span class="icon">🔍</span>
              <h3>手動報到搜尋</h3>
            </div>
            <button class="close-circle-btn" @click="showModal = false">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="search-wrapper">
              <input v-model="searchName" class="input-rounded w-full" placeholder="輸入姓名或關鍵字..." autofocus />
            </div>

            <div class="list-container">
              <p class="list-label">{{ searchName ? '搜尋結果' : '待報到建議名單' }}</p>

              <div v-for="p in (searchName ? searchResult : pendingList)" :key="p.id" class="person-row">
                <div class="person-info">
                  <span class="p-name">{{ p.name }}</span>
                  <span class="p-phone">{{ p.phone }}</span>
                </div>
                <button class="btn-check-action" @click="processCheckIn(p, 'Manual')">點擊報到</button>
              </div>

              <div v-if="searchName && searchResult.length === 0" class="no-result">查無未報到名單</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
/* 頁面基本配置 */
.checkin-view { padding: 5px; }
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  .title-group {
    .live-indicator { font-size: 0.75rem; color: #10b981; font-weight: 700; animation: blink 2s infinite; margin-top: 4px; display: block; }
  }
}
.header-actions { display: flex; gap: 12px; }

/* 按鈕樣式 */
.btn-qr-simulate {
  background: #1e293b; color: white; border: none; padding: 10px 22px; border-radius: 50px;
  font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s;
  &:hover { background: #000; transform: translateY(-2px); }
}

/* 儀表板 */
.stats-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.main-stat { padding: 24px; .stat-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px; .value { font-size: 2.8rem; font-weight: 800; color: #0ea5e9; line-height: 1; } } }
.progress-container { height: 12px; background: #f1f5f9; border-radius: 10px; overflow: hidden; .progress-bar { height: 100%; background: linear-gradient(90deg, #38bdf8, #0ea5e9); transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); } }
.stat-mini { text-align: center; padding: 24px; .label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; } .number { font-size: 2rem; font-weight: 800; color: #1e293b; } &.accent .number { color: #10b981; } }

/* 報到流 */
.logs-container { padding: 0; .card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; h3 { font-size: 1rem; font-weight: 700; } } }
.log-item {
  display: flex; align-items: center; padding: 16px 24px; border-bottom: 1px solid #f8fafc;
  .time { width: 90px; color: #94a3b8; font-family: 'Courier New', Courier, monospace; font-weight: 600; }
  .user-info { flex: 1; display: flex; align-items: center; .name { font-weight: 700; font-size: 1rem; } .seat-badge { margin-left: 10px; font-size: 0.7rem; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; color: #64748b; } }
  .method-tag { font-size: 0.75rem; padding: 4px 14px; border-radius: 50px; font-weight: 700; &.tag-qr { background: #e0f2fe; color: #0ea5e9; } &.tag-manual { background: #f1f5f9; color: #64748b; } }
  .status-ok { margin-left: 24px; color: #10b981; font-weight: 700; font-size: 0.85rem; }
}
.empty-state { padding: 60px; text-align: center; color: #cbd5e1; font-weight: 600; }

/* 核心：彈跳視窗 UI 設計 */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}
.modal-card {
  width: 500px; background: white; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  overflow: hidden; animation: modal-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-header {
  padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
  .header-title { display: flex; align-items: center; gap: 12px; h3 { margin: 0; font-size: 1.2rem; font-weight: 800; color: #1e293b; } }
}
.close-circle-btn {
  width: 40px; height: 40px; border-radius: 50%; border: none; background: #f1f5f9; color: #94a3b8;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;
  &:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }
}
.modal-body {
  padding: 24px;
  .search-wrapper { margin-bottom: 24px; .w-full { width: 100%; } }
}
.list-label { font-size: 0.75rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.person-row {
  display: flex; justify-content: space-between; align-items: center; padding: 14px 18px;
  background: #f8fafc; border-radius: 16px; margin-bottom: 10px; border: 1px solid transparent; transition: 0.2s;
  &:hover { background: white; border-color: #38bdf8; box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1); }
  .person-info { display: flex; flex-direction: column; .p-name { font-weight: 700; color: #1e293b; } .p-phone { font-size: 0.8rem; color: #94a3b8; } }
}
.btn-check-action {
  background: #38bdf8; color: white; border: none; padding: 8px 18px; border-radius: 10px;
  font-weight: 700; cursor: pointer; transition: 0.2s;
  &:hover { background: #0ea5e9; transform: scale(1.05); }
}

/* 動畫定義 */
@keyframes blink { 50% { opacity: 0.4; } }
@keyframes modal-slide { from { transform: translateY(30px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
.list-enter-active { transition: all 0.5s ease; }
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
