<script setup>
import { reactive, ref, computed } from 'vue';

// 1. 原始總名單
const allParticipants = reactive([
  { id: 'P01', name: '王小明', company: '文靜科技股份有限公司', title: '技術總監', type: 'VIP', code: 'EV-001' },
  { id: 'P02', name: '李大華', company: '創新數位設計', title: '資深設計師', type: 'Attendee', code: 'EV-002' },
  { id: 'P03', name: '張美麗', company: '全球物流系統', title: '行銷經理', type: 'Staff', code: 'EV-003' },
  { id: 'P04', name: '林志玲', company: '時尚媒體公司', title: '創意總監', type: 'VIP', code: 'EV-004' },
  { id: 'P05', name: '周杰倫', company: '音樂工作室', title: '製作人', type: 'Attendee', code: 'EV-005' },
  { id: 'P06', name: '蔡依林', company: '舞曲天后經紀', title: '藝人總監', type: 'VIP', code: 'EV-006' },
  { id: 'P07', name: '羅志祥', company: '亞洲舞王娛樂', title: '藝人代表', type: 'Staff', code: 'EV-007' },
  { id: 'P08', name: '蕭敬騰', company: '搖滾音樂製作', title: '音樂總監', type: 'Attendee', code: 'EV-008' }
]);

// 2. 狀態控制
const searchQuery = ref('');
const selectedIds = ref([]); // 存放選中的 ID

// 3. 搜尋過濾邏輯
const filteredParticipants = computed(() => {
  return allParticipants.filter(p =>
    p.name.includes(searchQuery.value) || p.company.includes(searchQuery.value)
  );
});

// 4. 取得被選中的完整物件 (用於列印預覽)
const selectedParticipants = computed(() => {
  return allParticipants.filter(p => selectedIds.value.includes(p.id));
});

// 5. 全選邏輯
const toggleAll = (event) => {
  if (event.target.checked) {
    selectedIds.value = filteredParticipants.value.map(p => p.id);
  } else {
    selectedIds.value = [];
  }
};

const handlePrint = () => {
  if (selectedIds.value.length === 0) {
    alert('請先勾選要列印的人員！');
    return;
  }
  window.print();
};
</script>

<template>
  <div class="badge-printer-view">
    <div class="page-header no-print">
      <div class="title-group">
        <h2 class="title">7. 識別證列印管理</h2>
        <p class="subtitle">請從左側名單勾選人員，右側將自動產生預覽</p>
      </div>
      <button class="btn-primary-rounded" :disabled="selectedIds.length === 0" @click="handlePrint">
        <span class="icon">🖨️</span> 確認列印 ({{ selectedIds.length }})
      </button>
    </div>

    <div class="main-layout">
      <div class="selection-panel tech-card no-print">
        <div class="search-box">
          <input v-model="searchQuery" class="input-rounded w-full" placeholder="搜尋姓名或單位..." />
        </div>

        <div class="list-header">
          <label class="checkbox-container">
            <input type="checkbox" @change="toggleAll" :checked="selectedIds.length === filteredParticipants.length && filteredParticipants.length > 0">
            <span class="checkmark"></span>
            全選
          </label>
          <span class="count">已選 {{ selectedIds.length }} 人</span>
        </div>

        <div class="participant-selector">
          <div v-for="p in filteredParticipants" :key="p.id" :class="['p-item', { active: selectedIds.includes(p.id) }]">
            <label class="checkbox-container">
              <input type="checkbox" v-model="selectedIds" :value="p.id">
              <span class="checkmark"></span>
              <div class="p-info">
                <span class="name">{{ p.name }}</span>
                <span class="comp">{{ p.company }}</span>
              </div>
              <span :class="['badge-tag', p.type.toLowerCase()]">{{ p.type }}</span>
            </label>
          </div>
          <div v-if="filteredParticipants.length === 0" class="empty-list">
            無符合條件的參與者
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div v-if="selectedParticipants.length === 0" class="empty-preview no-print">
          <div class="icon">📄</div>
          <p>尚未勾選人員<br>請從左側名單選取以產生識別證</p>
        </div>

        <div class="badge-print-grid">
          <div v-for="p in selectedParticipants" :key="p.id" class="badge-card">
            <div class="badge-header">2026 數位轉型峰會</div>
            <div class="badge-body">
              <div class="qr-code-box">QR CODE<br>{{ p.code }}</div>
              <h1 class="guest-name">{{ p.name }}</h1>
              <p class="guest-title">{{ p.title }}</p>
              <p class="guest-company">{{ p.company }}</p>
            </div>
            <div :class="['badge-footer', p.type.toLowerCase()]">{{ p.type }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ======================== 螢幕顯示樣式 ======================== */
.badge-printer-view { padding: 5px; }
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
  background: white; padding: 20px 24px; border-radius: 20px; border: 1px solid #f1f5f9;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  .title-group {
    .subtitle { font-size: 0.85rem; color: #64748b; margin-top: 5px; }
  }
}

.main-layout { display: grid; grid-template-columns: 350px 1fr; gap: 24px; align-items: start; }

/* 左側：選擇面板 */
.selection-panel {
  padding: 20px; height: calc(100vh - 180px); display: flex; flex-direction: column;
  overflow: hidden; // 防止內部滾動條影響整體佈局

  .search-box { margin-bottom: 15px; }
  .list-header {
    display: flex; justify-content: space-between; padding: 10px;
    border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: #64748b; font-weight: 600;
  }
}

