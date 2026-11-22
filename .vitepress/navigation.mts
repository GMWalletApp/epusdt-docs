import { languages } from "./languages";

type Locale = "vi" | "ja" | "es" | "pt" | "ko" | "ru";

export const englishNavigation = {
  nav: [
    { text: "Home", link: "/" },
    { text: "Guide", link: "/guide/intro" },
    { text: "API", link: "/api/reference" },
    { text: "GMPay Edge", link: "/gmpay-edge/" },
    { text: "GMShop Edge", link: "/gmshop-edge/" },
    { text: "Sponsor", link: "/guide/sponsor" },
  ],
  sidebar: {
    "/guide/": [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/guide/intro" },
          { text: "Release Notes", link: "/guide/changelog" },
          { text: "FAQ", link: "/guide/faq" },
          { text: "Sponsor", link: "/guide/sponsor" },
        ],
      },
      {
        text: "Installation",
        items: [
          { text: "Tutorial", link: "/guide/installation/tutorial" },
          { text: "epctl Binary Installer", link: "/guide/installation/epctl" },
          { text: "Docker (Recommended)", link: "/guide/installation/docker" },
          { text: "aaPanel", link: "/guide/installation/aapanel" },
          { text: "Manual", link: "/guide/installation/manual" },
        ],
      },
      {
        text: "Integration",
        items: [
          { text: "GMPay (Recommended)", link: "/guide/integration/gmpay" },
          { text: "EPay (Redirect)", link: "/guide/integration/epay" },
          { text: "Legacy Migration", link: "/guide/integration/epusdt" },
        ],
      },
    ],
    "/api/": [
      {
        text: "API Reference",
        items: [
          { text: "Overview", link: "/api/reference" },
          { text: "Payment API", link: "/api/payment" },
          { text: "API Migration", link: "/api/legacy" },
        ],
      },
    ],
    "/gmpay-edge/": [
      {
        text: "GMPay Edge",
        items: [
          { text: "Overview", link: "/gmpay-edge/" },
          { text: "Architecture", link: "/gmpay-edge/architecture" },
          { text: "Deployment", link: "/gmpay-edge/deployment" },
          { text: "Bun Data Operations", link: "/gmpay-edge/node-data-operations" },
          { text: "Merchant API", link: "/gmpay-edge/merchant-api" },
          { text: "Payment Integrations", link: "/gmpay-edge/payment-integrations" },
        ],
      },
    ],
    "/gmshop-edge/": [
      {
        text: "GMShop Edge",
        items: [
          { text: "Overview", link: "/gmshop-edge/" },
          { text: "Architecture", link: "/gmshop-edge/architecture" },
          { text: "Deployment", link: "/gmshop-edge/deployment" },
          { text: "Bun Data Operations", link: "/gmshop-edge/node-data-operations" },
          { text: "Native Supplier API", link: "/gmshop-edge/supplier-api" },
          { text: "Commerce and Fulfillment", link: "/gmshop-edge/commerce-fulfillment" },
          { text: "Checkout and Providers", link: "/gmshop-edge/checkout-providers" },
        ],
      },
    ],
  },
};

