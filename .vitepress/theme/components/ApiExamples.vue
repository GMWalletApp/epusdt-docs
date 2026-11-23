<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { examples, requestExample } from "../api-examples";
import { useApiState } from "../api-context";
import UButton from "@nuxt/ui/components/Button.vue";

const { frontmatter, localeIndex } = useData();
const translations = {
  root: ["Request example", "Gateway URL", "Example response", "Copy", "Copied", "Select and copy", "Enter an HTTP or HTTPS origin", "Selected response fields"],
  zh: ["请求示例", "网关地址", "响应示例", "复制", "已复制", "请选择并复制", "请输入 HTTP 或 HTTPS 网关地址", "响应字段节选"],
  "zh-tw": ["請求範例", "閘道網址", "回應範例", "複製", "已複製", "請選取並複製", "請輸入 HTTP 或 HTTPS 閘道網址", "回應欄位節選"],
  vi: ["Ví dụ yêu cầu", "URL cổng thanh toán", "Ví dụ phản hồi", "Sao chép", "Đã sao chép", "Chọn và sao chép", "Nhập địa chỉ HTTP hoặc HTTPS", "Một số trường phản hồi"],
  ja: ["リクエスト例", "ゲートウェイ URL", "レスポンス例", "コピー", "コピーしました", "選択してコピー", "HTTP または HTTPS のオリジンを入力してください", "レスポンスの抜粋"],
  es: ["Ejemplo de solicitud", "URL de la pasarela", "Ejemplo de respuesta", "Copiar", "Copiado", "Selecciona y copia", "Introduce un origen HTTP o HTTPS", "Campos de respuesta seleccionados"],
  ko: ["요청 예시", "게이트웨이 URL", "응답 예시", "복사", "복사됨", "선택하여 복사", "HTTP 또는 HTTPS 주소를 입력하세요", "주요 응답 필드"],
  ru: ["Пример запроса", "URL шлюза", "Пример ответа", "Копировать", "Скопировано", "Выделите и скопируйте", "Введите HTTP- или HTTPS-адрес шлюза", "Основные поля ответа"],
  pt: ["Exemplo de requisição", "URL do gateway", "Exemplo de resposta", "Copiar", "Copiado", "Selecione e copie", "Insira uma origem HTTP ou HTTPS", "Campos selecionados da resposta"],
};
const labels = computed(() => translations[localeIndex.value as keyof typeof translations] ?? translations.root);
const sample = computed(() => examples[frontmatter.value.operation]);
const {base,trade,method,epayMethod,url,responses,responseKind,response} = useApiState();
const language = ref("cURL");
const languages = ["cURL", "Node.js", "Python", "PHP", "Go", "Ruby", "Java", "HTTP"];
const snippet = computed(() => url.value ? requestExample(language.value, url.value, method.value, sample.value) : "");
const liveLabels = {
  root: ["Send GET request", "Live response", "Enter your gateway URL to test a public query.", "Request failed. Check the URL, network and gateway CORS settings."],
  zh: ["发送 GET 请求", "实际响应", "输入自己的网关地址即可试调公开查询接口。", "请求失败，请检查网关地址、网络连接和网关的跨域设置。"],
  "zh-tw": ["傳送 GET 請求", "實際回應", "輸入自己的閘道網址即可測試公開查詢介面。", "請求失敗，請檢查網址、網路連線與閘道的跨來源設定。"],
  vi: ["Gửi yêu cầu GET", "Phản hồi thực tế", "Nhập URL cổng của bạn để thử truy vấn công khai.", "Không thể gửi yêu cầu. Hãy kiểm tra URL, mạng và cấu hình CORS."],
  ja: ["GET リクエストを送信", "実際のレスポンス", "自分のゲートウェイ URL を入力すると公開 API を試せます。", "通信に失敗しました。URL、ネットワーク、ゲートウェイの CORS 設定を確認してください。"],
  es: ["Enviar solicitud GET", "Respuesta real", "Introduce la URL de tu pasarela para probar la consulta pública.", "Error de conexión. Revisa la URL, la red y la configuración CORS."],
  ko: ["GET 요청 보내기", "실제 응답", "공개 API를 테스트하려면 게이트웨이 URL을 입력하세요.", "요청에 실패했습니다. URL, 네트워크 및 게이트웨이 CORS 설정을 확인하세요."],
  ru: ["Отправить GET-запрос", "Ответ сервера", "Введите URL своего шлюза для проверки публичного запроса.", "Запрос не выполнен. Проверьте URL, сеть и настройки CORS шлюза."],
  pt: ["Enviar requisição GET", "Resposta real", "Insira a URL do seu gateway para testar a consulta pública.", "Falha na requisição. Verifique a URL, a rede e a configuração de CORS."],
};
const liveText = computed(() => liveLabels[localeIndex.value as keyof typeof liveLabels] ?? liveLabels.root);
const publicQuery = computed(() => ["config", "checkout-details", "order-status"].includes(frontmatter.value.operation));
const canSend = computed(() => url.value && new URL(url.value).hostname !== "pay.example.com"
  && (!frontmatter.value.route.includes("{trade_id}") || trade.value.trim()));
