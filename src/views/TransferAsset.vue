<template>
  <div id="app">
    <h1>Transfer your assets to recepient</h1>
    <form @submit.prevent="transfer">
      <select @change="getNFTInfo" name="" id="" v-model="tokenSelected">
        <option value="">Select a NFT from your collection</option>
        <option v-bind:key="t" v-for="t in tokens" :v-model="t">
          {{ t }}
        </option>
      </select>
      <input type="text" v-model="recipientAddr" />
      <button :disabled="disabledTransferButton">Transfer</button>
    </form>
    <button @click="burnNFT" :disabled="disabledBurnNftButton">Burn NFT</button>
    <button @click="$router.push({name: 'NftDetails', params: { tokenId: tokenSelected }})" :disabled="disabledBurnNftButton">Nft Details</button>
    <button class="vk" @click="createViewingKey">createViewingKey</button>
    <dl>
      <h2>NFT token info:</h2>
      <dt>Name :</dt>
      <dd>{{ this.nftInfo.name }}</dd>
      <dt>Owner :</dt>
      <dd>{{ NFTOwner }}</dd>
      <dt>Description :</dt>
      <dd>{{ this.nftInfo.description }}</dd>
      <dt>Rarity :</dt>
      <dd v-if="this.nftInfo.rarity">
        {{ this.nftInfo.rarity.number }} out of {{ this.nftInfo.rarity.total }}
      </dd>
      <dt>image :</dt>
      <dd>{{ this.nftInfo.image }}</dd>
      <img v-if="this.nftInfo.image" :src="this.nftInfo.image" style="width:50%; height:50%;" />
    </dl>
    <button @click="addMinters">Add minters</button>
  </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import {
  getAddress,
  onAccountAvailable,
  viewingKeyManager,
} from "@stakeordie/griptape.js";

export default {
  name: "TransferAsset",
  data() {
    return {
      tokenSelected: "",
      recipientAddr: "",
      NFTOwner: "",
      tokens: [],
      nftInfo: {
        rarity: null,
      },
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      await this.getTokens();
    });
  },
  computed: {
      disabledBurnNftButton() {
          return !this.tokenSelected;
      },
      disabledTransferButton() {
          return !this.recipientAddr || !this.tokenSelected;
      }
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
      this.clearNftInfo();
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
      if (nft_info.properties) {
        const properties = JSON.parse(nft_info.properties);
        this.nftInfo = { ...nft_info, ...properties };
        console.log(this.nftInfo);
      } else {
        this.nftInfo = nft_info;
        console.log("getNFTInfo", nft_info);
      }
      this.getOwnerOf();
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
    async burnNFT() {
      console.log("burning NFT");
      const token = this.tokenSelected;
      if(!this.tokenSelected) return;
      const res = await sodt.burnNFT(this.tokenSelected);
      if(res) {
        console.log("burned "+token+" succesfully")
      }
      console.log(res);
      await this.getTokens();
      this.clearNftInfo();
    },
    clearNftInfo() {
        this.nftInfo = {
            rarity: null,
        };
        this.NFTOwner = "";
        this.tokenSelected = "";
    },
    async getOwnerOf() {
      const { owner_of } = await sodt.getOwnerOf(this.tokenSelected);
      if (owner_of.owner) {
        const { owner } = owner_of;
        this.NFTOwner = owner;
        console.log(this.NFTOwner);
      } else return;
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
