<script setup lang="ts">
import { ref } from 'vue';

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
      如果 Epusdt 對你的項目有幫助，歡迎透過加密貨幣贊助支持後續開發。
    </p>

    <div class="sponsor-grid">
      <section class="sponsor-card">
        <h2>TRON (TRC-20)</h2>

        <div class="sponsor-qr-frame">
          <img src="/sponsor/tron-trc20.png" alt="TRON TRC-20 贊助二維碼" />
        </div>

        <div class="sponsor-address-block">
          <span class="sponsor-address-label">錢包地址</span>
          <button class="sponsor-address-copy" type="button" @click="copyAddress('TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY')">
            <code>TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY</code>
          </button>
          <span class="sponsor-address-feedback" :class="{ 'is-visible': copiedAddress === 'TUsn5Nhi2P12dQ2ecrocUX6e6Jsi6EE8TY' }">
            已複製
          </span>
        </div>
      </section>

      <section class="sponsor-card">
        <h2>EVM (BSC / ETH / Polygon)</h2>

        <div class="sponsor-qr-frame">
          <img src="/sponsor/evm-multichain.png" alt="EVM 共用贊助二維碼" />
        </div>

        <div class="sponsor-address-block">
          <span class="sponsor-address-label">錢包地址</span>
          <button class="sponsor-address-copy" type="button" @click="copyAddress('0x6c63989c22e89e6f76105f399243ef6b417b205b')">
            <code>0x6c63989c22e89e6f76105f399243ef6b417b205b</code>
          </button>
          <span class="sponsor-address-feedback" :class="{ 'is-visible': copiedAddress === '0x6c63989c22e89e6f76105f399243ef6b417b205b' }">
            已複製
          </span>
        </div>
      </section>
    </div>

    <section class="sponsor-devs">
      <h2>開發者名單</h2>

      <div class="sponsor-devs__list">
        <a class="sponsor-person" href="https://github.com/line-6000" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/154492442?v=4" alt="line-6000 avatar" />
          <span class="sponsor-person__name">line-6000</span>
        </a>
        <a class="sponsor-person" href="https://github.com/mar-heaven" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/26325127?v=4" alt="Ginta avatar" />
          <span class="sponsor-person__name">Ginta</span>
        </a>
        <a class="sponsor-person" href="https://github.com/assimon" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/35057561?v=4" alt="Assimon avatar" />
          <span class="sponsor-person__name">Assimon</span>
        </a>
        <a class="sponsor-person" href="https://github.com/alphago9" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/82960628?v=4" alt="alphago9 avatar" />
          <span class="sponsor-person__name">alphago9</span>
        </a>
        <a class="sponsor-person" href="https://github.com/Astra3456" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/167777041?v=4" alt="Astra3456 avatar" />
          <span class="sponsor-person__name">Astra3456</span>
        </a>
        <a class="sponsor-person" href="https://github.com/dbidib" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/160333000?v=4" alt="dbidib avatar" />
          <span class="sponsor-person__name">dbidib</span>
        </a>
        <a class="sponsor-person" href="https://github.com/waifudaisuki" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/102990112?v=4" alt="waifudaisuki avatar" />
          <span class="sponsor-person__name">waifudaisuki</span>
        </a>
        <a class="sponsor-person" href="https://github.com/CarpCap" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/39827081?v=4" alt="CarpCap avatar" />
          <span class="sponsor-person__name">CarpCap</span>
        </a>
        <a class="sponsor-person" href="https://github.com/BlueSkyXN" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/63384277?v=4" alt="BlueSkyXN avatar" />
          <span class="sponsor-person__name">BlueSkyXN</span>
        </a>
        <a class="sponsor-person" href="https://github.com/tbxark" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/9513891?v=4" alt="TBXark avatar" />
          <span class="sponsor-person__name">TBXark</span>
        </a>
        <a class="sponsor-person" href="https://github.com/Yufeifeio" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/114427102?v=4" alt="Yufeifeio avatar" />
          <span class="sponsor-person__name">Yufeifeio</span>
        </a>
        <a class="sponsor-person" href="https://github.com/ZhangYiQiu" target="_blank" rel="noreferrer">
          <img class="sponsor-person__avatar" src="https://avatars.githubusercontent.com/u/22910338?v=4" alt="风轻云断 avatar" />
          <span class="sponsor-person__name">风轻云断</span>
        </a>
      </div>
    </section>
  </div>
</template>