const labels: Record<string, Record<Locale, string>> = {
  "Home": { vi: "Trang chủ", ja: "ホーム", es: "Inicio", pt: "Início", ko: "홈", ru: "Главная" },
  "Guide": { vi: "Hướng dẫn", ja: "ガイド", es: "Guía", pt: "Guia", ko: "가이드", ru: "Руководство" },
  "Sponsor": { vi: "Tài trợ", ja: "開発を支援", es: "Patrocinar", pt: "Apoiar", ko: "후원", ru: "Поддержать проект" },
  "Introduction": { vi: "Giới thiệu", ja: "はじめに", es: "Introducción", pt: "Introdução", ko: "소개", ru: "Введение" },
  "Release Notes": { vi: "Ghi chú phát hành", ja: "リリースノート", es: "Notas de la versión", pt: "Notas de versão", ko: "변경 이력", ru: "История версий" },
  "FAQ": { vi: "Câu hỏi thường gặp", ja: "よくある質問", es: "Preguntas frecuentes", pt: "Perguntas frequentes", ko: "자주 묻는 질문", ru: "Частые вопросы" },
  "Installation": { vi: "Cài đặt", ja: "インストール", es: "Instalación", pt: "Instalação", ko: "설치", ru: "Установка" },
  "Tutorial": { vi: "Hướng dẫn cộng đồng", ja: "コミュニティのチュートリアル", es: "Tutoriales de la comunidad", pt: "Tutoriais da comunidade", ko: "튜토리얼", ru: "Учебные материалы" },
  "epctl Binary Installer": { vi: "Trình cài đặt epctl", ja: "epctl によるインストール", es: "Instalación con epctl", pt: "Instalação com epctl", ko: "epctl로 설치", ru: "Установка с epctl" },
  "Docker (Recommended)": { vi: "Docker (khuyên dùng)", ja: "Docker（推奨）", es: "Docker (recomendado)", pt: "Docker (recomendado)", ko: "Docker (권장)", ru: "Docker (рекомендуется)" },
  "Manual": { vi: "Cài đặt thủ công", ja: "手動インストール", es: "Instalación manual", pt: "Instalação manual", ko: "수동 설치", ru: "Установка вручную" },
  "Integration": { vi: "Tích hợp", ja: "連携", es: "Integración", pt: "Integração", ko: "연동", ru: "Интеграция" },
  "GMPay (Recommended)": { vi: "GMPay (khuyên dùng)", ja: "GMPay（推奨）", es: "GMPay (recomendado)", pt: "GMPay (recomendado)", ko: "GMPay (권장)", ru: "GMPay (рекомендуется)" },
  "EPay (Redirect)": { vi: "EPay (chuyển hướng)", ja: "EPay（リダイレクト）", es: "EPay (redirección)", pt: "EPay (redirecionamento)", ko: "EPay (리디렉션)", ru: "EPay (перенаправление)" },
  "Legacy Migration": { vi: "Di chuyển từ phiên bản cũ", ja: "旧版からの移行", es: "Migración desde versiones anteriores", pt: "Migração de versões anteriores", ko: "이전 버전에서 마이그레이션", ru: "Переход с прежних версий" },
  "API Reference": { vi: "Tài liệu API", ja: "API リファレンス", es: "Referencia de la API", pt: "Referência da API", ko: "API 레퍼런스", ru: "Справочник API" },
  "Overview": { vi: "Tổng quan", ja: "概要", es: "Descripción general", pt: "Visão geral", ko: "개요", ru: "Обзор" },
  "Payment API": { vi: "API thanh toán", ja: "決済 API", es: "API de pagos", pt: "API de pagamentos", ko: "결제 API", ru: "Платёжный API" },
  "API Migration": { vi: "Di chuyển API", ja: "API の移行", es: "Migración de la API", pt: "Migração da API", ko: "API 마이그레이션", ru: "Переход на новый API" },
  "Architecture": { vi: "Kiến trúc", ja: "アーキテクチャ", es: "Arquitectura", pt: "Arquitetura", ko: "아키텍처", ru: "Архитектура" },
  "Deployment": { vi: "Triển khai", ja: "デプロイ", es: "Despliegue", pt: "Implantação", ko: "배포", ru: "Развёртывание" },
  "Bun Data Operations": { vi: "Quản lý dữ liệu Bun", ja: "Bun のデータ管理", es: "Gestión de datos en Bun", pt: "Gestão de dados no Bun", ko: "Bun 데이터 관리", ru: "Управление данными в Bun" },
  "Merchant API": { vi: "API cho người bán", ja: "加盟店 API", es: "API para comercios", pt: "API para lojistas", ko: "가맹점 API", ru: "API продавца" },
  "Payment Integrations": { vi: "Tích hợp thanh toán", ja: "決済サービスとの連携", es: "Integraciones de pago", pt: "Integrações de pagamento", ko: "결제 서비스 연동", ru: "Интеграция платёжных сервисов" },
  "Native Supplier API": { vi: "API nhà cung cấp", ja: "サプライヤー API", es: "API nativa de proveedores", pt: "API nativa de fornecedores", ko: "공급업체 API", ru: "API поставщика" },
  "Commerce and Fulfillment": { vi: "Bán hàng và giao hàng", ja: "販売と納品", es: "Ventas y entrega", pt: "Vendas e entrega", ko: "판매 및 주문 이행", ru: "Продажи и выполнение заказов" },
  "Checkout and Providers": { vi: "Thanh toán và nhà cung cấp", ja: "購入手続きと決済事業者", es: "Página de pago y proveedores", pt: "Checkout e provedores", ko: "결제 페이지 및 결제 서비스", ru: "Оформление заказа и платёжные сервисы" },
};

export function docsLocale(id: Locale) {
  const { label, prefix, tag } = languages.find(language => language.id === id)!;
  const text = (english: string) => labels[english]?.[id] ?? english;
  const item = (entry: { text: string; link: string }) => ({
    text: text(entry.text), link: prefix + entry.link.slice(1),
  });
  const sidebar = Object.fromEntries(Object.entries(englishNavigation.sidebar).map(([path, groups]) => [
    prefix + path.slice(1),
    groups.map(group => ({ text: text(group.text), items: group.items.map(item) })),
  ]));
  return { label, lang: tag, link: prefix, themeConfig: { nav: englishNavigation.nav.map(item), sidebar } };
}
