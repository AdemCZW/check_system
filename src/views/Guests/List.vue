<script setup>
import { reactive, ref, computed } from 'vue';

const activityOptions = ref(['所有活動', '2025 技術峰會', 'AI 產業論壇']);
const selectedActivity = ref('所有活動');
const sortBy = ref('newest');

const guests = reactive([
  { id: 1, name: '張小明', company: '文靜科技', title: 'CTO', activity: '2025 技術峰會', createdAt: '2025-12-29 14:00' }
]);

const formatDate = (dateStr) => dateStr || '--';

const filteredGuests = computed(() => {
  let result = [...guests];
  if (selectedActivity.value !== '所有活動') result = result.filter(g => g.activity === selectedActivity.value);
  if (sortBy.value === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
});

const addGuest = () => {
  const now = new Date();
  guests.push({
    id: Date.now(),
    name: '', company: '', title: '',
    activity: selectedActivity.value === '所有活動' ? activityOptions.value[1] : selectedActivity.value,
    createdAt: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
  });
};
</script>

<template>
  <div class="guests-view">
    <div class="control-bar tech-card">
      <div class="filter-group">
        <select v-model="selectedActivity" class="select-rounded">
          <option v-for="opt in activityOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <select v-model="sortBy" class="select-rounded">
          <option value="newest">最新加入</option>
          <option value="name">姓名排序</option>
        </select>
      </div>
      <button class="btn-primary-rounded" @click="addGuest">+ 新增貴賓</button>
    </div>

    <div class="guests-grid">
      <div v-for="guest in filteredGuests" :key="guest.id" class="tech-card guest-item">
        <div class="photo-section">
          <div class="avatar-upload"><span>+</span></div>
          <div class="activity-tag">{{ guest.activity }}</div>
        </div>
        <div class="info-section">
          <input v-model="guest.name" placeholder="姓名" class="input-rounded mb-8" />
          <input v-model="guest.company" placeholder="公司" class="input-rounded mb-8" />
          <div class="join-time">加入時間：{{ formatDate(guest.createdAt) }}</div>
        </div>
        <button class="btn-delete" @click="guests.splice(guests.indexOf(guest), 1)">✕</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.control-bar { display: flex; justify-content: space-between; margin-bottom: 24px; padding: 15px 25px; }
.filter-group { display: flex; gap: 12px; }
.guests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
.guest-item { display: flex; gap: 20px; position: relative; padding: 20px; .btn-delete { position: absolute; top: 10px; right: 10px; border: none; background: none; color: #f87171; cursor: pointer; } }
.photo-section { display: flex; flex-direction: column; align-items: center; gap: 10px; .avatar-upload { width: 70px; height: 70px; border-radius: 50%; background: #f1f5f9; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; } .activity-tag { font-size: 0.7rem; background: #e0f2fe; color: #0ea5e9; padding: 2px 8px; border-radius: 50px; } }
.info-section { flex: 1; .join-time { font-size: 0.7rem; color: #94a3b8; margin-top: 10px; } }
.mb-8 { margin-bottom: 8px; }
.select-rounded { border-radius: 10px; padding: 8px; border: 1px solid var(--border-color); }
</style>
