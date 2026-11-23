<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
const {localeIndex} = useData();
const descriptions = {
  root: ["Application result code.", "Human-readable result.", "Response payload; null on error.", "Request identifier for tracing."],
  zh: ["业务结果码，商户可据此判断具体原因。", "便于阅读的结果说明。", "接口返回的数据，失败时为 null。", "请求标识，可用于排查日志。"],
  "zh-tw": ["業務結果碼，可用於判斷原因。", "供閱讀的結果說明。", "介面回傳的資料，失敗時為 null。", "可用於追蹤記錄的請求識別碼。"],
  vi: ["Mã kết quả nghiệp vụ.", "Thông báo kết quả.", "Dữ liệu trả về; null khi có lỗi.", "Mã yêu cầu dùng để tra cứu nhật ký."],
  ja: ["処理結果のコード。", "結果を説明するメッセージ。", "レスポンス本文のデータ。失敗時は null。", "ログを追跡するためのリクエスト ID。"],
  es: ["Código de resultado de la aplicación.", "Descripción del resultado.", "Datos devueltos; null en caso de error.", "Identificador para rastrear la solicitud."],
  ko: ["코드로 표시한 처리 결과입니다.", "처리 결과를 설명하는 메시지입니다.", "응답 데이터입니다. 오류가 발생하면 null입니다.", "요청 추적에 사용되는 식별자입니다."],
  ru: ["Код результата операции.", "Сообщение о результате.", "Данные ответа. При ошибке возвращается null.", "Идентификатор для отслеживания запроса."],
  pt: ["Código de resultado da aplicação.", "Descrição do resultado.", "Dados retornados; null em caso de erro.", "Identificador para rastrear a requisição."],
};
const notes = computed(() => descriptions[localeIndex.value as keyof typeof descriptions] ?? descriptions.root);
const noteIndex: Record<string, number> = {status_code:0, message:1, data:2, request_id:3};
defineProps<{fields: Record<string, unknown>}>();
function fieldType(name: string, value: unknown) {
  if (["amount","actual_amount"].includes(name)) return "number";
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  if (typeof value === "number" && Number.isInteger(value)) return "integer";
  return typeof value;
}
function children(value: unknown) {
  const item = Array.isArray(value) ? value[0] : value;
  return item && typeof item === "object" && !Array.isArray(item) ? item as Record<string,unknown> : undefined;
}
</script>
<template>
  <ul class="api-fields">
    <li v-for="(value, name) in fields" :key="name">
      <details v-if="children(value)" open>
        <summary><code>{{ name }}</code> <small>{{ fieldType(String(name), value) }}</small></summary>
        <p v-if="name in noteIndex">{{ notes[noteIndex[name]] }}</p>
        <ApiFields :fields="children(value)!" />
      </details>
      <template v-else><code>{{ name }}</code> <small>{{ fieldType(String(name), value) }}</small><p v-if="name in noteIndex">{{ notes[noteIndex[name]] }}</p></template>
    </li>
  </ul>
</template>
