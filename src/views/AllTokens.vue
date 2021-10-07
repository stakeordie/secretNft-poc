<template>
  <div id="app">
    <h1>List of all NFT’s</h1>
    <h4>search by name</h4>
    <input type="text" placeholder="name" v-model="ownersName" />
    <button @click="searchByOwnersName">search</button>
    <h4>search by token</h4>
    <input type="text" placeholder="nft token" v-model="currentToken" />
    <button @click="searchByToken">search</button>
    <ul>
      <li v-bind:key="index" v-for="(nft, index) in allNFTsInfo">
        <h2>{{ tokens[index] }}</h2>
        <img
          :src="getImage(nft)"
          style="width: 100px; height: 100px; cursor: pointer"
          @click="
            $router.push({
              name: 'NftDetails',
              params: { tokenId: tokens[index] },
            })
          "
        />
      </li>
    </ul>
  </div>
</template>

<script>
const users = [
  {
    name: "daniel",
    token: "secret1kmvv6z6htwkr4wfaxsx08wqp8yay8kgh5x2xxs",
  },
  {
    name: "haidy",
    token: "secret1enktjqjkjl6efhdssewn3kceufean0heygsak7",
  },
  {
    name: "step tech daddy",
    token: "secret1660mkxrw598letk3ztw5lnk98hyf6h7x4w9jrl",
  },
  {
    name: "manuel",
    token: "secret19jr8qetf64taze4ynqfh73vdhdm036hayd3yhn",
  },
  {
    name: "moises",
    token: "secret15re76j9uxu78hnruwknxg4canfsxzv26d3g4g3",
  },
  {
    name: "taco",
    token: "secret12wft3hnpxszrvng6mtp26djvjkqtpjzgc3trqp",
  },
];

import { sodt } from "../contracts/sodt.js";
import { onAccountAvailable } from "@stakeordie/griptape.js";

export default {
  name: "allTokens",
  data() {
    return {
      tokenSelected: "",
      recipientAddr: "",
      token: "",
      NFTOwner: "",
      tokens: [],
      allNFTsInfo: [],
      nftInfo: null,
      ownersName: "",
      currentToken: "",
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      console.log("Loading...");
      await this.getAllTokens();
      console.log("Loaded");
    });
  },
  computed: {
    disabledBurnNftButton() {
      return !this.tokens;
    },
  },
  methods: {
    async searchByOwnersName() {
      this.allNFTsInfo = [];
      const userInfo = users.filter(
        (user) => user.name == this.ownersName || user.token == this.ownersName
      );
      const [first] = userInfo;
      console.table({ name: first.name, code: first.token });
      const { token_list } = await sodt.getTokens(first.token);
      this.tokens = { ...token_list };
      const { tokens } = token_list;
      this.tokens = tokens;
      await this.getAllNFTInfo();
    },
    async searchByToken() {
      this.allNFTsInfo = [];
      const { token_list } = await sodt.allTokens();
      this.tokens = { ...token_list };
      const { tokens } = token_list;
      const token = tokens.filter(
        (thisToken) => thisToken == this.currentToken
      );
      console.log(token);
      this.tokens = token;
      await this.getAllNFTInfo();
    },
    async getAllTokens() {
      this.allNFTsInfo = [];
      const { token_list } = await sodt.allTokens();
      console.log(token_list);
      this.tokens = { ...token_list };
      const { tokens } = token_list;
      this.tokens = tokens;
      console.log(this.tokens);
      await this.getAllNFTInfo();
    },
    getAllNFTInfo() {
      this.tokens.forEach((token) => {
        this.token = token;
        this.getNFTInfo(token);
      });
      console.log(this.allNFTsInfo);
    },
    async getNFTInfo(token) {
      const { nft_info } = await sodt.getNftInfo(token);
      if (nft_info.properties) {
        const properties = JSON.parse(nft_info.properties);
        this.nftInfo = { ...nft_info, ...properties };
        this.allNFTsInfo.push(this.nftInfo);
      } else {
        this.nftInfo = nft_info;
        this.allNFTsInfo.push(this.nftInfo);
      }
    },
    getImage(nft) {
      if (nft.image.startsWith("ipfs")) {
        return "https://ipfs.io/" + nft.image.replace(":", "");
      }
      return nft.image;
    },
  },
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  display: block;
}
h1 {
  width: 100%;
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
