<template>
    <div class="approve-revoke">
        <h1>Approve or revoke permissions</h1>
        <div class="form">
            <div class="section">
                <select name="" id="" v-model="permissionToken">
                <option value="">Select a NFT from your collection</option>
                <option v-bind:key="t" v-for="t in tokens" :v-model="t">
                    {{ t }}
                </option>
                </select>
            </div>
            <div class="section">
                <span>For all tokens</span>
                <input type="checkbox" name="expires" v-model="forAll">
                <span>Expires</span>
                <input type="checkbox" name="expires" v-model="perrmisionWithExpiration">
                <span v-if="perrmisionWithExpiration">
                    <input type="number" name="expiration-date" placeholder="seconds" v-model="expirationDate">
                </span>
            </div>
            <div class="section">
                <span>Make private data visible</span>
                <br>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(true, 'data')">yes</button>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(false, 'data')">no</button>
                <br>
                <br>
                <br>
                <span>Make ownership visible</span>
                <br>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(true, 'ownership')">yes</button>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(false, 'ownership')">no</button>
                <br>
                <br>
                <br>
                <span>Make it all visible</span>
                <br>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(true)">yes</button>
                <button :disabled="disabledBurnNftButton" @click="globalApproval(false)">no</button>
                <br>
                <br>
                <br>
                <span>Make ownership private for all my nfts</span>
                <button @click="makeOwnershipPrivate">Hacer privado mombre y mi direccion</button>

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
  name: "HandlePrivacy",
  data() {
    return {
      permissionToken: "",
      permissionAddr: "",
      perrmisionWithExpiration: false,
      forAll: false,
      expirationDate: null,
      view_owner: "",
      view_priavte_metadata: "",
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
  computed: {
      disabledBurnNftButton() {
          return !this.permissionToken && !this.forAll;
      },
  },
  methods: {
    async getTokens() {
      const address = getAddress();
      const { token_list } = await sodt.getTokens(address);
      const { tokens } = token_list;
      this.tokens = tokens;
    },
    async makeOwnershipPrivate() {
        let res = null;
        res = await sodt.makeOwnershipPrivate();
        let utf8decoder = new TextDecoder();
        console.log(utf8decoder.decode(res.response.data));
    },
    getVarriables(visible) {
        if(this.forAll) {
            if(visible == true) {
                this.view_owner = "all";
                this.view_priavte_metadata = "all"
            }
            if(visible == false) {
                this.view_owner = "none";
                this.view_priavte_metadata = "none"
            }
        }
        else {
            if(visible == true) {
                this.view_owner = "approve_token"
                this.view_priavte_metadata = "approve_token"
            }
            if(visible == false) {
                this.view_owner = "revoke_token"
                this.view_priavte_metadata = "revoke_token"
            }
        }
    },
    async globalApproval(visible, type) {
        this.getVarriables(visible)
        if(this.forAll) {
            this.getGlobalApprovalForAll(type)
        }
        else {
            this.getGlobalApprovalForToken(type)
        }
    },
    async getGlobalApprovalForAll(type) {
        let res = null;
        if(!type) {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.view_owner,
                    this.view_priavte_metadata,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.view_owner,
                    this.view_priavte_metadata,
                    "never"
                    );
            }
        }
        else if(type == 'ownership') {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.view_owner,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.view_owner,
                    "never"
                    );
            }
        }
        else if(type == 'data') {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.view_priavte_metadata,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.view_priavte_metadata,
                    "never"
                    );
            }
        }

        let utf8decoder = new TextDecoder();
        console.log(utf8decoder.decode(res.response.data));
    },
    async getGlobalApprovalForToken(type) {
        let res = null;
        if(!type) {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_owner,
                    this.view_priavte_metadata,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_owner,
                    this.view_priavte_metadata,
                    "never"
                    );
            }
        }
        else if(type == 'ownership') {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_owner,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_owner,
                    "never"
                    );
            }
        }
        else if(type == 'data') {
            if (this.perrmisionWithExpiration) {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_priavte_metadata,
                    {"at_time":this.expirationDate}
                    );
            }
            else {
                res = await sodt.setGlobalApproval(
                    this.permissionToken,
                    this.view_priavte_metadata,
                    "never"
                    );
            }
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
