<template>
    <div class="approve-revoke">
        <h1>Approve or revoke permissions</h1>
        <div class="form">
            <div class="section">
                <select @change="getNFTInfo" name="" id="" v-model="permissionToken">
                <option value="">Select a NFT from your collection</option>
                <option v-bind:key="t" v-for="t in tokens" :v-model="t">
                    {{ t }}
                </option>
                </select>
                <input type="text" placeholder="User address" v-model="permissionAddr" />
            </div>
            <div class="section">
                <span>Expires</span>
                <input type="checkbox" name="expires" v-model="perrmisionWithExpiration">
                <span v-if="perrmisionWithExpiration">
                    <input type="number" name="expiration-date" placeholder="seconds" v-model="expirationDate">
                </span>
            </div>
            <div class="section">
                <button @click="approveAddr">Approve</button>  
                <button @click="revokeAddr">Revoke</button>  
                <button @click="approveAllAddr">Approve all</button>  
                <button @click="revokeAllAddr">Revoke all</button>  
            </div> 
        </div>
    </div>
</template>

<script>
import { sodt } from "../contracts/sodt.js";
import {
  getAddress,
  onAccountAvailable,
} from "@stakeordie/griptape.js";

export default {
  name: "App",
  data() {
    return {
      permissionToken: "",
      permissionAddr: "",
      perrmisionWithExpiration: false,
      expirationDate: null,
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
      await this.getTokens();
    });
  },
  methods: {
    async getTokens() {
      const address = getAddress();
      const { token_list } = await sodt.getTokens(address);
      const { tokens } = token_list;
      this.tokens = tokens;
    },
    async getNFTInfo() {
      const { nft_info } = await sodt.getNftInfo(this.tokenSelected);
      const properties = JSON.parse(nft_info.properties);
      this.nftInfo = { ...nft_info, ...properties };
      console.log(this.nftInfo);
    },
    async revokeAddr() {
      if (!this.permissionToken || !this.permissionAddr) return;
      const res = await sodt.revoke(
        this.permissionAddr,
        this.permissionToken
      );

      let utf8decoder = new TextDecoder();
      console.log(utf8decoder.decode(res.response.data));
    },
    async approveAddr() {
      if (!this.permissionToken || !this.permissionAddr) return;

      let res = null;

      if (this.perrmisionWithExpiration) {
        if (this.perrmisionWithExpiration && !this.expirationDate) return; 
        res = await sodt.approve(
          this.permissionAddr,
          this.permissionToken,
          {"at_time": parseInt(this.expirationDate)}
        );
      } else {
        res = await sodt.approve(
          this.permissionAddr,
          this.permissionToken,
          "never"
        );
      }

      let utf8decoder = new TextDecoder();
      console.log(utf8decoder.decode(res.response.data));
    },
    async revokeAllAddr() {
      if (!this.permissionAddr) return;
      const res = await sodt.revokeAll(
        this.permissionAddr,
      );
      
      let utf8decoder = new TextDecoder();
      console.log(utf8decoder.decode(res.response.data));
    },
    async approveAllAddr() {
      if (!this.permissionAddr) return;

      let res = null;

      if (this.perrmisionWithExpiration) {
        if (this.perrmisionWithExpiration && !this.expirationDate) return; 
        res = await sodt.approveAll(
          this.permissionAddr,
          {"at_time": parseInt(this.expirationDate)} 
        );
      } else {
        res = await sodt.approveAll(
          this.permissionAddr,
          "never"
        );
      }

      let utf8decoder = new TextDecoder();
      console.log(utf8decoder.decode(res.response.data));
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
.form {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%
}
.section {
    padding: 16px;
}
</style>
