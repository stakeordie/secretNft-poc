<template>
  <div id="app">
    <nav>
      <button @click="$router.push({name: 'TransferAsset'})">Transfer Asset View</button>
      <button @click="$router.push({name: 'MintNft'})">Mint NFT View</button>
      <button @click="$router.push({name: 'TransactionHistory'})">Transaction History View</button>
      <button @click="$router.push({name: 'Permissions'})">NFT Permissions</button>
      <button @click="$router.push({name: 'HandlePrivacy'})">Handle Privacy</button>
      <button @click="$router.push({name: 'AllTokens'})">See All Tokens</button>
      <button @click="$router.push({name: 'ContractInfo'})">Contract Info</button>
      <button @click="$router.push({name: 'Whitelist'})">Whitelist</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { sodt } from "./contracts/sodt.js";
import {
  getAddress,
  onAccountAvailable,
  viewingKeyManager,
} from "@stakeordie/griptape.js";

export default {
  name: "App",
  data() {
    return {
      tokenSelected: "",
      recipientAddr: "",
      tokens: [],
      nftInfo: {
        rarity: {
          number: "",
          total: "",
        },
      },
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      await this.getMinters();
    });
  },
  methods: {
    async transfer() {
      console.log("Transfering assets");
      if (!this.recipientAddr || !this.tokenSelected) return;
      const res = await sodt.transfer(
        this.recipientAddr,
        this.tokenSelected,
        `You will transfer ownership of this asset to ${this.recipientAddr}`
      );
      console.log(res);
      await this.getTokens();
    },
    async getTokens() {
      const address = getAddress();
      const { token_list } = await sodt.getTokens(address);
      const { tokens } = token_list;
      this.tokens = tokens;
    },
    async createViewingKey() {
      const res = await sodt.createViewingKey();
      if (res.isEmpty()) return;
      const parsed = res.parse();
      viewingKeyManager.add(sodt, parsed.viewing_key.key);
    },
    async getNFTInfo() {
      const { nft_info } = await sodt.getNftInfo(this.tokenSelected);
      const properties = JSON.parse(nft_info.properties);
      this.nftInfo = { ...nft_info, ...properties };
      console.log(this.nftInfo);
    },
    async getMinters() {
      const res = await sodt.getMinters();
      console.log(res);
    },
    async addMinters() {
      const res = await sodt.addMinters([
        "secret19jr8qetf64taze4ynqfh73vdhdm036hayd3yhn",
        "secret1enktjqjkjl6efhdssewn3kceufean0heygsak7",
        "secret12wft3hnpxszrvng6mtp26djvjkqtpjzgc3trqp",
      ]);
      console.log(res);
      await this.getMinters();
    },
  },
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  display: block;
}
h1 {
  width: 100vw;
  height: fit-content;
  text-align: center;
}
select,
input,
button {
  padding: 1rem;
  height: fit-content;
}
form {
  display: flex;
  justify-content: center;
}
.vk,
dl {
  margin: 20px 30%;
}
dt {
  font-weight: 700;
  padding: 0.5rem 0;
}
</style>
