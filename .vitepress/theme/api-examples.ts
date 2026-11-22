export const demoTrade = "20260523171652123456001";
const order = "ORD202605230001";
const notify = "https://merchant.example/notify";
const back = "https://merchant.example/return";
const hash = "0x" + "ab".repeat(32);
const create = {
  pid: "1000", order_id: order, currency: "cny", token: "usdt", network: "tron",
  amount: 100, notify_url: notify, redirect_url: back, name: "VIP",
  signature: "6f874b1919d95081835e2809b620e354a5866f5a6dbb2e432d1627f1eb10059d",
};
const epay = {
  pid: "1000", money: "100", out_trade_no: order, notify_url: notify, return_url: back,
  name: "VIP", type: "alipay", sign: "b865b0acbb2b01554c35a1bd33351452", sign_type: "MD5",
};
const detail = {
  trade_id: demoTrade, amount: 100, actual_amount: 14.29, token: "USDT", currency: "CNY",
  network: "tron", status: 1, expiration_time: 1779530812000, is_selected: false,
};
interface Sample {
  body?: Record<string, unknown>;
  form?: Record<string, string>;
  response: object | string;
  status?: number;
}
export const examples: Record<string, Sample> = {
  config: { response: { supported_assets: [{network: "tron", display_name: "TRON", tokens: ["TRX", "USDT"]}] } },
  "create-order": { body: create, response: { trade_id: demoTrade, order_id: order, status: 1,
    expiration_time: 1779530812, payment_url: "https://pay.example.com/pay/checkout-counter/" + demoTrade } },
  "open-checkout": { status: 301, response: "Location: /cashier/" + demoTrade },
  "checkout-details": { response: detail },
  "order-status": { response: {trade_id: demoTrade, status: 1} },
  "switch-network": { body: {trade_id: demoTrade, token: "USDT", network: "tron"}, response: detail },
  "submit-hash": { body: {block_transaction_id: hash}, response: {trade_id: demoTrade, block_transaction_id: hash, status: 2} },
  "checkout-return": { status: 302, response: "Location: /pay/checkout-counter/" + demoTrade },
  "epay-order": { form: epay, status: 302, response: "Location: /pay/checkout-counter/" + demoTrade },
  "okpay-notify": { body: {code: 200, id: "okpay-shop-test", status: "success",
    data: {order_id: "okpay-order-test-001", unique_id: demoTrade, pay_user_id: 1234567890,
      amount: "0.15000000", coin: "USDT", status: 1, type: "deposit"}, sign: "PROVIDER_SIGNATURE"}, response: "success" },
};
const notFound = {code: 10008, message: "order does not exist"};
const duplicate = {code: 10002, message: "order already exists"};
export const errorExamples: Record<string, {code: number; message: string}> = {
  "create-order": duplicate, "epay-order": duplicate, "order-status": notFound,
  "checkout-details": notFound, "checkout-return": notFound,
  "submit-hash": {code: 10038, message: "manual payment verification failed"},
  "switch-network": {code: 10013, message: "order is not awaiting payment"},
  "okpay-notify": {code: 400, message: "fail"},
};
export function errorResponse(operation: string) {
  const error = errorExamples[operation];
  if (operation === "okpay-notify") return error.message;
  return JSON.stringify({status_code: error.code, message: error.message, data: null,
    request_id: "b1344d70-ff19-4543-b601-37abfb3b3686"}, null, 2);
}
export function sampleResponse(sample: Sample) {
  if (typeof sample.response === "string") return sample.response;
  return JSON.stringify({status_code: 200, message: "success", data: sample.response,
    request_id: "b1344d70-ff19-4543-b601-37abfb3b3686"}, null, 2);
}

export function requestExample(language: string, url: string, method: string, sample: Sample) {
  const form = sample.form && new URLSearchParams(sample.form).toString();
  const query = method === "GET" && form;
  const target = query ? url + "?" + form : url;
  const body = query ? undefined : form ?? (sample.body && JSON.stringify(sample.body, null, 2));
  const type = form ? "application/x-www-form-urlencoded" : "application/json";
  const redirect = sample.status === 301 || sample.status === 302;
  if (language === "cURL") {
    const args = ["curl -i -X " + method, "'" + target + "'"];
    if (body) args.push("-H 'Content-Type: " + type + "'", "--data-raw '" + body + "'");
    return args.join(" \\\n  ");
  }
  if (language === "Node.js") {
    const options = [`method: "${method}"`];
    if (redirect) options.push('redirect: "manual"');
    if (body) options.push(`headers: { "Content-Type": "${type}" }`,
      form ? "body: " + JSON.stringify(body) : "body: JSON.stringify(" + body + ")");
    return `const res = await fetch(${JSON.stringify(target)}, {\n  ${options.join(",\n  ")}\n});\n` +
      (redirect ? 'console.log(res.status, res.headers.get("location"));' : "console.log(res.status, await res.text());");
  }
  const args = [JSON.stringify(target)];
  if (form && !query) args.push("data=" + JSON.stringify(sample.form, null, 2));
  if (sample.body) args.push("json=" + JSON.stringify(sample.body, null, 2));
  if (redirect) args.push("allow_redirects=False");
  args.push("timeout=15");
  return `import requests\n\nres = requests.${method.toLowerCase()}(\n    ${args.join(",\n    ")}\n)\n` +
    (redirect ? 'print(res.status_code, res.headers.get("Location"))' : "print(res.status_code, res.text)");
}
