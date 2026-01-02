<script setup>
import { reactive } from 'vue';

const form = reactive({
  bannerPreview: null,
  bgPreview: null,
  date: '',
  time: '',
  location: '',
  shortLink: ''
});

const onFileChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'banner') form.bannerPreview = event.target.result;
      if (type === 'bg') form.bgPreview = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="registration-setting">
    <div class="page-header">
      <h2 class="title">1. 報名頁面設定</h2>
      <button class="btn-primary-rounded">點擊預覽</button>
    </div>

    <div class="settings-grid">
      <div class="tech-card">
        <div class="input-block">
          <label>(1) 活動 BANNER</label>
          <label class="upload-box banner-box" :style="{ backgroundImage: `url(${form.bannerPreview})` }">
            <input type="file" @change="onFileChange($event, 'banner')" hidden />
            <div v-if="!form.bannerPreview" class="placeholder">點擊上傳 BANNER</div>
          </label>
        </div>
        <div class="input-block">
          <label>(2) 活動底圖</label>
          <label class="upload-box bg-box" :style="{ backgroundImage: `url(${form.bgPreview})` }">
            <input type="file" @change="onFileChange($event, 'bg')" hidden />
            <div v-if="!form.bgPreview" class="placeholder">點擊上傳背景圖</div>
          </label>
        </div>
      </div>

      <div class="tech-card">
        <div class="input-block">
          <label>(3) 活動資訊</label>
          <div class="row-flex">
            <input v-model="form.date" type="date" class="input-rounded" />
            <input v-model="form.time" type="time" class="input-rounded" />
          </div>
          <input v-model="form.location" type="text" placeholder="活動地點" class="input-rounded mt-12" />
        </div>

        <div class="input-block mt-32">
          <label>(4) 產出報名頁短連結</label>
          <div class="shortlink-group">
            <span class="prefix">https://reg.event/</span>
            <input v-model="form.shortLink" type="text" placeholder="自定義名稱" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  .title { font-weight: 700; color: var(--text-main); }
}
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.input-block {
  margin-bottom: 20px;
  label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; }
}
.upload-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  background: #f8fafc;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  &.banner-box { height: 180px; }
  &.bg-box { height: 100px; }
  .placeholder { color: var(--text-muted); font-size: 0.8rem; }
}
.row-flex { display: flex; gap: 12px; }
.mt-12 { margin-top: 12px; }
.mt-32 { margin-top: 32px; }
.shortlink-group {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  .prefix { padding: 12px; background: #e2e8f0; color: var(--text-muted); font-size: 0.8rem; }
  input { border: none; background: transparent; padding: 12px; flex: 1; outline: none; }
}
</style>
