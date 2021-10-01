<template>
  <div id="app">
    <h1>List of all NFT’s</h1>
    <ul>
        <li v-bind:key="index" v-for="(nft, index) in allNFTsInfo">
            <h2>{{ tokens[index] }}</h2>
            <img :src="nft.image" style="width:100px;height:100px;cursor:pointer;" @click="$router.push({name: 'NftDetails', params: { tokenId: tokens[index] }})" />
        </li>
    </ul>
  </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import {
  onAccountAvailable,
} from "@stakeordie/griptape.js";

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
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      await this.getAllTokens();
      await this.getAllNFTInfo();
    });
  },
  computed: {
      disabledBurnNftButton() {
          return !this.tokens;
      },
  },
  methods: {
    async getAllTokens() {
      const { token_list } = await sodt.allTokens();
      this.tokens = {...token_list};
      const { tokens } = token_list;
      this.tokens = tokens;
    },
    getAllNFTInfo() {
        this.tokens.forEach(token => {
            this.token = token
            this.getNFTInfo(token)
        })
        console.log(this.allNFTsInfo)
    },
    async getNFTInfo(token) {
            const { nft_info } = await sodt.getNftInfo(token);
            if (nft_info.properties) {
                const properties = JSON.parse(nft_info.properties);
                this.nftInfo = { ...nft_info, ...properties };
                this.allNFTsInfo.push(this.nftInfo)
            } else {
                this.nftInfo = nft_info;
                this.allNFTsInfo.push(this.nftInfo)
            }
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
