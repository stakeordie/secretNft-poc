<template>
  <div class="nft-details" v-if="nftInfo">
    <h2 class="title">{{ nftInfo.name }}</h2>
    <span class="sub-title"> Description </span>
    <p class="description">{{ nftInfo.description }}</p>
    <p class="owner">Owner: {{ owner }}</p>
    <p class="owner" v-if="ownerName">Owner name: {{ ownerName }}</p>
    <img style="width: 300px; height: 300px" :src="getImage(nftInfo)" /> <br />
    <button @click="burnNFT()">Burn this NFT</button>
    <hr />
    <div class="private-metadata" v-if="privateMetadata">
      <h4>Private Metadata</h4>
      <p class="title">Name: {{ privateMetadata.name }}</p>
      <p class="description">Description: {{ privateMetadata.description }}</p>
      <p class="image">Image: {{ privateMetadata.image }}</p>
    </div>
    <hr />
    <div class="transfer-nft">
      <h4>Transfer this nft</h4>
      <input type="text" placeholder="Address" v-model="recipientAddr" />
      <button @click="transferNft()" :disabled="disabledTransferButton">
        Transfer
      </button>
    </div>
    <br />
    <br />
    <div>
      <h4>Change the description</h4>
      <input type="text" placeholder="new description" v-model="description" />
      <button @click="changeDescription">Accept new description</button>
    </div>
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
    name: "techDaddy",
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
import P5 from "p5";

export default {
  name: "NftDetails",
  data() {
    return {
      tokenId: "",
      owner: "",
      recipientAddr: "",
      privateMetadata: null,
      nftInfo: null,
      ownerName: "",
      contractInfo: {
        sourcecode: "",
      },
      publicMetadata: {
        description: "",
      },
    };
  },
  async mounted() {
    onAccountAvailable(async () => {
      this.tokenId = this.$route.params.tokenId;
      await this.getContractInfo();
      const fn = this.getFunction();
      new P5((_) => fn(_, this.tokenId));
      console.log(fn);
    });
  },
  computed: {
    disabledTransferButton() {
      return !this.recipientAddr;
    },
  },
  methods: {
    async getNFTInfo() {
      this.getOwnerOf();
      this.getPrivateMetadata();

      const { nft_info } = await sodt.getNftInfo(this.tokenId);
      if (nft_info.properties) {
        const properties = JSON.parse(nft_info.properties);
        this.nftInfo = { ...nft_info, ...properties };
      } else {
        this.nftInfo = nft_info;
      }
      console.log("getNFTInfo: ", this.nftInfo);
    },
    async getOwnerOf() {
      const { owner_of } = await sodt.getOwnerOf(this.tokenId);
      if (owner_of.owner) {
        const { owner } = owner_of;
        this.owner = owner;
        const userInfo = users.filter((user) => user.token == this.owner);
        const [first] = userInfo;
        this.ownerName = first.name;
        console.log("owner: ", this.owner);
      } else {
        return;
      }
    },
    async changeDescription() {
      const res = await sodt.setMetadata(this.tokenId, this.publicMetadata);
      console.log(res);
    },
    async burnNFT() {
      console.log("burning NFT");
      const res = await sodt.burnNFT(this.tokenId);
      if (res) {
        console.log("burned " + this.tokenId + " succesfully");
      }
      console.log("burnNFT Response: ", res);

      this.goToMainPage("Burned");
    },
    async transferNft() {
      console.log("Transfering assets");
      if (!this.recipientAddr) return;

      const res = await sodt.transfer(
        this.recipientAddr,
        this.tokenId,
        `You will transfer ownership of this asset to ${this.recipientAddr}`
      );
      console.log("NFT Transfered Response: ", res);

      this.goToMainPage("Transfered");
    },
    async getPrivateMetadata() {
      console.log("getting private metadata");
      const { private_metadata } = await sodt.getPrivateMetadata(this.tokenId);
      console.log("private_metadata", private_metadata);
      this.privateMetadata = private_metadata;
      console.log("getPrivateMetadata: ", this.privateMetadata);
    },
    goToMainPage(action) {
      alert("The NFT was " + action);
      this.$router.push({ name: "TransferAsset" });
    },
    getImage(nft) {
      if (nft.image.startsWith("ipfs")) {
        return "https://ipfs.io/" + nft.image.replace(":", "");
      }
      return nft.image;
    },
    async getContractInfo() {
      const contractInfo = await sodt.contractInfo();
      const { contract_info } = contractInfo;
      this.contractInfo = contract_info;
    },
    getFunction() {
      const code = "(" + this.contractInfo.sourcecode + ")";
      const functionFromCode = eval(code);
      return functionFromCode;
    },
  },
};
</script>

<style></style>
