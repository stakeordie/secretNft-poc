<template>
  <div id="app">
    <h1>{{ token.symbol }}</h1>
    <p>Balance: {{ balance }}</p>
    <p>Decimals: {{ token.decimals }}</p>
    <button @click="createVk">Creat Viewing key</button>
    <button @click="getBalance">Get balance</button>
  </div>
</template>

<script>
const decoder = new TextDecoder();
import sefi from "./contracts/sefi";
import { viewingKeyManager, coinConvert } from "@stakeordie/griptape.js";
export default {
  name: "App",
  data() {
    return {
      token: "Loading...",
      balance: "",
    };
  },
  async mounted() {
    const { token_info } = await sefi.getTokenInfo();
    this.token = token_info;
    this.getBalance();
  },
  methods: {
    async createVk() {
      const res = await sefi.createViewingKey();
      const data = decoder.decode(res.data);
      const json = JSON.parse(data);
      console.log(json.create_viewing_key.key);
      viewingKeyManager.add(sefi, json.create_viewing_key.key);
    },
    async getBalance() {
      const res = await sefi.getBalance();
      this.balance = coinConvert(
        res.balance.amount,
        this.token.decimals,
        "human"
      );
      console.log(this.balance);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
