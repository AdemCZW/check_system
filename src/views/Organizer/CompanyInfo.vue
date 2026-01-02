<script setup>
import { reactive, ref } from 'vue';

// 主辦單位數據模型
const organizer = reactive({
  name: '數位轉型發展協會',
  shortName: 'DTA',
  taxId: '88776655',
  contactPerson: '陳大文',
  email: 'service@dta-org.tw',
  phone: '02-2345-6789',
  address: '台北市信義區信義路五段 7 號',
  website: 'https://www.dta-org.tw',
  bio: '致力於推動企業數位轉型與技術交流的非營利組織。',
  logoUrl: null,
  stampUrl: null
});

const isSaving = ref(false);

const handleSave = () => {
  isSaving.value = true;
  // 模擬 API 儲存動作
  setTimeout(() => {
    isSaving.value = false;
    alert('主辦單位資訊已更新！');
  }, 800);
};

// 模擬檔案上傳
const onFileChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    organizer[`${type}Url`] = URL.createObjectURL(file);
  }
};
</script>

<template>
  <div class="organizer-settings-view">
    <div class="page-header">
      <div class="title-group">
        <h2 class="title">9. 主辦單位資訊</h2>
        <p class="subtitle">設定將用於所有對外文件、識別證及 AI 知識庫</p>
      </div>
      <button class="btn-primary-rounded" :class="{ loading: isSaving }" @click="handleSave">
        {{ isSaving ? '儲存中...' : '儲存變更' }}
      </button>
    </div>

    <div class="settings-grid">
      <div class="main-column">
        <div class="tech-card">
          <h3 class="card-title">🏢 單位基本資料</h3>
          <div class="form-grid">
            <div class="form-group full">
              <label>全稱 (用於合約或報名表)</label>
              <input v-model="organizer.name" class="input-rounded" placeholder="例如：某某股份有限公司" />
            </div>
            <div class="form-group">
              <label>簡稱</label>
              <input v-model="organizer.shortName" class="input-rounded" />
            </div>
            <div class="form-group">
              <label>統一編號</label>
              <input v-model="organizer.taxId" class="input-rounded" />
            </div>
            <div class="form-group full">
              <label>單位簡介</label>
              <textarea v-model="organizer.bio" class="input-rounded" rows="3"></textarea>
            </div>
          </div>
        </div>

        <div class="tech-card mt-20">
          <h3 class="card-title">📞 聯絡與資訊</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>聯絡窗口</label>
              <input v-model="organizer.contactPerson" class="input-rounded" />
            </div>
            <div class="form-group">
              <label>聯絡電話</label>
              <input v-model="organizer.phone" class="input-rounded" />
            </div>
            <div class="form-group full">
              <label>聯絡信箱</label>
              <input v-model="organizer.email" class="input-rounded" />
            </div>
            <div class="form-group full">
              <label>官方網站</label>
              <input v-model="organizer.website" class="input-rounded" />
            </div>
            <div class="form-group full">
              <label>通訊地址</label>
              <input v-model="organizer.address" class="input-rounded" />
            </div>
          </div>
        </div>
      </div>

      <div class="side-column">
        <div class="tech-card brand-card">
          <h3 class="card-title">🎨 品牌視覺設定</h3>

          <div class="upload-item">
            <label>單位標誌 (Logo)</label>
            <div class="logo-preview" :style="{ backgroundImage: `url(${organizer.logoUrl})` }">
              <span v-if="!organizer.logoUrl">尚未上傳 Logo</span>
              <input type="file" @change="e => onFileChange(e, 'logo')" accept="image/*" />
            </div>
            <p class="upload-tip">建議比例 1:1 或橫式，透明背景 PNG</p>
          </div>

          <div class="upload-item mt-30">
            <label>單位印章 (用於電子憑證)</label>
            <div class="stamp-preview" :style="{ backgroundImage: `url(${organizer.stampUrl})` }">
              <span v-if="!organizer.stampUrl">尚未上傳印章</span>
              <input type="file" @change="e => onFileChange(e, 'stamp')" accept="image/*" />
            </div>
            <p class="upload-tip">建議使用紅色圓形或方型透明圖檔</p>
          </div>
        </div>

        <div class="tech-card helper-box mt-20">
          <h4>💡 溫馨提示</h4>
          <p>這裡設定的「單位名稱」會自動同步至 AI 客服的預設回覆中。確保聯絡信箱正確，以免漏掉報名通知。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.organizer-settings-view { padding: 5px; }

.settings-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.card-title { font-size: 1rem; font-weight: 700; margin-bottom: 24px; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  .full { grid-column: span 2; }
}

.form-group {
  label { display: block; font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 8px; }
  .input-rounded { width: 100%; border: 1.5px solid #e2e8f0; padding: 10px 15px; border-radius: 12px; transition: 0.3s;
    &:focus { border-color: #38bdf8; outline: none; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
  }
  textarea { resize: none; }
}

/* 上傳區域樣式 */
.upload-item {
  label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px; }
  .upload-tip { font-size: 0.75rem; color: #94a3b8; margin-top: 8px; }
}

.logo-preview, .stamp-preview {
  width: 100%; height: 160px; background-color: #f8fafc; border: 2px dashed #e2e8f0;
  border-radius: 16px; display: flex; align-items: center; justify-content: center;
  position: relative; background-size: contain; background-repeat: no-repeat; background-position: center;
  span { color: #cbd5e1; font-size: 0.9rem; }
  input { position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  &:hover { border-color: #38bdf8; background-color: #f0f9ff; }
}

.stamp-preview { height: 120px; width: 120px; margin: 0 auto; border-radius: 50%; }

.helper-box {
  background: #fffbeb; border: 1px solid #fef3c7;
  h4 { color: #92400e; font-size: 0.9rem; margin-bottom: 8px; }
  p { font-size: 0.8rem; color: #b45309; line-height: 1.6; }
}

.mt-20 { margin-top: 20px; }
.mt-30 { margin-top: 30px; }

/* 儲存按鈕動態 */
.loading { opacity: 0.7; pointer-events: none; }
</style>
