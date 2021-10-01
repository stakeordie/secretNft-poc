<template>
    <div class="nft-details" v-if="nftInfo">
        <h2 class="title"> {{ nftInfo.name }} </h2>
        <span class="sub-title"> Description </span>
        <p class="description"> {{ nftInfo.description }} </p>
        <p class="owner">Owner: {{ owner }} </p>
        <p class="owner">Owner name: {{ ownerName }} </p>
        <img :src="this.nftInfo.image" /> <br/>
        <button @click="burnNFT()">Burn NFT</button>
        <hr>
        <div class="transfer-nft">
            <input type="text" placeholder="Address" v-model="recipientAddr" />
            <button @click="transferNft()" :disabled="disabledTransferButton">Transfer</button>
        </div>
    </div>
</template>

<script>

const users = [
    {
        name: "daniel",
        token: "secret1kmvv6z6htwkr4wfaxsx08wqp8yay8kgh5x2xxs"
    },
    {
        name: "haidy",
        token: "secret1enktjqjkjl6efhdssewn3kceufean0heygsak7"
    },
    {
        name: "techDaddy",
        token: "secret1660mkxrw598letk3ztw5lnk98hyf6h7x4w9jrl"
    },
    {
        name: "manuel",
        token: "secret19jr8qetf64taze4ynqfh73vdhdm036hayd3yhn"
    },
    {
        name: "moises",
        token: "secret15re76j9uxu78hnruwknxg4canfsxzv26d3g4g3"
    },
];

import { sodt } from "../contracts/sodt.js";
import { onAccountAvailable } from "@stakeordie/griptape.js";

export default {
    name: 'NftDetails',
    data() {
        return {
            tokenId: "",
            owner: "",
            recipientAddr: "",
            nftInfo: null,
            ownerName: ""
        }
    },
    async mounted() {
        onAccountAvailable(async () => {
            this.tokenId = this.$route.params.tokenId;
            await this.getNFTInfo();
        });
    },
    computed: {
        disabledTransferButton() {
            return !this.recipientAddr;
        }
    },
    methods: {
        async getNFTInfo() {
            this.getOwnerOf();

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
                const userInfo = users.filter(user => user.token == this.owner);
                const [first] = userInfo;
                this.ownerName = first.name;
                console.log("owner: ", this.owner);
            } else { 
                return;
            };
        },
        async burnNFT() {
            console.log("burning NFT");
            const res = await sodt.burnNFT(this.tokenId);
            if(res) {
                console.log("burned " + this.tokenId + " succesfully")
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
        goToMainPage(action) {
            alert("The NFT was " + action);
            this.$router.push({name: 'TransferAsset'});
        }
    }
}
</script>

<style>

</style>