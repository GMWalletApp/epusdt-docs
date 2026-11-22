<script setup lang="ts">
import UCard from "@nuxt/ui/components/Card.vue";
import { computed, ref } from 'vue';
import { useData } from 'vitepress';

const { localeIndex } = useData();
const translations = {
  root: {
    intro: "If Epusdt helps your project, you can support ongoing development with a crypto donation.",
    wallet: "Wallet address",
    copied: "Copied",
    developers: "Developers",
    qr: "Donation QR code",
  },
  vi: {
    intro: "Nếu EPUSDT hữu ích cho dự án của bạn, bạn có thể đóng góp bằng tiền mã hóa để hỗ trợ việc phát triển.",
    wallet: "Địa chỉ ví",
    copied: "Đã sao chép",
    developers: "Nhà phát triển",
    qr: "Mã QR nhận đóng góp",
  },
  ja: {
    intro: "EPUSDT がプロジェクトのお役に立ちましたら、暗号資産による寄付で今後の開発をご支援いただけます。",
    wallet: "ウォレットアドレス",
    copied: "コピーしました",
    developers: "開発者",
    qr: "寄付用 QR コード",
  },
  es: {
    intro: "Si EPUSDT te resulta útil, puedes apoyar su desarrollo con una donación en criptomonedas.",
    wallet: "Dirección de la cartera",
    copied: "Copiado",
    developers: "Desarrolladores",
    qr: "Código QR para donaciones",
  },
  ko: { intro: "EPUSDT가 프로젝트에 도움이 되었다면 암호화폐 기부로 개발을 후원할 수 있습니다.", wallet: "지갑 주소", copied: "복사됨", developers: "개발자", qr: "후원용 QR 코드" },
  ru: { intro: "Если EPUSDT пригодился вашему проекту, вы можете поддержать разработку пожертвованием в криптовалюте.", wallet: "Адрес кошелька", copied: "Скопировано", developers: "Разработчики", qr: "QR-код для пожертвования" },
  pt: {
    intro: "Se o EPUSDT é útil para o seu projeto, você pode apoiar o desenvolvimento com uma doação em criptomoedas.",
    wallet: "Endereço da carteira",
    copied: "Copiado",
    developers: "Desenvolvedores",
    qr: "Código QR para doações",
  },
};
const copy = computed(() => translations[localeIndex.value as keyof typeof translations] ?? translations.root);

const copiedAddress = ref<string | null>(null);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const copyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address);
    copiedAddress.value = address;

    if (copiedTimer) {
      clearTimeout(copiedTimer);
    }

    copiedTimer = setTimeout(() => {
      copiedAddress.value = null;
    }, 1800);
  } catch {
    copiedAddress.value = null;
  }
};
</script>

<template>
  <div class="sponsor-page">
    <p class="sponsor-intro">
      {{ copy.intro }}
    </p>

    <div class="sponsor-grid">
      <UCard as="section" class="sponsor-card" variant="outline">
        <h2>TRON (TRC-20)</h2>

        <div class="sponsor-qr-frame">
          <img src="/sponsor/tron-trc20.png" :alt="copy.qr + ' · TRON TRC-20'" />
        </div>

        <div class="sponsor-address-block">
          <span class="sponsor-address-label">{{ copy.wallet }}</span>
          <button class="sponsor-address-copy" type="button" @click="copyAddress('TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY')">
            <code>TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY</code>
          </button>
          <span class="sponsor-address-feedback" :class="{ 'is-visible': copiedAddress === 'TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY' }">
            {{ copy.copied }}
          </span>
        </div>
      </UCard>

      <UCard as="section" class="sponsor-card" variant="outline">
        <h2>EVM (BSC / ETH / Polygon)</h2>

        <div class="sponsor-qr-frame">
          <img src="/sponsor/evm-multichain.png" :alt="copy.qr + ' · EVM'" />
        </div>

        <div class="sponsor-address-block">
          <span class="sponsor-address-label">{{ copy.wallet }}</span>
          <button class="sponsor-address-copy" type="button" @click="copyAddress('0x6c63989c22e89e6f76105f399243ef6b417b205b')">
            <code>0x6c63989c22e89e6f76105f399243ef6b417b205b</code>
          </button>
          <span class="sponsor-address-feedback" :class="{ 'is-visible': copiedAddress === '0x6c63989c22e89e6f76105f399243ef6b417b205b' }">
            {{ copy.copied }}
          </span>
        </div>
      </UCard>
    </div>

    <section class="sponsor-devs">
      <h2>{{ copy.developers }}</h2>

      <div class="sponsor-devs__list">
        <a class="sponsor-person" href="https://github.com/line-6000" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/154492442?v=4" alt="" />
          <span class="sponsor-person__name">line-6000</span>
        </a>
        <a class="sponsor-person" href="https://github.com/mar-heaven" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/26325127?v=4" alt="" />
          <span class="sponsor-person__name">Ginta</span>
        </a>
        <a class="sponsor-person" href="https://github.com/assimon" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/35057561?v=4" alt="" />
          <span class="sponsor-person__name">Assimon</span>
        </a>
        <a class="sponsor-person" href="https://github.com/alphago9" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/82960628?v=4" alt="" />
          <span class="sponsor-person__name">alphago9</span>
        </a>
        <a class="sponsor-person" href="https://github.com/Astra3456" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/167777041?v=4" alt="" />
          <span class="sponsor-person__name">Astra3456</span>
        </a>
        <a class="sponsor-person" href="https://github.com/dbidib" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/160333000?v=4" alt="" />
          <span class="sponsor-person__name">dbidib</span>
        </a>
        <a class="sponsor-person" href="https://github.com/waifudaisuki" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/102990112?v=4" alt="" />
          <span class="sponsor-person__name">waifudaisuki</span>
        </a>
        <a class="sponsor-person" href="https://github.com/CarpCap" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/39827081?v=4" alt="" />
          <span class="sponsor-person__name">CarpCap</span>
        </a>
        <a class="sponsor-person" href="https://github.com/BlueSkyXN" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/63384277?v=4" alt="" />
          <span class="sponsor-person__name">BlueSkyXN</span>
        </a>
        <a class="sponsor-person" href="https://github.com/tbxark" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/9513891?v=4" alt="" />
          <span class="sponsor-person__name">TBXark</span>
        </a>
        <a class="sponsor-person" href="https://github.com/Yufeifeio" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/114427102?v=4" alt="" />
          <span class="sponsor-person__name">Yufeifeio</span>
        </a>
        <a class="sponsor-person" href="https://github.com/ZhangYiQiu" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/22910338?v=4" alt="" />
          <span class="sponsor-person__name">风轻云断</span>
        </a>
      </div>
    </section>
  </div>
</template>
