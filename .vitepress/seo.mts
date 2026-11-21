import type { HeadConfig, PageData, TransformPageContext, UserConfig } from "vitepress";

export const origin = "https://epusdt.com";

const languages = [
  { prefix: "", tag: "en", openGraph: "en_US" },
  { prefix: "zh/", tag: "zh-Hans", openGraph: "zh_CN" },
  { prefix: "zh-tw/", tag: "zh-Hant", openGraph: "zh_TW" },
];

export const sitemap: NonNullable<UserConfig["sitemap"]> = {
  hostname: origin,
  transformItems(items) {
    return items.filter(item => !/^\/?README(?:\.|$)/i.test(item.url)).map(item => {
      const links = (item.links ?? []).map(link => ({
        ...link,
        lang: languages.find(locale => locale.openGraph.replace("_", "-") === link.lang)?.tag ?? link.lang,
      }));
      const fallback = links.find(link => link.lang === "en");
      if (fallback) links.push({ ...fallback, lang: "x-default" });
      return { ...item, links };
    });
  },
};

function pageUrl(file: string) {
  return origin + "/" + file.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
}

export function addPageMetadata(page: PageData, { siteConfig }: TransformPageContext) {
  const file = page.relativePath;
  const head: HeadConfig[] = [...(page.frontmatter.head ?? [])];
  if (/^README(?:\.[\w-]+)?\.md$/i.test(file)) {
    head.push(["meta", { name: "robots", content: "noindex, follow" }]);
    return { frontmatter: { ...page.frontmatter, head } };
  }
  const locale = languages.find(lang => lang.prefix && file.startsWith(lang.prefix)) ?? languages[0];
  const topic = file.slice(locale.prefix.length);
  const url = pageUrl(file);
  const home = topic === "index.md";
  const translations = languages.filter(lang => siteConfig.pages.includes(lang.prefix + topic));
  const website = { "@id": origin + "/#website" };
  head.push(["link", { rel: "canonical", href: url }]);
  head.push(["link", { rel: "alternate", type: "text/markdown", href: origin + "/agent-docs/" + file }]);
  if (home) head.push(["link", { rel: "help", type: "text/markdown", href: origin + "/agent-setup/prompt.md" }]);
  for (const lang of translations) {
    head.push(["link", { rel: "alternate", hreflang: lang.tag, href: pageUrl(lang.prefix + topic) }]);
  }
  if (translations.includes(languages[0])) {
    head.push(["link", { rel: "alternate", hreflang: "x-default", href: pageUrl(topic) }]);
  }
  head.push(
    ["meta", { property: "og:type", content: home ? "website" : "article" }],
    ["meta", { property: "og:site_name", content: "EPUSDT" }],
    ["meta", { property: "og:locale", content: locale.openGraph }],
    ["meta", { property: "og:title", content: page.title }],
    ["meta", { property: "og:description", content: page.description }],
    ["meta", { property: "og:url", content: url }],
    ["meta", { property: "og:image", content: origin + "/logo.png" }],
    ["meta", { name: "twitter:card", content: "summary" }],
  );
  const graph: object[] = [{
    "@type": home ? "WebPage" : "TechArticle",
    "@id": url + "#document",
    url,
    headline: page.title,
    description: page.description,
    inLanguage: locale.tag,
    isPartOf: website,
  }];
  if (home) {
    graph.push({
      "@type": "WebSite", ...website, url: origin + "/", name: "EPUSDT",
      inLanguage: languages.map(lang => lang.tag),
      about: { "@type": "SoftwareSourceCode", name: "EPUSDT", codeRepository: "https://github.com/GMWalletApp/epusdt", programmingLanguage: "Go" },
    });
  }
  head.push(["script", { type: "application/ld+json" }, JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")]);
  return { frontmatter: { ...page.frontmatter, head } };
}
