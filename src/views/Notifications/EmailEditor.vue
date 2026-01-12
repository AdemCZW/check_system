<script setup>
import { reactive, ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 1. 通知信資料模型
const mailSettings = reactive({
  subject: '【報名成功通知】感謝您參與本次活動',
  senderName: '活動小辦公室',
  content: '<h1>親愛的 {name} 您好：</h1><p>感謝您報名參加 <strong>{event_name}</strong>。</p><p>您的專屬報名序號為：{order_id}</p><p>期待您的蒞臨！</p>',
  enableAutoSend: true
});

const myQuill = ref(null);

// 2. 智慧插入變數：直接在游標處插入文字
const insertTag = (tag) => {
  const quill = myQuill.value.getQuill();
  const range = quill.getSelection(true); // 取得目前焦點位置
  if (range) {
    quill.insertText(range.index, tag);
    quill.setSelection(range.index + tag.length); // 插入後將游標移至變數後方
  } else {
    // 若無焦點則追加於結尾
    const length = quill.getLength();
    quill.insertText(length - 1, tag);
  }
};

const saveSettings = () => {
  alert('通知信樣板已成功儲存！');
  console.log('Final HTML Content:', mailSettings.content);
};

// 3. 編輯器配置 (含圖片功能)
const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // 文字樣式
      [{ 'header': [1, 2, 3, false] }],                 // 標題層級
      [{ 'color': [] }, { 'background': [] }],          // 顏色
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // 列表
      ['link', 'image', 'clean']                        // 連結、圖片、清除格式
    ]
  },
  placeholder: '請在此輸入郵件內文，可由上方工具列插入圖片...',
  theme: 'snow'
};
</script>

<template>
  <div class="email-editor-view">
    <div class="page-header">
      <div class="header-text">
        <h2 class="title">4. 通知信設定</h2>
        <p class="subtitle">編輯報名成功後自動發送的 HTML 郵件內容</p>
      </div>
      <button class="btn-save" @click="saveSettings">儲存郵件樣板</button>
    </div>

    <div class="editor-layout">
      <div class="panel config-side">
        <h3 class="panel-title">發送參數設定</h3>

        <div class="input-group">
          <label>郵件主旨</label>
          <input v-model="mailSettings.subject" class="custom-input" placeholder="請輸入標題" />
        </div>

        <div class="input-group">
          <label>顯示寄件者名稱</label>
          <input v-model="mailSettings.senderName" class="custom-input" placeholder="例如：客服中心" />
        </div>

        <div class="auto-send-card">
          <div class="card-info">
            <span class="label">報名完成即刻發送</span>
            <p class="desc">若關閉，需手動至名單中觸發發送</p>
          </div>
          <label class="switch-container">
            <input type="checkbox" v-model="mailSettings.enableAutoSend">
            <span class="switch-slider"></span>
          </label>
        </div>

        <div class="help-box">
          <p>📌 貼心提醒：</p>
          <small>插入圖片時請注意檔案大小，建議寬度控制在 600px 以內以符合多數信箱排版。</small>
        </div>
      </div>

      <div class="panel editor-side">
        <h3 class="panel-title">郵件內文編輯</h3>

        <div class="variable-bar">
          <span class="bar-hint">點擊插入動態欄位：</span>
          <div class="tag-list">
            <button class="tag-item" @click="insertTag('{name}')"><span>{name}</span> 姓名</button>
            <button class="tag-item" @click="insertTag('{event_name}')"><span>{event_name}</span> 活動名</button>
            <button class="tag-item" @click="insertTag('{order_id}')"><span>{order_id}</span> 序號</button>
            <button class="tag-item" @click="insertTag('{date}')"><span>{date}</span> 日期</button>
          </div>
        </div>

        <div class="quill-container-fixed">
          <QuillEditor
            ref="myQuill"
            v-model:content="mailSettings.content"
            contentType="html"
            :options="editorOptions"
          />
        </div>

        <div class="editor-footer">
          <p>※ 郵件發送時，大括號內的代碼將自動替換為報名者資料。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 頁面基礎樣式 */
.email-editor-view {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 30px;
  font-family: "PingFang TC", "Microsoft JhengHei", sans-serif;
  color: #1e293b;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.title { font-size: 1.6rem; font-weight: 800; margin: 0; }
.subtitle { color: #64748b; font-size: 0.9rem; margin: 4px 0 0; }

.btn-save {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}
.btn-save:hover { background: #0284c7; transform: translateY(-1px); }

/* 佈局架構 */
.editor-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 25px;
}

.panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.panel-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.panel-title::before {
  content: "";
  width: 5px;
  height: 18px;
  background: #0ea5e9;
  margin-right: 12px;
  border-radius: 10px;
}

/* 輸入框控制 */
.input-group { margin-bottom: 18px; }
.input-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
.custom-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.custom-input:focus { outline: none; border-color: #0ea5e9; background: #fff; }

/* 自動發送狀態卡片 */
.auto-send-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f9ff;
  padding: 18px;
  border-radius: 16px;
  margin-top: 10px;
}
.label { font-weight: 700; font-size: 0.95rem; color: #0369a1; }
.desc { font-size: 0.75rem; color: #0ea5e9; margin: 4px 0 0; }

.help-box {
  margin-top: 25px;
  padding: 15px;
  background: #fffbeb;
  border-radius: 12px;
  color: #92400e;
  font-size: 0.8rem;
}

/* 變數標籤欄 */
.variable-bar { margin-bottom: 20px; }
.bar-hint { font-size: 0.85rem; color: #64748b; font-weight: 500; }
.tag-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.tag-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 5px;
}
.tag-item span { color: #0ea5e9; font-weight: 700; font-family: monospace; }
.tag-item:hover { border-color: #0ea5e9; background: #f0f9ff; transform: translateY(-1px); }

/* 編輯器容器強化 - 防止圖片撐破 */
.quill-container-fixed {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden; /* 確保工具列圓角不被遮住 */
}

/* 深度作用器控制 Quill 內部樣式 */
:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 12px;
}

:deep(.ql-container.ql-snow) {
  border: none;
  min-height: 400px;
}

:deep(.ql-editor) {
  padding: 25px;
  font-size: 1.05rem;
  line-height: 1.8;
}

/* 圖片在編輯器內的自適應寬度 */
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 15px 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.editor-footer {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #94a3b8;
  padding-left: 5px;
}

/* Switch 樣式 */
.switch-container { position: relative; display: inline-block; width: 48px; height: 26px; }
.switch-container input { opacity: 0; width: 0; height: 0; }
.switch-slider {
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1; transition: .4s; border-radius: 34px;
}
.switch-slider:before {
  position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px;
  background-color: white; transition: .4s; border-radius: 50%;
}
input:checked + .switch-slider { background-color: #0ea5e9; }
input:checked + .switch-slider:before { transform: translateX(22px); }
</style>
