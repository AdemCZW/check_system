<script setup>
import { reactive, ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';

const activities = [{ id: 'act_01', name: '開幕典禮' }, { id: 'act_02', name: '高峰論壇' }];
const currentActivityId = ref('act_01');

// 賓客名單
const allParticipants = [
  { id: 'P01', name: '王小明', company: '文靜科技', serial: 'V001', type: 'VIP' },
  { id: 'P02', name: '李大華', company: '創新設計', serial: 'A052', type: 'Attendee' },
  { id: 'P03', name: '張美麗', company: '全球物流', serial: 'S003', type: 'Staff' },
  { id: 'P04', name: '陳小美', company: '文靜科技', serial: 'V004', type: 'VIP' },
];

// 設定初始行列數 (Row 為排，Col 為每排幾人)
const layout = reactive({ rows: 3, cols: 5 });

// 動態生成座位資料
const activitySeats = reactive({
  'act_01': Array.from({ length: 15 }, (_, i) => ({ id: `s-${i}`, label: `座-${i+1}`, attendee: [] })),
  'act_02': Array.from({ length: 15 }, (_, i) => ({ id: `s-${i}`, label: `座-${i+1}`, attendee: [] })),
});

// 新增座位邏輯
const addRow = () => {
  layout.rows++;
  const newCount = layout.rows * layout.cols;
  const currentSeats = activitySeats[currentActivityId.value];
  while(currentSeats.length < newCount) {
    const i = currentSeats.length;
    currentSeats.push({ id: `s-${Date.now()}-${i}`, label: `座-${i+1}`, attendee: [] });
  }
};

const addCol = () => {
  layout.cols++;
  const newCount = layout.rows * layout.cols;
  const currentSeats = activitySeats[currentActivityId.value];
  while(currentSeats.length < newCount) {
    const i = currentSeats.length;
    currentSeats.push({ id: `s-${Date.now()}-${i}`, label: `座-${i+1}`, attendee: [] });
  }
};

// 待分配名單連動
const unassignedList = ref([]);
const updateUnassignedList = () => {
  const currentSeats = activitySeats[currentActivityId.value];
  const seatedIds = currentSeats.filter(s => s.attendee.length > 0).map(s => s.attendee[0].id);
  unassignedList.value = allParticipants.filter(p => !seatedIds.includes(p.id));
};

watch(currentActivityId, () => updateUnassignedList(), { immediate: true });

// 互換邏輯
let sourceSeat = null;
const onDragStart = (seat) => { sourceSeat = seat; };
const onListDragStart = () => { sourceSeat = null; };
const onSeatAdd = (evt, targetSeat) => {
  if (targetSeat.attendee.length > 1) {
    const oldPerson = targetSeat.attendee[0];
    targetSeat.attendee.splice(0, 1);
    if (sourceSeat) { sourceSeat.attendee.push(oldPerson); }
    else { unassignedList.value.push(oldPerson); }
  }
  sourceSeat = null;
};

const handleRemove = (seat) => {
  if (seat.attendee.length > 0) {
    const person = seat.attendee[0];
    seat.attendee.splice(0, 1);
    unassignedList.value.push(person);
  }
};
</script>

<template>
  <div class="seating-view">
    <div class="page-header">
      <div class="title-group">
        <h2 class="title">6. 座次劃位管理</h2>
        <div class="activity-tabs">
          <button v-for="act in activities" :key="act.id"
            class="tab-btn" :class="{ active: currentActivityId === act.id }"
            @click="currentActivityId = act.id">{{ act.name }}</button>
        </div>
      </div>

      <div class="grid-controls">
        <button @click="addRow" class="ctrl-btn">+ 新增一排 (直)</button>
        <button @click="addCol" class="ctrl-btn">+ 新增一列 (橫)</button>
        <div class="grid-info">當前規模: {{ layout.rows }} x {{ layout.cols }}</div>
      </div>
    </div>

    <div class="editor-layout">
      <aside class="panel list-side">
        <div class="panel-header"><h3>賓客名單 ({{ unassignedList.length }})</h3></div>
        <draggable v-model="unassignedList" group="seatingGroup" item-key="id" class="drag-area"
          ghost-class="my-ghost" drag-class="my-drag" :animation="300" @start="onListDragStart">
          <template #item="{ element }">
            <div class="person-card">
              <div class="card-main"><span class="p-serial">#{{ element.serial }}</span> <span class="p-name">{{ element.name }}</span></div>
              <div class="p-company">{{ element.company }}</div>
            </div>
          </template>
        </draggable>
      </aside>

      <main class="panel map-side">
        <div class="stage-banner">STAGE 舞台</div>
        <div class="seats-grid" :style="{ gridTemplateColumns: `repeat(${layout.cols}, 110px)` }">
          <div v-for="seat in activitySeats[currentActivityId]" :key="seat.id" class="seat-item">
            <div class="seat-label">{{ seat.label }}</div>
            <draggable v-model="seat.attendee" group="seatingGroup" item-key="id" class="drop-zone"
              :class="{ 'is-filled': seat.attendee.length > 0 }" ghost-class="my-ghost" drag-class="my-drag"
              :animation="300" @start="onDragStart(seat)" @add="(evt) => onSeatAdd(evt, seat)">
              <template #item="{ element }">
                <div class="seated-card">
                  <div class="s-serial">{{ element.serial }}</div>
                  <div class="s-name">{{ element.name }}</div>
                  <button class="s-remove" @click.stop="handleRemove(seat)">✕</button>
                </div>
              </template>
              <template #header v-if="seat.attendee.length === 0">
                <div class="s-empty">空</div>
              </template>
            </draggable>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 樣式保持明亮與簡約 */
.seating-view { height: 100%; padding: 24px; background-color: #f4f7fa; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.activity-tabs { display: flex; gap: 8px; margin-top: 10px;
  .tab-btn { padding: 8px 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;
    &.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
  }
}

.grid-controls { display: flex; align-items: center; gap: 12px;
  .ctrl-btn { padding: 8px 12px; background: #fff; border: 1px solid #3b82f6; color: #3b82f6; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold;
    &:hover { background: #eff6ff; }
  }
  .grid-info { font-size: 0.8rem; color: #64748b; font-weight: bold; }
}

.editor-layout { display: flex; gap: 24px; height: calc(100vh - 200px); }
.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; }

/* 拖曳特效 CSS (保留) */
.my-ghost { opacity: 0.5; background: #ebf5ff !important; border: 2px dashed #3b82f6 !important; border-radius: 8px; * { opacity: 0; } }
.my-drag { cursor: grabbing; background: #3b82f6 !important; transform: rotate(3deg); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); * { color: white !important; } }

.list-side { width: 280px; }
.drag-area { flex: 1; padding: 16px; overflow-y: auto; }
.person-card { background: white; border: 1px solid #e2e8f0; padding: 12px; border-radius: 10px; margin-bottom: 12px; cursor: grab;
  .p-serial { font-size: 0.7rem; color: #3b82f6; font-weight: 800; background: #eff6ff; padding: 2px 4px; border-radius: 4px; }
  .p-name { font-weight: 700; margin-left: 5px; }
  .p-company { font-size: 0.75rem; color: #64748b; margin-top: 4px; }
}

.map-side { flex: 1; padding: 32px; overflow-y: auto; }
.stage-banner { background: #1e293b; color: white; text-align: center; padding: 8px; border-radius: 8px; margin-bottom: 30px; font-weight: 700; font-size: 0.8rem; }

/* 關鍵：透過內聯樣式控制 Grid */
.seats-grid {
  display: grid;
  gap: 20px;
  justify-content: center; /* 讓座位地圖居中 */
}

.drop-zone { width: 100px; height: 75px; background: #fff; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative;
  &.is-filled { border: 1px solid #3b82f6; background: #f0f7ff; border-style: solid; }
}
.seated-card { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
  .s-serial { font-size: 0.6rem; color: #3b82f6; font-weight: bold; }
  .s-name { font-size: 0.85rem; font-weight: 800; }
  .s-remove { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
}
.seat-label { font-size: 0.6rem; color: #94a3b8; margin-bottom: 4px; }
</style>
