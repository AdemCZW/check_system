<script setup>
import { reactive, ref } from 'vue';

// 1. 機器人性格與基礎配置
const botConfig = reactive({
  name: '活動小助手 (Smart Assistant)',
  personality: 'professional', // 專業、親切、幽默
  welcomeMsg: '您好！我是本次峰會的 AI 助理，已準備好為您解答關於活動行程、報到方式或場地交通的問題。',
  temperature: 0.5, // 創意度控制
  knowledgeSource: ['官網資訊', '報名表單', '場地手冊']
});

// 2. 知識庫 FAQ 資料
const faqs = reactive([
  { id: 1, q: '活動當天如何報到？', a: '請出示您的專屬 QR Code 至一樓櫃檯領取識別證。', status: '已學習' },
  { id: 2, q: '現場有提供素食餐點嗎？', a: '有的，請於報名表單註記，我們會為您準備專屬餐券。', status: '已學習' }
]);

const newFAQ = reactive({ q: '', a: '' });

// 3. 測試對話流
const chatMessages = reactive([
  { id: 1, role: 'bot', text: '您好！測試環境已就緒，請嘗試詢問我活動相關問題。' }
]);
const userInput = ref('');
const isTyping = ref(false);

const sendTestChat = () => {
  if (!userInput.value) return;

  // 使用者訊息
  chatMessages.push({ id: Date.now(), role: 'user', text: userInput.value });
  const question = userInput.value;
  userInput.value = '';

  // 模擬 AI 思考與檢索
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
    chatMessages.push({
      id: Date.now() + 1,
      role: 'bot',
      text: `根據知識庫顯示：${question.includes('報到') ? '您可以透過 QR Code 快速報到。' : '這是一個好問題，我需要更多資訊來回答。'}`
    });
  }, 1200);
};

const addFAQ = () => {
  if (newFAQ.q && newFAQ.a) {
    faqs.unshift({ id: Date.now(), q: newFAQ.q, a: newFAQ.a, status: '學習中' });
    newFAQ.q = ''; newFAQ.a = '';
  }
};
</script>

