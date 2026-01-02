<script setup>
import { reactive, ref, computed } from 'vue';
import * as XLSX from 'xlsx'; // 請確保已執行 npm install xlsx

// 1. 參與者數據
const participants = reactive([
  { id: '001', name: '王小明', company: '文靜科技', title: '技術總監', phone: '0912-345-678', email: 'wang@test.com', type: 'VIP', status: '已報到' },
  { id: '002', name: '李大華', company: '創新設計', title: '設計師', phone: '0922-111-222', email: 'lee@test.com', type: 'Attendee', status: '未報到' },
  { id: '003', name: '張美麗', company: '全球物流', title: '行銷經理', phone: '0933-444-555', email: 'chang@test.com', type: 'Staff', status: '已報到' },
]);

// 2. 搜尋與過濾
const searchQuery = ref('');
const filteredList = computed(() => {
  return participants.filter(p =>
    p.name.includes(searchQuery.value) || p.company.includes(searchQuery.value)
  );
});

// 3. 匯出 Excel 邏輯
const isExporting = ref(false);
const eventName = ref(import.meta.env.VITE_EVENT_NAME || '預設活動名稱');

const handleExport = () => {
  if (filteredList.value.length === 0) return alert('目前沒有資料可匯出');

  isExporting.value = true;

  // 生成檔名：活動名稱_日期
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `${eventName.value}_參與者資訊_${dateStr}.xlsx`;

  // 整理資料：只匯出需要的欄位名稱
  const exportData = filteredList.value.map(p => ({
    '編號': p.id,
    '姓名': p.name,
    '單位': p.company,
    '職稱': p.title,
    '電話': p.phone,
    'Email': p.email,
    '身分': p.type,
    '報到狀態': p.status
  }));

  // 執行匯出
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  setTimeout(() => {
    XLSX.writeFile(workbook, fileName);
    isExporting.value = false;
  }, 800);
};
</script>

<template>
  <div class="participants-view">
    <div class="page-header">
      <div class="title-group">
        <h2 class="title">5. 參與者資訊管理</h2>
        <p class="subtitle">共計 {{ participants.length }} 位參與者</p>
      </div>
      <div class="header-actions">
        <button
          class="btn-export"
          :disabled="isExporting"
          @click="handleExport"
        >
          <span class="icon">📊</span>
          {{ isExporting ? '處理中...' : '匯出 Excel 表單' }}
        </button>
        <button class="btn-primary-rounded">新增參與者</button>
      </div>
    </div>

    <div class="tech-card filter-bar">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" placeholder="搜尋姓名、公司或職稱..." class="search-input" />
      </div>
      <div class="filter-options">
        <select class="select-rounded"><option>所有身分</option></select>
        <select class="select-rounded"><option>所有狀態</option></select>
      </div>
    </div>

    <div class="tech-card table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>公司單位</th>
            <th>聯絡電話</th>
            <th>身分</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredList" :key="p.id">
            <td>
              <div class="name-cell">
                <span class="avatar">{{ p.name.charAt(0) }}</span>
                <div>
                  <div class="name">{{ p.name }}</div>
                  <div class="email">{{ p.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="comp">{{ p.company }}</div>
              <div class="title-sub">{{ p.title }}</div>
            </td>
            <td>{{ p.phone }}</td>
            <td><span :class="['tag', p.type.toLowerCase()]">{{ p.type }}</span></td>
            <td><span :class="['status-dot', p.status === '已報到' ? 'check' : '']">{{ p.status }}</span></td>
            <td>
              <button class="btn-text">編輯</button>
              <button class="btn-text danger">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 頁面標題與匯出按鈕樣式 */
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
}
.header-actions { display: flex; gap: 12px; }

.btn-export {
  background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;
  padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: 0.3s;
  &:hover { background: #dcfce7; transform: translateY(-2px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* 搜尋列樣式 */
.filter-bar {
  display: flex; justify-content: space-between; align-items: center; padding: 15px 24px; margin-bottom: 20px;
  .search-wrapper {
    position: relative; flex: 1; max-width: 400px;
    .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input { width: 100%; padding: 10px 15px 10px 45px; border: 1.5px solid #f1f5f9; border-radius: 12px; background: #f8fafc; }
  }
  .filter-options { display: flex; gap: 10px; }
}

/* 表格設計細節 */
.table-container { padding: 0; overflow: hidden; }
.data-table {
  width: 100%; border-collapse: collapse;
  th { background: #f8fafc; text-align: left; padding: 16px 24px; font-size: 0.85rem; color: #64748b; font-weight: 700; }
  td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
}

.name-cell {
  display: flex; align-items: center; gap: 12px;
  .avatar { width: 36px; height: 36px; background: #e0f2fe; color: #0369a1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
  .name { font-weight: 700; color: #1e293b; }
  .email { font-size: 0.75rem; color: #94a3b8; }
}

.comp { font-weight: 600; color: #334155; }
.title-sub { font-size: 0.75rem; color: #94a3b8; }

/* 標籤與狀態 */
.tag { font-size: 0.7rem; padding: 4px 10px; border-radius: 6px; font-weight: 800;
  &.vip { background: #fef3c7; color: #d97706; }
  &.attendee { background: #e0f2fe; color: #0369a1; }
}
.status-dot {
  position: relative; padding-left: 15px; color: #94a3b8;
  &::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; background: #cbd5e1; border-radius: 50%; }
  &.check { color: #10b981; font-weight: 600; &::before { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); } }
}

.btn-text { background: none; border: none; font-weight: 700; color: #64748b; cursor: pointer; margin-right: 10px; &:hover { color: #1e293b; } &.danger:hover { color: #ef4444; } }
</style>
