<script setup>
import { reactive, ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';

// 1. 賓客名單 (保留原邏輯)
const allParticipants = reactive([
  { id: 'P01', name: '王小明', company: '文靜科技股份有限公司', title: '技術總監', type: 'VIP', code: 'EV-001' },
  { id: 'P02', name: '李大華', company: '創新數位設計', title: '資深設計師', type: 'Attendee', code: 'EV-002' },
  { id: 'P03', name: '張美麗', company: '全球物流系統', title: '行銷經理', type: 'Staff', code: 'EV-003' },
  { id: 'P04', name: '林志玲', company: '時尚媒體公司', title: '創意總監', type: 'VIP', code: 'EV-004' },
]);

const searchQuery = ref('');
const selectedIds = ref([]);
const filteredParticipants = computed(() => allParticipants.filter(p => p.name.includes(searchQuery.value) || p.company.includes(searchQuery.value)));
const selectedParticipants = computed(() => allParticipants.filter(p => selectedIds.value.includes(p.id)));

// 2. 隨意拖曳範本設定 (核心升級)
const activeElement = ref(null); // 當前正在編輯的元件
const templateElements = ref([
  { id: 't1', key: 'name', label: '姓名', x: 20, y: 180, style: { fontSize: 32, fontWeight: '900', color: '#1e293b' } },
  { id: 't2', key: 'company', label: '單位', x: 20, y: 240, style: { fontSize: 16, fontWeight: '400', color: '#64748b' } },
  { id: 't3', key: 'code', label: 'QR編碼', x: 110, y: 60, style: { fontSize: 12, fontWeight: '400', color: '#cbd5e1' } }
]);

// 3. 處理拖曳位置 (簡單實現：透過點擊選中並編輯)
const selectElement = (el) => { activeElement.value = el; };

// 4. 列印與全選邏輯
const toggleAll = (e) => selectedIds.value = e.target.checked ? filteredParticipants.value.map(p => p.id) : [];
const handlePrint = () => {
  if (selectedIds.value.length === 0) return alert('請先勾選人員！');
  window.print();
};
</script>

<template>
  <div class="badge-designer-view">
    <div class="page-header no-print">
      <div class="title-group">
        <h2 class="title">7. 識別證視覺化設計</h2>
        <p class="subtitle">拖動預覽區的元件調整位置，點擊元件修改樣式</p>
      </div>
      <button class="btn-print" :disabled="selectedIds.length === 0" @click="handlePrint">
        🖨️ 確認列印 ({{ selectedIds.length }})
      </button>
    </div>

    <div class="main-layout">
      <div class="selection-panel no-print">
        <input v-model="searchQuery" class="search-input" placeholder="搜尋姓名或單位..." />
        <div class="list-header">
          <label><input type="checkbox" @change="toggleAll"> 全選</label>
          <span>已選 {{ selectedIds.length }} 人</span>
        </div>
        <div class="participant-selector">
          <div v-for="p in filteredParticipants" :key="p.id" class="p-item" :class="{ active: selectedIds.includes(p.id) }">
            <input type="checkbox" v-model="selectedIds" :value="p.id">
            <div class="p-info">
              <span class="name">{{ p.name }}</span>
              <span class="comp">{{ p.company }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="design-canvas-area no-print">
        <div class="badge-canvas">
          <div class="canvas-title">範本設計預覽 (1:1)</div>
          <div class="canvas-box">
            <div v-for="el in templateElements" :key="el.id"
                 class="draggable-element"
                 :class="{ active: activeElement?.id === el.id }"
                 :style="{ left: el.x + 'px', top: el.y + 'px', fontSize: el.style.fontSize + 'px', fontWeight: el.style.fontWeight, color: el.style.color }"
                 @mousedown="selectElement(el)">
              {{ el.label === 'QR編碼' ? 'QR CODE' : `[${el.label}]` }}
              <div class="drag-handle" v-if="activeElement?.id === el.id"></div>
            </div>
          </div>
        </div>

        <div class="style-editor" v-if="activeElement">
          <h4>編輯：{{ activeElement.label }}</h4>
          <div class="controls">
            <label>大小: <input type="range" v-model="activeElement.style.fontSize" min="12" max="60"></label>
            <label>顏色: <input type="color" v-model="activeElement.style.color"></label>
            <label>X位移: <input type="number" v-model="activeElement.x"></label>
            <label>Y位移: <input type="number" v-model="activeElement.y"></label>
          </div>
        </div>
      </div>

      <div class="print-only-area">
        <div v-for="p in selectedParticipants" :key="p.id" class="print-badge">
          <div v-for="el in templateElements" :key="el.id"
               class="print-element"
               :style="{ left: el.x + 'px', top: el.y + 'px', fontSize: el.style.fontSize + 'px', fontWeight: el.style.fontWeight, color: el.style.color }">
            {{ el.key === 'name' ? p.name : el.key === 'company' ? p.company : p.code }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.badge-designer-view { padding: 20px; background: #f8fafc; min-height: 100vh; }
.main-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }

/* 左側面板 */
.selection-panel {
  background: white; border-radius: 16px; padding: 15px; border: 1px solid #e2e8f0; height: 80vh; display: flex; flex-direction: column;
  .search-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 10px; }
  .participant-selector { flex: 1; overflow-y: auto; }
  .p-item {
    display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; margin-bottom: 5px; border: 1px solid transparent;
    &.active { background: #eff6ff; border-color: #3b82f6; }
    .name { font-weight: bold; display: block; }
    .comp { font-size: 0.75rem; color: #64748b; }
  }
}

/* 設計畫布 */
.design-canvas-area {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  .badge-canvas {
    background: #cbd5e1; padding: 20px; border-radius: 8px;
    .canvas-box {
      width: 320px; height: 450px; background: white; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      .draggable-element {
        position: absolute; cursor: move; padding: 4px 8px; border: 1px dashed transparent; white-space: nowrap;
        &.active { border: 1px dashed #3b82f6; background: rgba(59, 130, 246, 0.05); }
      }
    }
  }
}

.style-editor {
  background: white; padding: 15px; border-radius: 12px; width: 100%; border: 1px solid #e2e8f0;
  .controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; font-size: 0.8rem; }
}

/* 列印邏輯 */
.print-only-area { display: none; }

@media print {
  .no-print { display: none !important; }
  .print-only-area {
    display: block;
    .print-badge {
      width: 90mm; height: 125mm; position: relative; page-break-after: always;
      background: white; border: 0.1mm solid #eee; // 列印裁切線
      .print-element { position: absolute; }
    }
  }
}

.btn-print {
  background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;
  &:disabled { background: #cbd5e1; cursor: not-allowed; }
}
</style>
