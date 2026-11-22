import catalog from "../../public/agent-setup/error-codes.json";
import { data as errorLabels } from "./api-error-labels.data";
import { examples, sampleResponse } from "./api-examples";

type ErrorCode = keyof typeof catalog;
const orderFailures: ErrorCode[] = ["401","10009","10041","10002","10004","10014","10016","10003","10005"];
const codes: Record<string, ErrorCode[]> = {
  "create-order": orderFailures, "epay-order": orderFailures,
  config: ["400"], "open-checkout": [], "checkout-details": ["10008"],
  "order-status": ["10008"], "checkout-return": ["10008","10044","10045","10046"],
  "switch-network": ["10009","10008","10011","10012","10013","10016","10017","10018","10019","10042"],
  "submit-hash": ["10009","10008","10013","10038","10039","10007"], "okpay-notify": ["400"],
};

const labels = {
  root: ["Responses","Success","Redirect","Notification rejected","Response fields","Copy endpoint URL","Copied","More languages","Select and copy"],
  zh: ["响应","成功","跳转","通知校验失败","响应字段","复制接口地址","已复制","更多语言","请选择并复制"],
  "zh-tw": ["回應","成功","重新導向","通知驗證失敗","回應欄位","複製介面網址","已複製","更多語言","請選取並複製"],
  vi: ["Phản hồi","Thành công","Chuyển hướng","Thông báo bị từ chối","Trường phản hồi","Sao chép URL API","Đã sao chép","Ngôn ngữ khác","Chọn và sao chép"],
  ja: ["レスポンス","成功","リダイレクト","通知の検証に失敗","レスポンスのフィールド","API URL をコピー","コピーしました","その他の言語","選択してコピー"],
  es: ["Respuestas","Éxito","Redirección","Notificación rechazada","Campos de respuesta","Copiar URL del endpoint","Copiado","Más lenguajes","Selecciona y copia"],
  ko: ["응답", "성공", "리디렉션", "알림 거부됨", "응답 필드", "API 주소 복사", "복사됨", "다른 언어", "선택하여 복사"],
  ru: ["Ответы", "Успех", "Перенаправление", "Уведомление отклонено", "Поля ответа", "Скопировать URL запроса", "Скопировано", "Другие языки", "Выделите и скопируйте"],
  pt: ["Respostas","Sucesso","Redirecionamento","Notificação rejeitada","Campos da resposta","Copiar URL do endpoint","Copiado","Mais linguagens","Selecione e copie"],
};
export function apiLabels(locale: string) { return labels[locale as keyof typeof labels] ?? labels.root; }

export function responseOptions(op: string, locale: string) {
  const text = apiLabels(locale);
  const sample = examples[op];
  const status = sample.status ?? 200;
  const success = { id: "success", status, label: text[status === 200 ? 1 : 2],
    mime: status >= 300 ? "Location" : typeof sample.response === "string" ? "text/plain" : "application/json",
    body: sampleResponse(sample) };
  return [success, ...codes[op].map(id => {
    const entry = catalog[id];
    const plain = op === "okpay-notify";
    return { id, status: entry.http_status, label: plain ? text[3] : (errorLabels[locale]?.[id] ?? entry.message),
      mime: plain ? "text/plain" : "application/json",
      body: plain ? "fail" : JSON.stringify({status_code:Number(id), message:entry.message, data:null,
        request_id:"b1344d70-ff19-4543-b601-37abfb3b3686"}, null, 2) };
  })];
}