const running = ref(false);
const result = ref("");
let pending: AbortController | undefined;
function resetQuery() {
  pending?.abort();
  pending = undefined;
  running.value = false;
  result.value = "";
}
watch(url, resetQuery);
onUnmounted(resetQuery);
async function runQuery() {
  if (!publicQuery.value || !canSend.value || running.value) return;
  const controller = new AbortController();
  pending = controller;
  running.value = true;
  result.value = "";
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url.value, { credentials: "omit", redirect: "error",
      referrerPolicy: "no-referrer", signal: controller.signal, headers: { Accept: "application/json" } });
    let body = await response.text();
    if (response.headers.get("content-type")?.includes("json")) body = JSON.stringify(JSON.parse(body), null, 2);
    if (pending === controller) result.value = "HTTP " + response.status + "\n" + body;
  } catch {
    if (pending === controller) result.value = liveText.value[3];
  } finally {
    clearTimeout(timer);
    if (pending === controller) { running.value = false; pending = undefined; }
  }
}
const feedback = ref<{source: string; message: string}>();
const code = ref<HTMLElement>();
const responseCode = ref<HTMLElement>();
watch([snippet, responseKind], () => { feedback.value = undefined; });
async function copy(source: "request" | "response") {
  const el = source === "request" ? code.value : responseCode.value;
  if (!el) return;
  try {
    await navigator.clipboard.writeText(el.textContent ?? "");
    feedback.value = {source, message: labels.value[4]};
  } catch {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    feedback.value = {source, message: labels.value[5]};
  }
}
</script>

<template>
  <aside id="request-example" class="api-examples" :aria-label="labels[0]">
    <div class="api-request">
      <div class="api-panel-heading"><strong>{{ labels[0] }}</strong>
        <select v-if="sample.form" v-model="epayMethod" aria-label="HTTP"><option>GET</option><option>POST</option></select>
      </div>
      <label class="api-input">{{ labels[1] }}
        <input v-model="base" type="url" spellcheck="false" autocomplete="off" :aria-invalid="!url">
      </label>
      <label v-if="frontmatter.route.includes('{trade_id}')" class="api-input">trade_id
        <input v-model="trade" spellcheck="false" autocomplete="off">
      </label>
      <div class="api-languages" :aria-label="labels[0]" role="group">
        <button v-for="item in languages" :key="item" type="button" :aria-pressed="language === item" @click="language = item">{{ item }}</button>
      </div>
      <pre v-if="snippet" tabindex="0"><code :key="language + method" ref="code">{{ snippet }}</code></pre>
      <p v-else role="status">{{ labels[6] }}</p>
      <div v-if="publicQuery" class="api-try">
        <small v-if="!canSend">{{ liveText[2] }}</small>
        <UButton :disabled="!canSend || running" :loading="running" size="sm" @click="runQuery">{{ liveText[0] }}</UButton>
      </div>
      <div class="api-copy"><span aria-live="polite">{{ feedback?.source === "request" ? feedback.message : "" }}</span><UButton :disabled="!snippet" size="xs" color="neutral" variant="outline" @click="copy('request')">{{ labels[3] }}</UButton></div>
    </div>
    <div class="api-response">
      <div class="api-panel-heading"><strong>{{ labels[2] }}</strong><select v-if="responses.length > 1" v-model="responseKind" :aria-label="labels[2]">
        <option v-for="item in responses" :key="item.id" :value="item.id">{{ item.status }} · {{ item.id !== "success" && item.mime === "application/json" && Number(item.id) !== item.status ? item.id + " · " : "" }}{{ item.label }}</option>
      </select><span v-else class="api-status">HTTP {{ response.status }}</span></div>
      <small>{{ response.mime }}<template v-if="responseKind === 'success' && typeof sample.response !== 'string'"> · {{ labels[7] }}</template></small>
      <pre tabindex="0"><code :key="responseKind" ref="responseCode">{{ response.body }}</code></pre>
      <div class="api-copy"><span aria-live="polite">{{ feedback?.source === "response" ? feedback.message : "" }}</span><UButton size="xs" color="neutral" variant="outline" @click="copy('response')">{{ labels[3] }}</UButton></div>
    </div>
    <div v-if="result" class="api-response api-live" aria-live="polite">
      <div class="api-panel-heading"><strong>{{ liveText[1] }}</strong></div>
      <pre tabindex="0"><code>{{ result }}</code></pre>
    </div>
  </aside>
</template>