.participant-selector {
  flex: 1; overflow-y: auto; margin-top: 10px; // 列表可滾動
  padding-right: 5px; // 預留滾動條空間
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  .p-item {
    padding: 12px; border-radius: 12px; margin-bottom: 6px; transition: 0.2s;
    &:hover { background: #f8fafc; }
    &.active { background: #e0f2fe; border: 1px solid #90cdf4; } // 選中狀態更明顯

    .checkbox-container {
      display: flex; align-items: center; cursor: pointer; width: 100%;
      .p-info { flex: 1; margin: 0 12px; display: flex; flex-direction: column;
        .name { font-weight: 700; color: #1e293b; }
        .comp { font-size: 0.75rem; color: #94a3b8; }
      }
    }
  }
  .empty-list { text-align: center; color: #cbd5e1; padding: 30px 0; }
}

.badge-tag {
  font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 800;
  &.vip { background: #fef3c7; color: #d97706; }
  &.staff { background: #f1f5f9; color: #475569; }
  &.attendee { background: #e0f2fe; color: #0369a1; }
}

/* 右側：預覽面板 */
.preview-panel {
  background: #f1f5f9; padding: 30px; border-radius: 24px; min-height: calc(100vh - 120px);
  display: flex; justify-content: center; align-items: flex-start; // 識別證從頂部開始排
  overflow-y: auto; // 預覽區塊可滾動
}

.empty-preview {
  text-align: center; color: #94a3b8; margin-top: 100px;
  .icon { font-size: 3rem; margin-bottom: 20px; color: #cbd5e1; }
  p { line-height: 1.6; }
}

/* 識別證排版與樣式 (螢幕預覽用) */
.badge-print-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); // 一行兩張
  gap: 20px; // 識別證間距
  width: 100%; // 預覽區塊佔滿可用寬度
  max-width: 210mm; // 限制最大寬度為 A4 寬度
  padding: 10px; // 讓邊緣有呼吸空間
}

.badge-card {
  width: 90mm; // 識別證寬度
  height: 125mm; // 識別證高度
  background: white; border: 1px solid #e2e8f0; border-radius: 10px;
  display: flex; flex-direction: column; text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08); // 輕微陰影
  overflow: hidden;

  .badge-header { background: #0ea5e9; color: white; padding: 10px; font-size: 0.8rem; font-weight: 800; }
  .badge-body { flex: 1; padding: 25px 20px; display: flex; flex-direction: column; justify-content: center; align-items: center;
    .qr-code-box {
      width: 90px; height: 90px; background: #f8fafc; margin-bottom: 18px;
      border: 1px dashed #e2e8f0; display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; color: #cbd5e1; font-family: monospace; line-height: 1.4;
    }
    .guest-name { font-size: 2.2rem; font-weight: 900; margin: 0; color: #1e293b; line-height: 1.2; }
    .guest-title { color: #64748b; font-weight: 600; margin-top: 8px; font-size: 1rem; }
    .guest-company { color: #94a3b8; font-size: 0.9rem; margin-top: 10px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  }
  .badge-footer { background: #1e293b; color: white; padding: 8px; font-weight: 800; font-size: 0.9rem; text-transform: uppercase;
    &.vip { background: #f59e0b; }
    &.staff { background: #64748b; }
    &.attendee { background: #0ea5e9; }
  }
}

/* ======================== 列印專用媒體查詢 ======================== */
@media print {
  /* 隱藏所有非列印內容 */
  .no-print { display: none !important; }

  /* 重置 body 和 html 基礎樣式，確保乾淨列印 */
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%;
    overflow: hidden; /* 防止列印時出現多餘滾動條 */
    background: white !important; /* 強制背景為白色 */
  }

  /* 調整主要佈局，只顯示識別證 */
  .main-layout { display: block; width: 100%; margin: 0; padding: 0; }
  .preview-panel { padding: 0; background: none; display: block; width: 100%; min-height: unset; overflow: visible; }

  /* 識別證網格排版 (核心) */
  .badge-print-grid {
    display: grid;
    grid-template-columns: repeat(2, 105mm); /* A4 寬度約 210mm，兩欄各 105mm */
    grid-template-rows: repeat(2, 148.5mm); /* A4 高度約 297mm，兩列各 148.5mm */
    width: 210mm; /* 確保佔滿 A4 寬度 */
    height: 297mm; /* 確保佔滿 A4 高度 */
    margin: 0; padding: 0; /* 無內邊距 */
    gap: 0; /* 識別證之間無間距 */
    page-break-after: always; /* 每頁印完後換頁 */
  }

  /* 識別證卡片在列印時的精確尺寸和樣式 */
  .badge-card {
    width: 100mm; /* 每個識別證佔據 A4 頁面的一半寬度，留邊 */
    height: 140mm; /* 每個識別證佔據 A4 頁面的一半高度，留邊 */
    margin: 4.25mm 2.5mm; /* 微調邊距，使四個識別證能在 A4 上居中且有足夠裁切空間 */
    border: 1px solid #ccc; /* 列印時顯示淺邊框，方便裁切 */
    border-radius: 0; /* 列印時移除圓角，方便裁切 */
    box-shadow: none; /* 列印時移除陰影 */
    page-break-inside: avoid; /* 避免識別證被跨頁切斷 */

    .badge-header { height: 35px; font-size: 0.75rem; }
    .badge-body {
      padding: 15px 10px; // 列印時內邊距稍小
      .qr-code-box { width: 80px; height: 80px; font-size: 0.6rem; margin-bottom: 15px; }
      .guest-name { font-size: 2rem; } // 列印時字體稍小
      .guest-title { font-size: 0.9rem; }
      .guest-company { font-size: 0.8rem; }
    }
    .badge-footer { height: 30px; font-size: 0.8rem; }
  }
}
</style>
