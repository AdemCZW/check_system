<script setup>
import { reactive, ref } from 'vue';

// 初始欄位資料
const fields = reactive([
  { id: 1, label: '姓名', type: 'text', required: true, isFixed: true },
  { id: 2, label: '電子信箱', type: 'email', required: true, isFixed: true },
  { id: 3, label: '行動電話', type: 'tel', required: true, isFixed: false }
]);

const newFieldLabel = ref('');
const newFieldType = ref('text');

// 新增欄位功能
const addField = () => {
  if (!newFieldLabel.value) return;
  fields.push({
    id: Date.now(),
    label: newFieldLabel.value,
    type: newFieldType.value,
    required: false,
    isFixed: false
  });
  newFieldLabel.value = '';
};

const removeField = (index) => {
  fields.splice(index, 1);
};
</script>

<template>
  <div class="fields-config">
    <div class="page-header">
      <h2 class="title">3. 報名表欄位設定</h2>
      <div class="header-actions">
        <span class="status-tag">自動儲存中</span>
      </div>
    </div>

    <div class="config-layout">
      <div class="edit-panel tech-card">
        <div class="section-title">自定義表單欄位</div>

        <div class="field-list">
          <div v-for="(field, index) in fields" :key="field.id" class="field-card">
            <div class="field-main">
              <span class="drag-icon">⠿</span>
              <div class="field-content">
                <input
                  v-model="field.label"
                  :disabled="field.isFixed"
                  class="field-label-input"
                  placeholder="欄位名稱"
                />
                <span class="type-badge">{{ field.type }}</span>
              </div>
            </div>

            <div class="field-ctrl">
              <label class="req-toggle">
                <input type="checkbox" v-model="field.required" />
                <span>必填</span>
              </label>
              <button
                v-if="!field.isFixed"
                @click="removeField(index)"
                class="delete-btn"
              >✕</button>
            </div>
          </div>
        </div>

        <div class="add-control">
          <input v-model="newFieldLabel" placeholder="輸入新欄位名稱..." class="input-rounded" />
          <select v-model="newFieldType" class="select-rounded">
            <option value="text">文字輸入</option>
            <option value="tel">電話號碼</option>
            <option value="select">下拉選單</option>
          </select>
          <button @click="addField" class="btn-add">+</button>
        </div>
      </div>

      <div class="preview-panel">
        <div class="phone-frame">
          <div class="phone-screen">
            <div class="phone-header">活動報名表</div>
            <div class="phone-content">
              <div v-for="field in fields" :key="field.id" class="preview-item">
                <label>{{ field.label }} <span v-if="field.required" class="star">*</span></label>
                <div class="dummy-input"></div>
              </div>
              <button class="dummy-submit">確認報名</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.config-layout { display: grid; grid-template-columns: 1fr 360px; gap: 30px; }
.section-title { font-weight: 600; color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem; }

.field-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8fafc;
  border-radius: 14px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;

  .field-main {
    display: flex;
    align-items: center;
    gap: 15px;
    .drag-icon { color: #cbd5e1; cursor: grab; }
    .field-label-input {
      border: none; background: transparent; font-weight: 600; font-size: 1rem;
      &:focus { outline: none; border-bottom: 1px solid var(--accent-blue); }
    }
    .type-badge { font-size: 0.7rem; color: #94a3b8; background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
  }
}

.field-ctrl {
  display: flex;
  align-items: center;
  gap: 15px;
  .req-toggle { font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 5px; cursor: pointer; }
  .delete-btn { border: none; background: none; color: #f87171; cursor: pointer; font-size: 1.1rem; }
}

.add-control {
  margin-top: 25px;
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
  .btn-add {
    width: 45px; height: 45px; border-radius: 50%; border: none;
    background: var(--accent-blue); color: white; font-size: 1.5rem; cursor: pointer;
    box-shadow: 0 4px 10px rgba(56, 189, 248, 0.3);
  }
}

/* 手機預覽樣式 */
.phone-frame {
  background: #0f172a; padding: 12px; border-radius: 40px; border: 6px solid #334155;
  height: 600px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  .phone-screen { background: white; height: 100%; border-radius: 30px; overflow: hidden; display: flex; flex-direction: column; }
}
.phone-header { background: #f8fafc; padding: 15px; text-align: center; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
.phone-content {
  padding: 20px; flex: 1; overflow-y: auto;
  .preview-item { margin-bottom: 15px; label { font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 5px; .star { color: #f43f5e; } } }
  .dummy-input { height: 35px; background: #f1f5f9; border-radius: 8px; }
  .dummy-submit { width: 100%; padding: 12px; background: var(--accent-blue); color: white; border: none; border-radius: 10px; margin-top: 10px; font-weight: 600; }
}
</style>
