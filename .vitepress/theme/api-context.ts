import { computed, inject, provide, ref, type InjectionKey } from "vue";
import { useData } from "vitepress";
import { apiLabels, responseOptions } from "./api-responses";
import { demoTrade } from "./api-examples";

function createApiState() {
  const { frontmatter, localeIndex } = useData();
  const base = ref("https://pay.example.com");
  const origin = computed(() => {
    try {
      const u = new URL(base.value);
      if (!["http:","https:"].includes(u.protocol) || u.username || u.password || u.search || u.hash ||
          u.pathname !== "/" || !/^[a-z0-9.:[\]-]+$/i.test(u.host)) return "";
      return u.origin;
    } catch { return ""; }
  });
  const route = computed(() => String(frontmatter.value.route));
  const trade = ref(demoTrade);
  const epayMethod = ref("POST");
  const method = computed(() => frontmatter.value.method === "GET/POST" ? epayMethod.value : frontmatter.value.method);
  const url = computed(() => origin.value && origin.value + route.value.replace("{trade_id}",encodeURIComponent(trade.value).replaceAll("'","%27")));
  const responses = computed(() => responseOptions(frontmatter.value.operation, localeIndex.value));
  const responseKind = ref("success");
  const response = computed(() => responses.value.find(r => r.id === responseKind.value) ?? responses.value[0]);
  const labels = computed(() => apiLabels(localeIndex.value));
  return {base,origin,route,trade,epayMethod,method,url,responses,responseKind,response,labels};
}
const key: InjectionKey<ReturnType<typeof createApiState>> = Symbol("endpoint");
export function provideApiState() { provide(key, createApiState()); }
export function useApiState() { return inject(key)!; }
