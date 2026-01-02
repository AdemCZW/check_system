<script setup>
import { reactive } from 'vue';

// 通知信資料模型
const mailSettings = reactive({
  subject: '【報名成功通知】感謝您參與本次活動',
  senderName: '活動小辦公室',
  content: '親愛的 {name} 您好：\n\n感謝您報名參加 {event_name}。\n您的專屬報名序號為：{order_id}\n\n活動地點：{location}\n活動時間：{date} {time}\n\n期待您的蒞臨！',
  enableAutoSend: true
});

// 複製標籤到剪貼簿的功能
const copyTag = (tag) => {
  navigator.clipboard.writeText(tag);
  alert(`已複製變數：${tag}\n請貼上至郵件內容中。`);
};

const saveSettings = () => {
  alert('通知信設定儲存成功！');
};
</script>

<template>
  <div class="email-editor-view">
    <div class="page-header">
      <h2 class="title">4. 通知信設定</h2>
      <button class="btn-primary-rounded" @click="saveSettings">儲存郵件樣板</button>
    </div>

    <div class="editor-layout">
      <div class="tech-card config-side">
        <h3 class="section-title">發送參數設定</h3>

        <div class="input-block">
          <label>郵件主旨</label>
          <input v-model="mailSettings.subject" class="input-rounded" placeholder="請輸入郵件標題" />
        </div>

        <div class="input-block">
          <label>發件人名稱</label>
          <input v-model="mailSettings.senderName" class="input-rounded" placeholder="顯示於收件人的名稱" />
        </div>

        <div class="status-card">
          <div class="status-info">
            <span class="status-label">報名完成即刻發送</span>
            <p class="status-desc">關閉後需手動於名單中發送</p>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="mailSettings.enableAutoSend">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="tech-card editor-side">
        <h3 class="section-title">郵件內文編輯</h3>

        <div class="variable-container">
          <span class="hint">點擊複製變數：</span>
          <div class="tags">
            <button class="tag" @click="copyTag('{name}')">{name} 姓名</button>
            <button class="tag" @click="copyTag('{event_name}')">{event_name} 活動名</button>
            <button class="tag" @click="copyTag('{order_id}')">{order_id} 序號</button>
            <button class="tag" @click="copyTag('{date}')">{date} 日期</button>
          </div>
        </div>

        <textarea
          v-model="mailSettings.content"
          class="mail-textarea"
          placeholder="在此輸入郵件本文..."
        ></textarea>

        <div class="preview-footer">
          <p>※ 系統將自動帶入對應資訊至大括號變數中</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
}

.section-title {
  font-size: 0.95rem;
  color: var(--text-main);
  margin-bottom: 20px;
  border-left: 4px solid var(--accent-blue);
  padding-left: 12px;
}

.input-block {
  margin-bottom: 20px;
  label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; }
  input { width: 100%; }
}

.status-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f9ff;
  padding: 16px;
  border-radius: 16px;
  margin-top: 30px;
  .status-label { font-weight: 600; font-size: 0.9rem; color: #0369a1; }
  .status-desc { font-size: 0.75rem; color: #0ea5e9; margin: 0; }
}

.variable-container {
  margin-bottom: 16px;
  .hint { font-size: 0.8rem; color: var(--text-muted); }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
}

.tag {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: var(--accent-blue); color: var(--accent-blue); background: #f0f9ff; }
}

.mail-textarea {
  width: 100%;
  height: 400px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-main);
  resize: none;
  &:focus { outline: none; border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1); }
}

.preview-footer {
  margin-top: 12px;
  p { font-size: 0.75rem; color: var(--text-muted); font-style: italic; }
}

/* Switch 樣式 */
.switch {
  position: relative; display: inline-block; width: 44px; height: 24px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1; transition: .4s; border-radius: 24px;
    &:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
  }
  input:checked + .slider { background-color: var(--accent-blue); }
  input:checked + .slider:before { transform: translateX(20px); }
}
</style>