<template>
  <div class="ai-setting-view">
    <div class="page-header">
      <div class="title-group">
        <h2 class="title">10. AI 客服與知識庫設定</h2>
        <span class="engine-status"><span class="dot"></span> GPT-4o 模型已連線</span>
      </div>
      <div class="actions">
        <button class="btn-outline-mini">重置模型</button>
        <button class="btn-primary-rounded">發佈並更新 Line 機器人</button>
      </div>
    </div>

    <div class="ai-grid">
      <div class="config-panel">
        <div class="tech-card mb-20">
          <h3 class="section-title">🤖 機器人性格設定</h3>
          <div class="form-item">
            <label>AI 名稱</label>
            <input v-model="botConfig.name" class="input-rounded" />
          </div>
          <div class="form-item">
            <label>歡迎語 (First Message)</label>
            <textarea v-model="botConfig.welcomeMsg" class="input-rounded" rows="3"></textarea>
          </div>
          <div class="form-item">
            <label>回覆風格 (Temperature: {{ botConfig.temperature }})</label>
            <div class="range-box">
              <span>精準</span>
              <input type="range" v-model="botConfig.temperature" min="0" max="1" step="0.1" />
              <span>創意</span>
            </div>
          </div>
        </div>

        <div class="tech-card mb-20">
          <h3 class="section-title">📚 核心知識庫 (RAG)</h3>
          <div class="upload-area">
            <div class="upload-icon">📁</div>
            <p>點擊或拖放 PDF/Docx 以訓練 AI</p>
            <small>已自動同步：主辦單位設定、活動日程表</small>
          </div>

          <div class="faq-manager">
            <p class="label-sm">手動補充 FAQ</p>
            <div class="faq-input">
              <input v-model="newFAQ.q" placeholder="問題..." />
              <input v-model="newFAQ.a" placeholder="正確答案..." />
              <button @click="addFAQ">新增</button>
            </div>
            <div class="faq-scroll-list">
              <div v-for="faq in faqs" :key="faq.id" class="faq-item">
                <span class="q">Q: {{ faq.q }}</span>
                <span class="status-badge">{{ faq.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="simulator-panel">
        <div class="chat-container tech-card">
          <div class="chat-header">
            <div class="bot-avatar">AI</div>
            <div class="bot-info">
              <span class="n">{{ botConfig.name }}</span>
              <span class="s">即時預覽模式</span>
            </div>
          </div>

          <div class="chat-body">
            <div v-for="msg in chatMessages" :key="msg.id" :class="['msg-bubble', msg.role]">
              <div class="text">{{ msg.text }}</div>
            </div>
            <div v-if="isTyping" class="msg-bubble bot typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>

          <div class="chat-footer">
            <input v-model="userInput" @keyup.enter="sendTestChat" placeholder="詢問關於活動的問題..." />
            <button @click="sendTestChat">發送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-grid { display: grid; grid-template-columns: 1fr 450px; gap: 24px; }

/* 配置面板 */
.section-title { font-size: 1rem; font-weight: 800; margin-bottom: 20px; color: #1e293b; display: flex; align-items: center; }
.form-item { margin-bottom: 15px; label { font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 6px; } }

.range-box {
  display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #94a3b8;
  input { flex: 1; accent-color: #0ea5e9; }
}

.upload-area {
  border: 2px dashed #e2e8f0; border-radius: 16px; padding: 25px; text-align: center; background: #f8fafc; cursor: pointer;
  &:hover { border-color: #38bdf8; background: #f0f9ff; }
  .upload-icon { font-size: 1.5rem; margin-bottom: 8px; }
  small { color: #94a3b8; display: block; margin-top: 5px; }
}

.faq-manager {
  margin-top: 20px; .label-sm { font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 10px; }
  .faq-input { display: flex; gap: 8px; margin-bottom: 12px; input { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; font-size: 0.85rem; } button { background: #1e293b; color: white; border: none; padding: 0 15px; border-radius: 8px; cursor: pointer; } }
}

.faq-scroll-list {
  max-height: 180px; overflow-y: auto;
  .faq-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; .q { font-weight: 600; } .status-badge { font-size: 0.7rem; color: #10b981; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; } }
}

/* 模擬器樣式 */
.chat-container {
  height: 650px; display: flex; flex-direction: column; padding: 0; background: #f1f5f9; border: none; overflow: hidden;
  .chat-header { background: #1e293b; color: white; padding: 15px 20px; display: flex; align-items: center; gap: 12px; .bot-avatar { width: 36px; height: 36px; background: #0ea5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; } .bot-info { display: flex; flex-direction: column; .n { font-weight: 700; font-size: 0.95rem; } .s { font-size: 0.7rem; opacity: 0.6; } } }
  .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .msg-bubble {
    max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 0.9rem; line-height: 1.5;
    &.bot { align-self: flex-start; background: white; color: #1e293b; border-bottom-left-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    &.user { align-self: flex-end; background: #0ea5e9; color: white; border-bottom-right-radius: 4px; }
    &.typing span { animation: blink 1.4s infinite; margin: 0 1px; &:nth-child(2) { animation-delay: 0.2s; } &:nth-child(3) { animation-delay: 0.4s; } }
  }
  .chat-footer { padding: 15px; background: white; display: flex; gap: 10px; input { flex: 1; border: 1px solid #e2e8f0; padding: 10px 15px; border-radius: 50px; outline: none; &:focus { border-color: #0ea5e9; } } button { background: #0ea5e9; color: white; border: none; padding: 0 20px; border-radius: 50px; font-weight: bold; cursor: pointer; } }
}

.engine-status { font-size: 0.75rem; color: #10b981; font-weight: bold; .dot { width: 8px; height: 8px; background: #10b981; display: inline-block; border-radius: 50%; margin-right: 5px; animation: pulse 2s infinite; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
@keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
.mb-20 { margin-bottom: 20px; }
</style>
